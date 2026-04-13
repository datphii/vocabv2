"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import WordColorDisplay from "@/components/pronunciation/WordColorDisplay";
import ChatInterface from "@/components/pronunciation/ChatInterface";
import { usePronunciationStore } from "@/stores/pronunciationStore";
import { Loader2 } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function SentencePracticePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { getSentence, updateWordScores } = usePronunciationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 size={24} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  const sentence = getSentence(id);

  if (!sentence) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center px-6">
          <p className="text-gray-500 mb-4">Không tìm thấy câu luyện tập</p>
          <button
            onClick={() => router.push("/pronunciation")}
            className="text-blue-600 text-sm font-medium"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  const sessionCount = sentence.sessions.length;

  const handleScoreUpdate = (
    wordScores: Record<string, { score: number; note: string | null }>,
    transcript: string,
    overallNote: string
  ) => {
    updateWordScores(id, transcript, wordScores, overallNote);
  };

  const initialMessage =
    sessionCount === 0
      ? `Chào bạn! Hôm nay mình luyện câu:\n\n"${sentence.text}"\n\nNhấn 🎤 và đọc câu đó khi sẵn sàng. Bạn cũng có thể hỏi về cách phát âm bất kỳ từ nào trước nhé!`
      : `Chào mừng trở lại! Lần luyện thứ ${sessionCount + 1} cho câu:\n\n"${sentence.text}"\n\nNhấn 🎤 khi sẵn sàng!`;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title={`Luyện câu — phiên #${sessionCount + 1}`} showBack />

      {/* Sentence + legend */}
      <div className="border-b border-gray-100 px-4 py-3 bg-gray-50 shrink-0">
        <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">
          Câu luyện tập
        </p>
        <WordColorDisplay sentence={sentence} className="text-base" />
        <div className="flex gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            Đúng ≥80%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Khá 50–79%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            Cần luyện &lt;50%
          </span>
        </div>
      </div>

      {/* Chat fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          targetText={sentence.text}
          mode="sentence"
          initialMessage={initialMessage}
          onScoreUpdate={handleScoreUpdate}
        />
      </div>
    </div>
  );
}
