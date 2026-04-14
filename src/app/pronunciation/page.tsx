"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WordColorDisplay from "@/components/pronunciation/WordColorDisplay";
import { usePronunciationStore } from "@/stores/pronunciationStore";
import { Plus, Trash2, AlertTriangle, ChevronRight, Mic, X, Loader2, Sparkles } from "lucide-react";

export default function PronunciationHubPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { sentences, improvementWords, addSentence, removeSentence } = usePronunciationStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pb-20">
        <Header title="Phát Âm" />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-violet-500 animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const id = addSentence(trimmed);
    setNewText("");
    setShowAdd(false);
    router.push(`/pronunciation/sentence/${id}`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Xóa câu này khỏi danh sách luyện tập?")) removeSentence(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 pb-20">
      <Header
        title="Phát Âm"
        rightElement={
          <button
            onClick={() => setShowAdd((v) => !v)}
            className={`flex items-center gap-1.5 text-sm font-medium py-1.5 px-3 rounded-xl transition-all ${
              showAdd
                ? "bg-gray-100 text-gray-600"
                : "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm shadow-violet-200"
            }`}
          >
            {showAdd ? <X size={16} /> : <Plus size={16} />}
            {showAdd ? "Đóng" : "Thêm câu"}
          </button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* Add form */}
        {showAdd && (
          <div className="bg-white rounded-2xl p-4 shadow-md border border-violet-100">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles size={15} className="text-violet-500" />
              Nhập câu cần luyện phát âm
            </p>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder='Ví dụ: "The weather is beautiful today"'
              rows={3}
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAdd(); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAdd}
                disabled={!newText.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold disabled:opacity-40 shadow-sm"
              >
                Thêm &amp; Luyện ngay
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewText(""); }}
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-500 text-sm hover:bg-gray-200"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Improvement words banner */}
        {improvementWords.length > 0 && (
          <button
            onClick={() => router.push("/pronunciation/words")}
            className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-amber-800">Từ cần cải thiện</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {improvementWords.length} từ đang chờ luyện tập
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-amber-400" />
          </button>
        )}

        {/* Empty state */}
        {sentences.length === 0 && !showAdd ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-violet-200">
              <Mic size={32} className="text-white" />
            </div>
            <p className="text-gray-700 font-semibold mb-1">Chưa có câu luyện tập</p>
            <p className="text-gray-400 text-sm mb-6">Thêm câu để bắt đầu luyện phát âm</p>
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold shadow-md shadow-violet-200"
            >
              <Plus size={16} />
              Thêm câu đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sentences.map((sentence) => {
              const total = Object.keys(sentence.wordStats).length;
              const green = Object.values(sentence.wordStats).filter((w) => w.status === "green").length;
              const yellow = Object.values(sentence.wordStats).filter((w) => w.status === "yellow").length;
              const red = Object.values(sentence.wordStats).filter((w) => w.status === "red").length;
              const sessionCount = sentence.sessions.length;
              const hasData = total > 0 && sessionCount > 0;

              return (
                <div
                  key={sentence.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-violet-400"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1">
                      <WordColorDisplay sentence={sentence} className="text-base" />
                    </div>
                    <button
                      onClick={(e) => handleDelete(sentence.id, e)}
                      className="p-1.5 text-gray-300 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {sessionCount} lần luyện
                      </span>
                      {hasData && (
                        <span className="flex items-center gap-1.5">
                          {green > 0 && (
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                              {green}✓
                            </span>
                          )}
                          {yellow > 0 && (
                            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                              {yellow}~
                            </span>
                          )}
                          {red > 0 && (
                            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
                              {red}✗
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/pronunciation/sentence/${sentence.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform"
                    >
                      <Mic size={13} />
                      Luyện tập
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
