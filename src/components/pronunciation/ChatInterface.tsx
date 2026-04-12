"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import RecordButton from "./RecordButton";
import { ChatMessage } from "@/stores/pronunciationStore";

interface ChatInterfaceProps {
  targetText: string;
  targetIPA?: string;
  mode: "sentence" | "word";
  initialMessage: string;
  onScoreUpdate?: (
    wordScores: Record<string, { score: number; note: string | null }>,
    transcript: string,
    overallNote: string
  ) => void;
  onWordPassed?: (score: number) => void;
}

export default function ChatInterface({
  targetText,
  targetIPA,
  mode,
  initialMessage,
  onScoreUpdate,
  onWordPassed,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content: initialMessage,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const callChatAPI = async (isVoiceInput: boolean, latestTranscript?: string, userMessage?: string) => {
    setIsLoading(true);

    // Only send non-init messages to API
    const apiMessages = messages
      .filter((m) => m.id !== "init")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/pronunciation/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          targetText,
          targetIPA,
          mode,
          latestTranscript,
          isVoiceInput,
          userMessage,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message as string,
        wordScores: data.wordScores,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (isVoiceInput && data.wordScores && onScoreUpdate) {
        onScoreUpdate(
          data.wordScores as Record<string, { score: number; note: string | null }>,
          latestTranscript!,
          data.message as string
        );
      }
      if (mode === "word" && data.overallScore !== undefined && onWordPassed) {
        onWordPassed(data.overallScore as number);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Có lỗi kết nối. Vui lòng thử lại.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `🎤 "${transcript}"`,
      isVoice: true,
      transcript,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    callChatAPI(true, transcript);
  };

  const handleTextSend = () => {
    const content = textInput.trim();
    if (!content || isLoading) return;
    setTextInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    callChatAPI(false, undefined, content);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {/* Word scores breakdown */}
              {msg.wordScores && Object.keys(msg.wordScores).length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
                  {Object.entries(msg.wordScores).map(([word, { score, note }]) => (
                    <div key={word} className="flex items-start gap-2 text-xs">
                      <span
                        className={`font-semibold shrink-0 ${
                          score >= 80
                            ? "text-green-300"
                            : score >= 50
                            ? "text-amber-300"
                            : "text-red-300"
                        }`}
                      >
                        {word} {score}%
                      </span>
                      {note && <span className="text-white/70 leading-snug">{note}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <Loader2 size={16} className="text-gray-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3 bg-white">
        <RecordButton onTranscriptReady={handleVoiceTranscript} disabled={isLoading} />
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
            placeholder="Hỏi về phát âm..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-gray-50"
          />
          <button
            onClick={handleTextSend}
            disabled={!textInput.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-40 active:scale-95 transition-transform"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
