"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WordStatus = "green" | "yellow" | "red" | "untested";

export interface WordStat {
  attempts: number;
  totalScore: number;
  avgScore: number;
  status: WordStatus;
  lastNote?: string;
}

export interface SentenceSession {
  id: string;
  date: string;
  transcript: string;
  wordScores: Record<string, number>;
  overallNote: string;
}

export interface PracticeSentence {
  id: string;
  text: string;
  addedAt: string;
  wordStats: Record<string, WordStat>;
  sessions: SentenceSession[];
}

export interface ImprovementWord {
  word: string;
  sourceSentenceIds: string[];
  addedAt: string;
  passedInWordList: boolean;
  passedInSentences: Record<string, boolean>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isVoice?: boolean;
  transcript?: string;
  wordScores?: Record<string, { score: number; note: string | null }>;
  rhythmNote?: string;
  timestamp: string;
}

export function cleanWord(token: string): string {
  return token.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
}

function scoreToStatus(score: number): WordStatus {
  if (score >= 80) return "green";
  if (score >= 50) return "yellow";
  return "red";
}

function isQualifiedForRemoval(word: ImprovementWord): boolean {
  if (!word.passedInWordList) return false;
  return word.sourceSentenceIds.every((sid) => word.passedInSentences[sid] === true);
}

interface PronunciationState {
  sentences: PracticeSentence[];
  improvementWords: ImprovementWord[];

  addSentence: (text: string) => string;
  removeSentence: (id: string) => void;
  getSentence: (id: string) => PracticeSentence | undefined;

  updateWordScores: (
    sentenceId: string,
    transcript: string,
    wordScores: Record<string, { score: number; note: string | null }>,
    overallNote: string
  ) => void;

  markWordPassedInList: (word: string) => void;
}

export const usePronunciationStore = create<PronunciationState>()(
  persist(
    (set, get) => ({
      sentences: [],
      improvementWords: [],

      addSentence: (text: string) => {
        const id = Date.now().toString();
        const rawWords = text.trim().split(/\s+/);
        const wordStats: Record<string, WordStat> = {};

        rawWords.forEach((raw) => {
          const word = cleanWord(raw);
          if (word && !wordStats[word]) {
            wordStats[word] = { attempts: 0, totalScore: 0, avgScore: 0, status: "untested" };
          }
        });

        set((s) => ({
          sentences: [
            ...s.sentences,
            { id, text: text.trim(), addedAt: new Date().toISOString(), wordStats, sessions: [] },
          ],
        }));
        return id;
      },

      removeSentence: (id: string) => {
        set((s) => ({
          sentences: s.sentences.filter((sentence) => sentence.id !== id),
          improvementWords: s.improvementWords
            .map((w) => ({
              ...w,
              sourceSentenceIds: w.sourceSentenceIds.filter((sid) => sid !== id),
            }))
            .filter((w) => w.sourceSentenceIds.length > 0),
        }));
      },

      getSentence: (id: string) => get().sentences.find((s) => s.id === id),

      updateWordScores: (sentenceId, transcript, wordScores, overallNote) => {
        set((state) => {
          const sentence = state.sentences.find((s) => s.id === sentenceId);
          if (!sentence) return state;

          const session: SentenceSession = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            transcript,
            wordScores: Object.fromEntries(
              Object.entries(wordScores).map(([w, { score }]) => [cleanWord(w), score])
            ),
            overallNote,
          };

          // Update word stats
          const newWordStats = { ...sentence.wordStats };
          Object.entries(wordScores).forEach(([rawWord, { score, note }]) => {
            const word = cleanWord(rawWord);
            if (!word) return;
            const existing = newWordStats[word] || {
              attempts: 0,
              totalScore: 0,
              avgScore: 0,
              status: "untested" as WordStatus,
            };
            const attempts = existing.attempts + 1;
            const totalScore = existing.totalScore + score;
            const avgScore = Math.round(totalScore / attempts);
            newWordStats[word] = {
              attempts,
              totalScore,
              avgScore,
              status: scoreToStatus(avgScore),
              lastNote: note ?? undefined,
            };
          });

          const newSentences = state.sentences.map((s) =>
            s.id === sentenceId
              ? { ...s, wordStats: newWordStats, sessions: [...s.sessions, session] }
              : s
          );

          // Sync improvement words
          let newImprovementWords = [...state.improvementWords];

          Object.entries(newWordStats).forEach(([word, stat]) => {
            if (stat.status === "yellow" || stat.status === "red") {
              const existing = newImprovementWords.find((w) => w.word === word);
              if (!existing) {
                newImprovementWords.push({
                  word,
                  sourceSentenceIds: [sentenceId],
                  addedAt: new Date().toISOString(),
                  passedInWordList: false,
                  passedInSentences: {},
                });
              } else if (!existing.sourceSentenceIds.includes(sentenceId)) {
                newImprovementWords = newImprovementWords.map((w) =>
                  w.word === word
                    ? { ...w, sourceSentenceIds: [...w.sourceSentenceIds, sentenceId] }
                    : w
                );
              }
            }

            if (stat.status === "green") {
              newImprovementWords = newImprovementWords.map((w) =>
                w.word === word
                  ? { ...w, passedInSentences: { ...w.passedInSentences, [sentenceId]: true } }
                  : w
              );
            }
          });

          // Auto-remove qualified words
          newImprovementWords = newImprovementWords.filter((w) => !isQualifiedForRemoval(w));

          return { sentences: newSentences, improvementWords: newImprovementWords };
        });
      },

      markWordPassedInList: (word: string) => {
        set((state) => {
          const updated = state.improvementWords.map((w) =>
            w.word === word ? { ...w, passedInWordList: true } : w
          );
          return {
            improvementWords: updated.filter((w) => !isQualifiedForRemoval(w)),
          };
        });
      },
    }),
    { name: "mechwords-pronunciation" }
  )
);
