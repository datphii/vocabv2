"use client";

import { useState } from "react";
import { Word, ReviewResult } from "@/types";
import { Eye, RotateCcw } from "lucide-react";

interface Props {
  word: Word;
  onResult: (result: ReviewResult) => void;
}

export default function FlashcardRecall({ word, onResult }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center px-6 py-8">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-6">
        Flashcard Recall
      </p>

      {/* Card */}
      <button
        onClick={() => setFlipped(true)}
        className="w-full max-w-sm min-h-[200px] rounded-2xl border-2 border-gray-200 flex flex-col items-center justify-center p-6 transition-all hover:border-blue-300 active:scale-[0.98]"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{word.term}</h2>
        <p className="text-sm text-gray-400 font-mono">{word.ipa}</p>

        {!flipped && (
          <div className="mt-6 flex items-center gap-2 text-blue-500 text-sm">
            <Eye size={16} />
            <span>Tap to reveal meaning</span>
          </div>
        )}

        {flipped && (
          <div className="mt-6 text-center">
            <p className="text-gray-800 leading-relaxed">
              {word.definitionEn}
            </p>
            <p className="text-sm text-gray-500 mt-2 italic">
              {word.definitionVi}
            </p>
          </div>
        )}
      </button>

      {/* Rating buttons */}
      {flipped && (
        <div className="mt-8 flex gap-3 w-full max-w-sm">
          <button
            onClick={() => onResult("forgot")}
            className="flex-1 py-3 rounded-xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
          >
            Forgot
          </button>
          <button
            onClick={() => onResult("hard")}
            className="flex-1 py-3 rounded-xl bg-amber-50 text-amber-600 font-medium text-sm hover:bg-amber-100 transition-colors"
          >
            Hard
          </button>
          <button
            onClick={() => onResult("easy")}
            className="flex-1 py-3 rounded-xl bg-green-50 text-green-600 font-medium text-sm hover:bg-green-100 transition-colors"
          >
            Easy
          </button>
        </div>
      )}

      {!flipped && (
        <button
          onClick={() => setFlipped(true)}
          className="mt-6 flex items-center gap-2 text-gray-400 text-sm hover:text-gray-600"
        >
          <RotateCcw size={14} />
          Flip card
        </button>
      )}
    </div>
  );
}
