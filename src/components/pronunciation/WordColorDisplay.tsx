"use client";

import { PracticeSentence, WordStatus, cleanWord } from "@/stores/pronunciationStore";

const statusClass: Record<WordStatus, string> = {
  green: "text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1",
  yellow: "text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-1",
  red: "text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-1",
  untested: "text-gray-800",
};

interface WordColorDisplayProps {
  sentence: PracticeSentence;
  className?: string;
}

export default function WordColorDisplay({ sentence, className = "" }: WordColorDisplayProps) {
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
