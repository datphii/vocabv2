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

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

function WordScoreCard({
  wordScores,
}: {
  wordScores: Record<string, { score: number; note: string | null }>;
}) {
  return (
    <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-sm max-w-[85%]">
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 px-3 py-2 border-b border-violet-100">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide">
          Điểm từng từ
        </p>
      </div>
      <div className="p-3 space-y-2">
        {Object.entries(wordScores).map(([word, { score, note }]) => (
          <div key={word}>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-bold w-8 text-right ${
                  score >= 80
                    ? "text-emerald-600"
                    : score >= 50
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                {score}
              </span>
              <ScoreBar score={score} />
              <span className="text-sm font-medium text-gray-800">{word}</span>
            </div>
            {note && (
              <p className="text-xs text-gray-500 ml-[72px] mt-0.5 leading-snug">
                {note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
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

  const callChatAPI = async (
    isVoiceInput: boolean,
    latestTranscript?: string,
    userMessage?: string
  ) => {
    setIsLoading(true);

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
        content: (data.message as string) || "Không nhận được phản hồi. Thử lại nhé.",
        wordScores: data.wordScores,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (isVoiceInput && data.wordScores && onScoreUpdate) {
        onScoreUpdate(data.wordScores, latestTranscript!, data.message as string);
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
    <div className="flex flex-col h-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {/* Chat bubble */}
            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-sm shadow-sm shadow-violet-200"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>

            {/* Word scores as separate card below the message */}
            {msg.wordScores && Object.keys(msg.wordScores).length > 0 && (
              <div className="flex justify-start">
                <WordScoreCard wordScores={msg.wordScores} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="text-violet-400 animate-spin" />
                <span className="text-xs text-gray-400">Đang phân tích...</span>
              </div>
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
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50 bg-gray-50"
          />
          <button
            onClick={handleTextSend}
            disabled={!textInput.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white disabled:opacity-40 active:scale-95 transition-transform shadow-sm shadow-violet-200"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
