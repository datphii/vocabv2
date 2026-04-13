"use client";

import { PracticeSentence, WordStatus, cleanWord } from "@/stores/pronunciationStore";

const statusClass: Record<WordStatus, string> = {
  green: "text-green-700 bg-green-100 rounded px-0.5",
  yellow: "text-amber-700 bg-amber-100 rounded px-0.5",
  red: "text-red-700 bg-red-100 rounded px-0.5",
  untested: "text-gray-800",
};

interface WordColorDisplayProps {
  sentence: PracticeSentence;
  className?: string;
}

export default function WordColorDisplay({ sentence, className = "" }: WordColorDisplayProps) {
  // Split preserving spaces and punctuation attached to words
  const tokens = sentence.text.split(/(\s+)/);

  return (
    <p className={`leading-relaxed flex flex-wrap items-baseline gap-y-1 ${className}`}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={i}>&nbsp;</span>;

        const word = cleanWord(token);
        const stat = word ? sentence.wordStats[word] : null;
        const status: WordStatus = stat?.status ?? "untested";

        return (
          <span
            key={i}
            className={`font-medium transition-colors cursor-default ${statusClass[status]}`}
            title={stat?.lastNote ?? (stat?.avgScore !== undefined && stat.avgScore > 0 ? `${stat.avgScore}%` : undefined)}
          >
            {token}
          </span>
        );
      })}
    </p>
  );
}
