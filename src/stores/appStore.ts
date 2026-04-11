"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProgress, UserModuleProgress, ReviewResult } from "@/types";
import {
  calculateNextReview,
  createInitialProgress,
} from "@/lib/spaced-repetition";

interface AppState {
  // User progress per word
  wordProgress: Record<string, UserProgress>;
  // Module progress
  moduleProgress: Record<string, UserModuleProgress>;
  // Daily stats
  dailyGoal: number;
  todayWordsLearned: number;
  todayWordsReviewed: number;
  todayDate: string;
  // Settings
  showVietnamese: boolean;

  // Actions
  markWordLearned: (wordId: string) => void;
  reviewWord: (wordId: string, result: ReviewResult) => void;
  getWordProgress: (wordId: string) => UserProgress;
  unlockModule: (moduleId: string) => void;
  updateModuleCompletion: (moduleId: string, wordsCompleted: number) => void;
  resetDailyIfNeeded: () => void;
  setShowVietnamese: (show: boolean) => void;
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      wordProgress: {},
      moduleProgress: {
        "lv1-drawing-basics": {
          moduleId: "lv1-drawing-basics",
          wordsCompleted: 0,
          isUnlocked: true,
          completedAt: null,
        },
      },
      dailyGoal: 15,
      todayWordsLearned: 0,
      todayWordsReviewed: 0,
      todayDate: getTodayString(),
      showVietnamese: true,

      markWordLearned: (wordId: string) => {
        const state = get();
        state.resetDailyIfNeeded();
        if (state.wordProgress[wordId]) return; // already learned

        const progress = createInitialProgress(wordId);
        progress.masteryLevel = 1;
        progress.lastReviewedAt = new Date().toISOString();

        set((s) => ({
          wordProgress: { ...s.wordProgress, [wordId]: progress },
          todayWordsLearned: s.todayWordsLearned + 1,
        }));
      },

      reviewWord: (wordId: string, result: ReviewResult) => {
        const state = get();
        state.resetDailyIfNeeded();
        const current =
          state.wordProgress[wordId] || createInitialProgress(wordId);
        const updated = calculateNextReview(current, result);

        set((s) => ({
          wordProgress: { ...s.wordProgress, [wordId]: updated },
          todayWordsReviewed: s.todayWordsReviewed + 1,
        }));
      },

      getWordProgress: (wordId: string) => {
        const state = get();
        return state.wordProgress[wordId] || createInitialProgress(wordId);
      },

      unlockModule: (moduleId: string) => {
        set((s) => ({
          moduleProgress: {
            ...s.moduleProgress,
            [moduleId]: {
              moduleId,
              wordsCompleted: 0,
              isUnlocked: true,
              completedAt: null,
            },
          },
        }));
      },

      updateModuleCompletion: (moduleId: string, wordsCompleted: number) => {
        set((s) => ({
          moduleProgress: {
            ...s.moduleProgress,
            [moduleId]: {
              ...s.moduleProgress[moduleId],
              moduleId,
              wordsCompleted,
              isUnlocked: true,
              completedAt: null,
            },
          },
        }));
      },

      resetDailyIfNeeded: () => {
        const today = getTodayString();
        const state = get();
        if (state.todayDate !== today) {
          set({
            todayDate: today,
            todayWordsLearned: 0,
            todayWordsReviewed: 0,
          });
        }
      },

      setShowVietnamese: (show: boolean) => {
        set({ showVietnamese: show });
      },
    }),
    {
      name: "mechwords-storage",
    }
  )
);
