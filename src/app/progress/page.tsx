"use client";

import { useAppStore } from "@/stores/appStore";
import { allModules } from "@/data/modules";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import { getMasteryLabel, getMasteryColor } from "@/lib/spaced-repetition";

export default function ProgressPage() {
  const { wordProgress, moduleProgress } = useAppStore();

  const allWords = allModules.flatMap((m) => m.words);
  const totalWords = allWords.length;

  // Stats
  const learned = Object.values(wordProgress).filter(
    (p) => p.masteryLevel >= 1
  ).length;
  const reviewing = Object.values(wordProgress).filter(
    (p) => p.masteryLevel === 2
  ).length;
  const mastered = Object.values(wordProgress).filter(
    (p) => p.masteryLevel === 3
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Progress" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Overview Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Overview
          </h2>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{learned}</p>
              <p className="text-xs text-gray-500 mt-1">Learning</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-500">{reviewing}</p>
              <p className="text-xs text-gray-500 mt-1">Reviewing</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{mastered}</p>
              <p className="text-xs text-gray-500 mt-1">Mastered</p>
            </div>
          </div>

          <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
            {learned > 0 && (
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${((learned - reviewing - mastered) / totalWords) * 100}%`,
                }}
              />
            )}
            {reviewing > 0 && (
              <div
                className="h-full bg-amber-500"
                style={{
                  width: `${(reviewing / totalWords) * 100}%`,
                }}
              />
            )}
            {mastered > 0 && (
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${(mastered / totalWords) * 100}%`,
                }}
              />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">
            {learned}/{totalWords} words started
          </p>
        </div>

        {/* Per-module breakdown */}
        {allModules.map((mod) => {
          const mp = moduleProgress[mod.id];
          const wordsCompleted = mp?.wordsCompleted ?? 0;

          return (
            <div
              key={mod.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Lv.{mod.level} {mod.name}
                </h3>
                <span className="text-xs text-gray-400">
                  {wordsCompleted}/{mod.words.length}
                </span>
              </div>

              <div className="space-y-2">
                {mod.words.map((word) => {
                  const p = wordProgress[word.id];
                  const level = p?.masteryLevel ?? 0;
                  return (
                    <div
                      key={word.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 truncate flex-1">
                        {word.term}
                      </span>
                      <span
                        className={`text-xs font-medium ml-2 ${getMasteryColor(level)}`}
                      >
                        {getMasteryLabel(level)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
