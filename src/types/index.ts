export interface Module {
  id: string;
  level: number;
  name: string;
  nameVi: string;
  description: string;
  wordCount?: number;
  isFree?: boolean;
  words: Word[];
}

export interface Word {
  id: string;
  term: string;
  ipa: string;
  pronunciationHint: string;
  partOfSpeech: string;
  definitionEn: string;
  definitionVi: string;
  visualSvg?: string;
  visualCaption?: string;
  difficulty: number;
  notes?: string;
  audioUrl?: string;
  contexts: WordContext[];
  collocations: Collocation[];
  practiceQuestions?: PracticeQuestion[];
}

export interface WordContext {
  scenarioType: "standard" | "email" | "interview" | "meeting";
  scenarioIcon: string;
  sentence: string;
  sentenceVi?: string;
  highlightTerm: string;
}

export interface Collocation {
  text: string;
  type: "common" | "confused" | "related";
  note?: string;
}

export interface PracticeQuestion {
  type: "fill_in" | "explain" | "flashcard";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  contextType?: string;
}

export interface UserProgress {
  wordId: string;
  masteryLevel: 0 | 1 | 2 | 3;
  correctStreak: number;
  totalReviews: number;
  totalCorrect: number;
  nextReviewAt: string | null;
  lastReviewedAt: string | null;
}

export type ReviewResult = "easy" | "hard" | "forgot";

export interface UserModuleProgress {
  moduleId: string;
  wordsCompleted: number;
  isUnlocked: boolean;
  completedAt: string | null;
}

export interface DailyStats {
  date: string;
  wordsLearned: number;
  wordsReviewed: number;
}
