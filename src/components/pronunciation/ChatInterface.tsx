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

function RhythmCard({ rhythmNote }: { rhythmNote: string }) {
  const parts = rhythmNote.split("|");
  return (
    <div className="bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-sm max-w-[90%]">
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-2 border-b border-indigo-100">
        <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
          Nhịp ngắt nghỉ
        </p>
      </div>
      <div className="px-3 py-2.5 flex flex-wrap items-baseline gap-x-0.5 gap-y-1">
        {parts.map((part, i) => (
          <span key={i} className="flex items-baseline gap-0.5">
            <span className="text-sm text-gray-700 leading-relaxed">{part.trim()}</span>
            {i < parts.length - 1 && (
              <span className="text-indigo-400 font-bold text-base px-0.5">|</span>
            )}
          </span>
        ))}
      </div>
      <p className="px-3 pb-2 text-xs text-gray-400">
        Dừng nhẹ tại dấu | để câu nghe tự nhiên hơn
      </p>
    </div>
  );
}

function WordScoreCard({
  wordScores,
}: {
  wordScores: Record<string, { score: number; note: string | null }>;
}) {
  const entries = Object.entries(wordScores);
  const avg = Math.round(entries.reduce((s, [, v]) => s + v.score, 0) / entries.length);
  const good = entries.filter(([, v]) => v.score >= 80);
  const ok = entries.filter(([, v]) => v.score >= 50 && v.score < 80);
  const bad = entries.filter(([, v]) => v.score < 50);

  const avgColor = avg >= 80 ? "text-emerald-600" : avg >= 50 ? "text-amber-600" : "text-rose-600";
  const avgBg = avg >= 80 ? "bg-emerald-50 border-emerald-200" : avg >= 50 ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200";

  return (
    <div className="bg-white border border-violet-100 rounded-2xl overflow-hidden shadow-sm max-w-[90%]">
      {/* Header with overall score */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 px-3 py-2 border-b border-violet-100 flex items-center justify-between">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide">Kết quả phát âm</p>
        <span className={`text-sm font-bold px-2 py-0.5 rounded-full border ${avgBg} ${avgColor}`}>
          {avg}/100
        </span>
      </div>

      <div className="p-3 space-y-2.5">
        {/* Good words — compact pill list */}
        {good.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-emerald-600 mb-1.5">✅ Tốt ({good.length} từ)</p>
            <div className="flex flex-wrap gap-1.5">
              {good.map(([word]) => (
                <span key={word} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Words needing improvement — with score bar + note */}
        {ok.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-amber-600 mb-1.5">🟡 Cần cải thiện ({ok.length} từ)</p>
            <div className="space-y-1.5">
              {ok.map(([word, { score, note }]) => (
                <div key={word} className="bg-amber-50 rounded-xl px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-600 w-7 text-right shrink-0">{score}</span>
                    <div className="w-14 h-1.5 bg-amber-100 rounded-full overflow-hidden shrink-0">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{word}</span>
                  </div>
                  {note && <p className="text-xs text-amber-700 mt-0.5 ml-[52px] leading-snug">{note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {bad.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-rose-600 mb-1.5">🔴 Cần luyện thêm ({bad.length} từ)</p>
            <div className="space-y-1.5">
              {bad.map(([word, { score, note }]) => (
                <div key={word} className="bg-rose-50 rounded-xl px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-600 w-7 text-right shrink-0">{score}</span>
                    <div className="w-14 h-1.5 bg-rose-100 rounded-full overflow-hidden shrink-0">
                      <div className="h-full rounded-full bg-rose-400" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{word}</span>
                  </div>
                  {note && <p className="text-xs text-rose-700 mt-0.5 ml-[52px] leading-snug">{note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
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
  const [isDemoMode, setIsDemoMode] = useState(false);
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

      if (data.isMock) setIsDemoMode(true);

      const assistantMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: (data.message as string) || "Không nhận được phản hồi. Thử lại nhé.",
        wordScores: data.wordScores,
        rhythmNote: data.rhythmNote as string | undefined,
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

            {/* Word scores card */}
            {msg.wordScores && Object.keys(msg.wordScores).length > 0 && (
              <div className="flex justify-start">
                <WordScoreCard wordScores={msg.wordScores} />
              </div>
            )}

            {/* Rhythm / pause guide card */}
            {msg.rhythmNote && (
              <div className="flex justify-start">
                <RhythmCard rhythmNote={msg.rhythmNote} />
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

      {/* Demo mode banner */}
      {isDemoMode && (
        <div className="mx-4 mb-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <span className="text-amber-500 text-xs">⚡</span>
          <p className="text-xs text-amber-700 flex-1">
            Chế độ demo — thêm <code className="font-mono bg-amber-100 px-1 rounded">ANTHROPIC_API_KEY</code> vào <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> để nhận phân tích từ Claude AI
          </p>
        </div>
      )}

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
