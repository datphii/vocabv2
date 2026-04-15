"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Cloud, CloudOff, Loader2, X } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { usePronunciationStore } from "@/stores/pronunciationStore";
import { loadFromCloud, saveToCloud } from "@/lib/sync";

export default function SyncProvider() {
  const { userId, setUserId } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "saved" | "error">("idle");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { setMounted(true); }, []);

  // Show setup modal if no userId after mount
  useEffect(() => {
    if (mounted && !userId) setShowSetup(true);
  }, [mounted, userId]);

  // Load data from cloud when userId is set
  const loadData = useCallback(async (uid: string) => {
    setSyncStatus("syncing");
    try {
      const data = await loadFromCloud(uid);
      if (data?.pronunciation_data) {
        const pd = data.pronunciation_data as {
          sentences?: unknown[];
          improvementWords?: unknown[];
        };
        if (Array.isArray(pd.sentences) && Array.isArray(pd.improvementWords)) {
          usePronunciationStore.getState().setFromCloud({
            sentences: pd.sentences as never,
            improvementWords: pd.improvementWords as never,
          });
        }
      }
      setSyncStatus("saved");
    } catch {
      setSyncStatus("error");
    }
  }, []);

  useEffect(() => {
    if (userId) loadData(userId);
  }, [userId, loadData]);

  // Auto-save on store changes (debounced 3s)
  const scheduleSync = useCallback(() => {
    if (!userId) return;
    clearTimeout(saveTimerRef.current);
    clearTimeout(savedTimerRef.current);
    setSyncStatus("syncing");
    saveTimerRef.current = setTimeout(async () => {
      const { sentences, improvementWords } = usePronunciationStore.getState();
      try {
        await saveToCloud(userId, { sentences, improvementWords });
        setSyncStatus("saved");
        savedTimerRef.current = setTimeout(() => setSyncStatus("idle"), 2000);
      } catch {
        setSyncStatus("error");
      }
    }, 3000);
  }, [userId]);

  useEffect(() => {
    const unsub = usePronunciationStore.subscribe(scheduleSync);
    return () => {
      unsub();
      clearTimeout(saveTimerRef.current);
      clearTimeout(savedTimerRef.current);
    };
  }, [scheduleSync]);

  const handleSetup = async () => {
    const id = email.trim().toLowerCase();
    if (!id) return;
    setUserId(id);
    setShowSetup(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Setup modal */}
      {showSetup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold text-gray-900">Đồng bộ dữ liệu</h2>
              <button onClick={() => setShowSetup(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Nhập email để lưu tiến độ luyện phát âm lên cloud — dùng được trên mọi thiết bị.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetup()}
              placeholder="email@example.com"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 mb-3"
            />
            <button
              onClick={handleSetup}
              disabled={!email.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold text-sm disabled:opacity-40 shadow-sm"
            >
              Bắt đầu đồng bộ
            </button>
            <button
              onClick={() => setShowSetup(false)}
              className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600"
            >
              Bỏ qua — chỉ lưu trên máy này
            </button>
          </div>
        </div>
      )}

      {/* Sync status indicator (top-right, subtle) */}
      {userId && syncStatus !== "idle" && (
        <div className="fixed top-3 right-3 z-40 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border shadow-sm text-xs font-medium">
          {syncStatus === "syncing" && (
            <>
              <Loader2 size={12} className="text-violet-500 animate-spin" />
              <span className="text-gray-500">Đang lưu...</span>
            </>
          )}
          {syncStatus === "saved" && (
            <>
              <Cloud size={12} className="text-emerald-500" />
              <span className="text-emerald-600">Đã lưu</span>
            </>
          )}
          {syncStatus === "error" && (
            <>
              <CloudOff size={12} className="text-rose-500" />
              <span className="text-rose-600">Lỗi kết nối</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
