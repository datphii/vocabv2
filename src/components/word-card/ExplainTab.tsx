"use client";

import { useState } from "react";
import { Word } from "@/types";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  word: Word;
}

export default function ExplainTab({ word }: Props) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showSample, setShowSample] = useState(false);

  const sampleAnswer = `${word.term} is ${word.definitionEn.charAt(0).toLowerCase()}${word.definitionEn.slice(1)}`;

  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={20} className="text-blue-500" />
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Explain Challenge
        </h3>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <p className="text-gray-800 italic">
          &ldquo;Explain &lsquo;<strong>{word.term}</strong>&rsquo; as if
          talking to a colleague who is new to engineering drawings.&rdquo;
        </p>
      </div>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your explanation in English..."
        className="w-full h-32 p-4 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />

      <button
        onClick={() => setShowSample(!showSample)}
        className="mt-4 w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
      >
        <span className="text-sm font-medium">
          {showSample ? "Hide" : "Show"} sample answer
        </span>
        {showSample ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {showSample && (
        <div className="mt-3 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-sm text-green-800 leading-relaxed">
            {sampleAnswer}
          </p>
        </div>
      )}
    </div>
  );
}
