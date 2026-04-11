"use client";

import Link from "next/link";
import { useAppStore } from "@/stores/appStore";
import { allModules } from "@/data/modules";
import BottomNav from "@/components/layout/BottomNav";
import {
  BookOpen,
  Lock,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { getWordsForReview } from "@/lib/spaced-repetition";

export default function HomePage() {
  const {
    dailyGoal,
    todayWordsLearned,
    todayWordsReviewed,
    wordProgress,
    moduleProgress,
    resetDailyIfNeeded,
  } = useAppStore();

  resetDailyIfNeeded();

  const reviewCount = getWordsForReview(wordProgress).length;
  const dailyTotal = todayWordsLearned + todayWordsReviewed;
  const dailyPercent = Math.min(100, Math.round((dailyTotal / dailyGoal) * 100));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-5">
          <h1 className="text-xl font-bold text-gray-900">MechWords</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Engineering English Vocabulary
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Daily Progress Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Today&apos;s Progress
            </h2>
            <span className="text-sm text-gray-400">
              {dailyTotal}/{dailyGoal} words
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500 bg-blue-600"
              style={{ width: `${dailyPercent}%` }}
            />
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600">
              <BookOpen size={14} className="text-blue-500" />
              <span>{todayWordsLearned} learned</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <RotateCcw size={14} className="text-green-500" />
              <span>{todayWordsReviewed} reviewed</span>
            </div>
          </div>
        </div>

        {/* Review Queue Alert */}
        {reviewCount > 0 && (
          <Link href="/review">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <RotateCcw size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    {reviewCount} words to review
                  </p>
                  <p className="text-xs text-amber-600">
                    Don&apos;t lose your progress!
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-amber-400" />
            </div>
          </Link>
        )}

        {/* Modules List */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Modules
          </h2>
          <div className="space-y-3">
            {allModules.map((mod) => {
              const mp = moduleProgress[mod.id];
              const isUnlocked = mp?.isUnlocked ?? mod.level === 1;
              const wordsCompleted = mp?.wordsCompleted ?? 0;
              const totalWords = mod.words.length;
              const percent = Math.round(
                (wordsCompleted / totalWords) * 100
              );
              const isComplete = wordsCompleted >= totalWords;

              // Find next word to learn
              const nextWordIndex = wordsCompleted;
              const nextWord =
                nextWordIndex < mod.words.length
                  ? mod.words[nextWordIndex]
                  : mod.words[0];

              return (
                <div key={mod.id}>
                  {isUnlocked ? (
                    <Link href={`/learn/${mod.id}/${nextWord.id}`}>
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                isComplete
                                  ? "bg-green-100 text-green-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {isComplete ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                `${mod.level}`
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Lv.{mod.level} {mod.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {mod.nameVi} &middot; {totalWords} words
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-gray-300" />
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isComplete ? "bg-green-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 min-w-[36px] text-right">
                            {percent}%
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Lock size={16} className="text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-500">
                            Lv.{mod.level} {mod.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            Complete previous module to unlock
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
