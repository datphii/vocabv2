"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/stores/appStore";
import { allModules } from "@/data/modules";
import { getWordsForReview } from "@/lib/spaced-repetition";
import { Word } from "@/types";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import FlashcardRecall from "@/components/practice/FlashcardRecall";
import { Inbox } from "lucide-react";

export default function ReviewPage() {
  const router = useRouter();
  const { wordProgress, reviewWord } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get words due for review
  const reviewWordIds = useMemo(
    () => getWordsForReview(wordProgress),
    [wordProgress]
  );

  // Find actual word objects
  const reviewWords: Word[] = useMemo(() => {
    const allWords = allModules.flatMap((m) => m.words);
    return reviewWordIds
      .map((id) => allWords.find((w) => w.id === id))
      .filter((w): w is Word => w !== undefined);
  }, [reviewWordIds]);

  // Empty state
  if (reviewWords.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header title="Review Queue" />
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Inbox size={28} className="text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            No reviews due
          </h2>
          <p className="text-sm text-gray-400 text-center">
            Learn new words and they will appear here when it&apos;s time to review.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Learn New Words
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // All reviewed
  if (currentIndex >= reviewWords.length) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <Header title="Review Complete" />
        <div className="flex flex-col items-center justify-center px-6 py-20">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            All caught up!
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            You reviewed {reviewWords.length} words.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const currentWord = reviewWords[currentIndex];

  return (
    <div className="min-h-screen bg-white pb-8">
      <Header
        title={`Review ${currentIndex + 1}/${reviewWords.length}`}
        showBack
      />

      {/* Progress bar */}
      <div className="max-w-lg mx-auto px-4 pt-3">
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{
              width: `${(currentIndex / reviewWords.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        <FlashcardRecall
          key={currentWord.id}
          word={currentWord}
          onResult={(result) => {
            reviewWord(currentWord.id, result);
            setCurrentIndex((i) => i + 1);
          }}
        />
      </div>
    </div>
  );
}
