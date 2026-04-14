"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { usePronunciationStore } from "@/stores/pronunciationStore";
import { CheckCircle2, Circle, ChevronRight, Mic, Sparkles } from "lucide-react";

export default function ImprovementWordsPage() {
  const router = useRouter();
  const { improvementWords, sentences } = usePronunciationStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pb-20">
      <Header title="Từ cần cải thiện" showBack />

      <div className="max-w-lg mx-auto px-4 py-5 space-y-3">
        {improvementWords.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <p className="text-gray-700 font-semibold mb-1">Tuyệt vời!</p>
            <p className="text-gray-400 text-sm">Không có từ nào cần cải thiện</p>
            <p className="text-gray-400 text-xs mt-1">Luyện câu để xem phân tích từng từ</p>
          </div>
        ) : (
          <>
            {/* Rules reminder */}
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl px-4 py-3 flex items-start gap-2.5">
              <Sparkles size={15} className="text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-700 leading-relaxed">
                Từ được xóa khi thỏa <strong>cả 2</strong>:{" "}
                <span className="font-medium">luyện riêng đúng</span> ✅ và{" "}
                <span className="font-medium">đọc đúng trong tất cả câu chứa từ đó</span> ✅
              </p>
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
                  className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-violet-400 text-left active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-gray-900 text-lg">{item.word}</span>
                    <div className="flex items-center gap-2">
                      {qualified && (
                        <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          Hoàn thành ✓
                        </span>
                      )}
                      <ChevronRight size={16} className="text-violet-300" />
                    </div>
                  </div>

                  {/* Condition checklist */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div
                      className={`flex items-center gap-1.5 font-medium ${
                        item.passedInWordList ? "text-emerald-600" : "text-gray-400"
                      }`}
                    >
                      {item.passedInWordList ? (
                        <CheckCircle2 size={13} className="text-emerald-500" />
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
                          className={`flex items-center gap-1.5 font-medium ${
                            passed ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          {passed ? (
                            <CheckCircle2 size={13} className="text-emerald-500" />
                          ) : (
                            <Circle size={13} />
                          )}
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
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-violet-300 text-violet-500 text-sm font-medium hover:bg-violet-50 transition-colors"
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
