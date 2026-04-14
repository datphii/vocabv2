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

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 size={24} className="text-violet-500 animate-spin" />
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
            className="text-violet-600 text-sm font-semibold"
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
      : `Chào mừng trở lại! Lần luyện thứ ${sessionCount + 1}:\n\n"${sentence.text}"\n\nNhấn 🎤 khi sẵn sàng!`;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header
        title={`Phiên luyện #${sessionCount + 1}`}
        showBack
      />

      {/* Sentence display */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100 px-4 py-4 shrink-0">
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-2">
          Câu luyện tập
        </p>
        <WordColorDisplay sentence={sentence} className="text-base" />

        {/* Legend */}
        <div className="flex gap-3 mt-3">
          {[
            { color: "bg-emerald-400", label: "Đúng ≥80%" },
            { color: "bg-amber-400", label: "Khá 50–79%" },
            { color: "bg-rose-400", label: "Cần luyện <50%" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
              {label}
            </span>
          ))}
        </div>
      </div>

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
