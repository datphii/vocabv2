"use client";

import { useAppStore } from "@/stores/appStore";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { Globe, Volume2, RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const { showVietnamese, setShowVietnamese } = useAppStore();

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all progress? This cannot be undone."
      )
    ) {
      localStorage.removeItem("mechwords-storage");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Settings" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Vietnamese toggle */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Show Vietnamese
                </p>
                <p className="text-xs text-gray-400">
                  Display Vietnamese translations
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowVietnamese(!showVietnamese)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                showVietnamese ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  showVietnamese ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Audio info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <Volume2 size={18} className="text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Audio</p>
              <p className="text-xs text-gray-400">
                Uses browser speech synthesis (Web Speech API)
              </p>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <button
            onClick={handleReset}
            className="flex items-center gap-3 w-full"
          >
            <RotateCcw size={18} className="text-red-500" />
            <div className="text-left">
              <p className="text-sm font-medium text-red-600">
                Reset All Progress
              </p>
              <p className="text-xs text-gray-400">
                Clear all learning data and start fresh
              </p>
            </div>
          </button>
        </div>

        {/* App info */}
        <div className="text-center pt-8">
          <p className="text-sm font-semibold text-gray-400">MechWords</p>
          <p className="text-xs text-gray-300 mt-1">v0.1.0 — Phase 1 Prototype</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
