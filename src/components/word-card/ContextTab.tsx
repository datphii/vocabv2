"use client";

import { Word } from "@/types";

interface Props {
  word: Word;
}

export default function ContextTab({ word }: Props) {
  return (
    <div className="px-6 py-6 space-y-5">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
        Contexts
      </h3>

      {word.contexts.map((ctx, i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{ctx.scenarioIcon}</span>
            <span className="text-xs font-medium text-gray-500 uppercase">
              {ctx.scenarioType === "standard"
                ? "Reading Standard"
                : ctx.scenarioType === "email"
                  ? "Email to supplier"
                  : ctx.scenarioType === "interview"
                    ? "Interview"
                    : "Meeting"}
            </span>
          </div>
          <p className="text-gray-800 leading-relaxed">
            {highlightTerm(ctx.sentence, ctx.highlightTerm)}
          </p>
          {ctx.sentenceVi && (
            <p className="text-sm text-gray-500 mt-2 italic">
              {ctx.sentenceVi}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function highlightTerm(sentence: string, term: string) {
  const regex = new RegExp(`(${escapeRegex(term)})`, "gi");
  const parts = sentence.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="font-bold text-blue-600 underline decoration-blue-300">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
