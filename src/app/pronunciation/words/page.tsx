"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { usePronunciationStore } from "@/stores/pronunciationStore";
import { CheckCircle2, Circle, ChevronRight, Mic } from "lucide-react";

export default function ImprovementWordsPage() {
  const router = useRouter();
  const { improvementWords, sentences } = usePronunciationStore();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Từ cần cải thiện" showBack />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {improvementWords.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <p className="text-gray-600 font-medium">Không có từ nào cần cải thiện</p>
            <p className="text-gray-400 text-sm mt-1">Luyện câu để xem phân tích từng từ</p>
          </div>
        ) : (
          <>
            {/* Rules reminder */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-xs text-blue-700 leading-relaxed">
              Từ được xóa khi thỏa <strong>cả 2</strong>:{" "}
              <span className="font-medium">luyện riêng đúng</span> ✅ và{" "}
              <span className="font-medium">đọc đúng trong tất cả câu chứa từ đó</span> ✅
            </div>

            {improvementWords.map((item) => {
              const allSentencesPassed = item.sourceSentenceIds.every(
                (sid) => item.passedInSentences[sid] === true
              );
              const qualified = item.passedInWordList && allSentencesPassed;

              return (
                <button
                  key={item.word}
                  onClick={() =>
                    router.push(`/pronunciation/words/${encodeURIComponent(item.word)}`)
                  }
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900 text-lg">{item.word}</span>
                    <div className="flex items-center gap-2">
                      {qualified && (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                          Hoàn thành ✓
                        </span>
                      )}
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </div>

                  {/* Condition checklist */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div
                      className={`flex items-center gap-1.5 ${
                        item.passedInWordList ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {item.passedInWordList ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <Circle size={13} />
                      )}
                      <span>Luyện riêng</span>
                    </div>

                    {item.sourceSentenceIds.map((sid) => {
                      const s = sentences.find((x) => x.id === sid);
                      const passed = item.passedInSentences[sid] === true;
                      const label = s
                        ? `"${s.text.slice(0, 14)}${s.text.length > 14 ? "…" : ""}"`
                        : "Câu đã xóa";
                      return (
                        <div
                          key={sid}
                          className={`flex items-center gap-1.5 ${
                            passed ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {passed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                          <span className="truncate max-w-[110px]">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* Shortcut back to sentences */}
      {improvementWords.length > 0 && (
        <div className="max-w-lg mx-auto px-4 pb-4">
          <button
            onClick={() => router.push("/pronunciation")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-gray-300 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
          >
            <Mic size={16} />
            Quay lại luyện câu
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
