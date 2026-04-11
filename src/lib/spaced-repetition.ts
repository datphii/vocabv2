import { ReviewResult, UserProgress } from "@/types";

const INTERVALS = {
  forgot: 1 * 60 * 60 * 1000, // 1 hour in ms
  hard: 24 * 60 * 60 * 1000, // 1 day in ms
  easy: [3, 7, 14, 30].map((d) => d * 24 * 60 * 60 * 1000), // days in ms
};

export function calculateNextReview(
  progress: UserProgress,
  result: ReviewResult
): UserProgress {
  const now = new Date().toISOString();
  let nextReviewAt: string;
  let masteryLevel = progress.masteryLevel;
  let correctStreak = progress.correctStreak;
  const totalReviews = progress.totalReviews + 1;
  let totalCorrect = progress.totalCorrect;

  if (result === "forgot") {
    correctStreak = 0;
    masteryLevel = 1;
    nextReviewAt = new Date(Date.now() + INTERVALS.forgot).toISOString();
  } else if (result === "hard") {
    correctStreak += 1;
    totalCorrect += 1;
    masteryLevel = correctStreak >= 5 ? 3 : correctStreak >= 2 ? 2 : 1;
    nextReviewAt = new Date(Date.now() + INTERVALS.hard).toISOString();
  } else {
    // easy
    correctStreak += 1;
    totalCorrect += 1;
    masteryLevel = correctStreak >= 5 ? 3 : correctStreak >= 2 ? 2 : 1;
    const easyIndex = Math.min(correctStreak - 1, INTERVALS.easy.length - 1);
    nextReviewAt = new Date(
      Date.now() + INTERVALS.easy[Math.max(0, easyIndex)]
    ).toISOString();
  }

  return {
    ...progress,
    masteryLevel: masteryLevel as 0 | 1 | 2 | 3,
    correctStreak,
    totalReviews,
    totalCorrect,
    nextReviewAt,
    lastReviewedAt: now,
  };
}

export function createInitialProgress(wordId: string): UserProgress {
  return {
    wordId,
    masteryLevel: 0,
    correctStreak: 0,
    totalReviews: 0,
    totalCorrect: 0,
    nextReviewAt: null,
    lastReviewedAt: null,
  };
}

export function getWordsForReview(progressMap: Record<string, UserProgress>): string[] {
  const now = Date.now();
  return Object.entries(progressMap)
    .filter(([, p]) => {
      if (!p.nextReviewAt) return false;
      return new Date(p.nextReviewAt).getTime() <= now;
    })
    .sort(
      ([, a], [, b]) =>
        new Date(a.nextReviewAt!).getTime() -
        new Date(b.nextReviewAt!).getTime()
    )
    .map(([wordId]) => wordId);
}

export function getMasteryLabel(level: number): string {
  switch (level) {
    case 0:
      return "New";
    case 1:
      return "Learning";
    case 2:
      return "Reviewing";
    case 3:
      return "Mastered";
    default:
      return "New";
  }
}

export function getMasteryColor(level: number): string {
  switch (level) {
    case 0:
      return "text-gray-400";
    case 1:
      return "text-orange-500";
    case 2:
      return "text-blue-500";
    case 3:
      return "text-green-500";
    default:
      return "text-gray-400";
  }
}
