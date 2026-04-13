"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WordColorDisplay from "@/components/pronunciation/WordColorDisplay";
import { usePronunciationStore } from "@/stores/pronunciationStore";
import { Plus, Trash2, AlertTriangle, ChevronRight, Mic, X, Loader2 } from "lucide-react";

export default function PronunciationHubPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { sentences, improvementWords, addSentence, removeSentence } = usePronunciationStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Phát Âm" />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-blue-500 animate-spin" />
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
    if (confirm("Xóa câu này khỏi danh sách luyện tập?")) {
      removeSentence(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header
        title="Phát Âm"
        rightElement={
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="flex items-center gap-1 text-blue-600 text-sm font-medium py-1 px-2 rounded-lg hover:bg-blue-50"
          >
            {showAdd ? <X size={18} /> : <Plus size={18} />}
            {showAdd ? "Đóng" : "Thêm câu"}
          </button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {/* Add form */}
        {showAdd && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Nhập câu cần luyện phát âm:
            </p>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder='Ví dụ: "The weather is beautiful today"'
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAdd();
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAdd}
                disabled={!newText.trim()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-blue-700"
              >
                Thêm &amp; Luyện ngay
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewText(""); }}
                className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200"
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
            className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-800">Từ cần cải thiện</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {improvementWords.length} từ đang chờ luyện tập
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-amber-400" />
          </button>
        )}

        {/* Sentence list or empty state */}
        {sentences.length === 0 && !showAdd ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Mic size={28} className="text-blue-500" />
            </div>
            <p className="text-gray-600 font-medium mb-1">Chưa có câu luyện tập</p>
            <p className="text-gray-400 text-sm">Nhấn &quot;Thêm câu&quot; để bắt đầu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sentences.map((sentence) => {
              const total = Object.keys(sentence.wordStats).length;
              const green = Object.values(sentence.wordStats).filter((w) => w.status === "green").length;
              const yellow = Object.values(sentence.wordStats).filter((w) => w.status === "yellow").length;
              const red = Object.values(sentence.wordStats).filter((w) => w.status === "red").length;
              const sessionCount = sentence.sessions.length;

              return (
                <div
                  key={sentence.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1">
                      <WordColorDisplay sentence={sentence} className="text-base" />
                    </div>
                    <button
                      onClick={(e) => handleDelete(sentence.id, e)}
                      className="p-1.5 text-gray-300 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{sessionCount} lần luyện</span>
                      {total > 0 && sessionCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          {green > 0 && <span className="text-green-600">{green}✓</span>}
                          {yellow > 0 && <span className="text-amber-500">{yellow}~</span>}
                          {red > 0 && <span className="text-red-500">{red}✗</span>}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => router.push(`/pronunciation/sentence/${sentence.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 active:scale-95 transition-all"
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
