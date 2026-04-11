"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { getModule } from "@/data/modules";
import { useAppStore } from "@/stores/appStore";
import { PracticeQuestion, Word } from "@/types";
import Header from "@/components/layout/Header";
import FlashcardRecall from "@/components/practice/FlashcardRecall";
import FillInContext from "@/components/practice/FillInContext";
import ExplainChallenge from "@/components/practice/ExplainChallenge";
import { Trophy } from "lucide-react";

function PracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const moduleId = searchParams.get("module") || "lv1-drawing-basics";
  const from = parseInt(searchParams.get("from") || "0");
  const to = parseInt(searchParams.get("to") || "4");

  const reviewWord = useAppStore((s) => s.reviewWord);
  const updateModuleCompletion = useAppStore((s) => s.updateModuleCompletion);

  const mod = getModule(moduleId);
  const words = useMemo(
    () => mod?.words.slice(Math.max(0, from), to + 1) || [],
    [mod, from, to]
  );

  // Build exercise queue: for each word, pick available questions
  const exercises = useMemo(() => {
    const queue: Array<{
      type: "flashcard" | "fill_in" | "explain";
      word: Word;
      question?: PracticeQuestion;
    }> = [];

    words.forEach((word) => {
      // Always add a flashcard
      queue.push({ type: "flashcard", word });

      // Add fill_in if available
      const fillIn = word.practiceQuestions?.find((q) => q.type === "fill_in");
      if (fillIn) queue.push({ type: "fill_in", word, question: fillIn });

      // Add explain if available
      const explain = word.practiceQuestions?.find((q) => q.type === "explain");
      if (explain) queue.push({ type: "explain", word, question: explain });
    });

    return queue;
  }, [words]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  if (!mod || words.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No practice available</p>
      </div>
    );
  }

  // Finished all exercises
  if (currentIndex >= exercises.length) {
    const percentage = Math.round((score.correct / score.total) * 100);

    // Update module progress
    updateModuleCompletion(moduleId, to + 1);

    return (
      <div className="min-h-screen bg-white">
        <Header title="Practice Complete" showBack />
        <div className="flex flex-col items-center justify-center px-6 py-16">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Trophy size={36} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Well done!
          </h2>
          <p className="text-gray-500 mb-6">
            {score.correct}/{score.total} correct ({percentage}%)
          </p>

          <div className="w-full max-w-xs space-y-3">
            {to + 1 < (mod.words.length || 0) && (
              <button
                onClick={() =>
                  router.push(
                    `/learn/${moduleId}/${mod.words[to + 1].id}`
                  )
                }
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Continue Learning
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = exercises[currentIndex];

  const handleResult = (result: "easy" | "hard" | "forgot") => {
    reviewWord(current.word.id, result);
    setScore((s) => ({
      correct: s.correct + (result !== "forgot" ? 1 : 0),
      total: s.total + 1,
    }));
    setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <Header
        title={`Practice ${currentIndex + 1}/${exercises.length}`}
        showBack
      />

      {/* Progress bar */}
      <div className="max-w-lg mx-auto px-4 pt-3">
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{
              width: `${(currentIndex / exercises.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {current.type === "flashcard" && (
          <FlashcardRecall word={current.word} onResult={handleResult} />
        )}
        {current.type === "fill_in" && current.question && (
          <FillInContext question={current.question} onResult={handleResult} />
        )}
        {current.type === "explain" && current.question && (
          <ExplainChallenge
            question={current.question}
            onResult={handleResult}
          />
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-400">Loading...</p>
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
