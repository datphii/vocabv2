"use client";

import { Word } from "@/types";
import { Volume2 } from "lucide-react";

interface Props {
  word: Word;
}

export default function PronunciationTab({ word }: Props) {
  const speak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word.term);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">{word.term}</h2>
      <p className="text-lg text-gray-500 mb-2">{word.ipa}</p>

      <button
        onClick={speak}
        className="my-4 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
      >
        <Volume2 size={28} />
      </button>

      <p className="text-sm text-gray-400 mb-1">Phát âm gợi ý</p>
      <p className="text-base text-gray-700 font-medium">
        {word.pronunciationHint}
      </p>

      {word.notes && (
        <p className="mt-4 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">
          {word.notes}
        </p>
      )}
    </div>
  );
}
