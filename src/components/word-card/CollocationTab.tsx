"use client";

import { Word } from "@/types";
import { Check, AlertTriangle, Link as LinkIcon } from "lucide-react";

interface Props {
  word: Word;
}

export default function CollocationTab({ word }: Props) {
  const getIcon = (type: string) => {
    switch (type) {
      case "common":
        return <Check size={16} className="text-green-500" />;
      case "confused":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "related":
        return <LinkIcon size={16} className="text-blue-500" />;
      default:
        return <Check size={16} className="text-gray-400" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "common":
        return "Common";
      case "confused":
        return "Dễ nhầm";
      case "related":
        return "Related";
      default:
        return type;
    }
  };

  return (
    <div className="px-6 py-6">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
        Collocations & Related Terms
      </h3>

      <div className="space-y-3">
        {word.collocations.map((col, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
          >
            <div className="mt-0.5">{getIcon(col.type)}</div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{col.text}</p>
              <span className="text-xs text-gray-400">{getLabel(col.type)}</span>
              {col.note && (
                <p className="text-sm text-gray-500 mt-1">{col.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
