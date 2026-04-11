"use client";

import { useState } from "react";
import { PracticeQuestion, ReviewResult } from "@/types";
import { Check, X } from "lucide-react";

interface Props {
  question: PracticeQuestion;
  onResult: (result: ReviewResult) => void;
}

export default function ExplainChallenge({ question, onResult }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
  };

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="px-6 py-8">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">
        Explain Challenge
      </p>

      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <p className="text-gray-800 text-lg leading-relaxed">
          {question.question}
        </p>
      </div>

      <div className="space-y-3">
        {question.options?.map((option, i) => {
          const letter = String.fromCharCode(65 + i);
          let style =
            "border-gray-200 bg-white text-gray-800 hover:border-blue-300";
          if (answered) {
            if (option === question.correctAnswer) {
              style = "border-green-500 bg-green-50 text-green-800";
            } else if (option === selected && !isCorrect) {
              style = "border-red-500 bg-red-50 text-red-800";
            } else {
              style = "border-gray-100 bg-gray-50 text-gray-400";
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${style}`}
            >
              <div className="flex items-start gap-3">
                <span className="font-bold text-gray-400 min-w-[20px]">
                  {letter}.
                </span>
                <span className="flex-1">{option}</span>
                {answered && option === question.correctAnswer && (
                  <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                )}
                {answered && option === selected && !isCorrect && (
                  <X size={18} className="text-red-500 shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-6">
          <div
            className={`p-3 rounded-lg text-sm mb-4 ${
              isCorrect
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {isCorrect ? "Correct!" : "Incorrect. Review this word again."}
          </div>
          <button
            onClick={() => onResult(isCorrect ? "easy" : "forgot")}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
