"use client";

import { Word } from "@/types";
import { useAppStore } from "@/stores/appStore";

interface Props {
  word: Word;
}

export default function MeaningTab({ word }: Props) {
  const showVietnamese = useAppStore((s) => s.showVietnamese);

  return (
    <div className="px-6 py-8">
      <div className="mb-2">
        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
          {word.partOfSpeech}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
          English
        </h3>
        <p className="text-lg text-gray-900 leading-relaxed">
          {word.definitionEn}
        </p>
      </div>

      {showVietnamese && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Tiếng Việt
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed">
            {word.definitionVi}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Độ khó:</span>
        {[1, 2, 3].map((level) => (
          <span
            key={level}
            className={`w-2 h-2 rounded-full ${
              level <= word.difficulty ? "bg-blue-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
