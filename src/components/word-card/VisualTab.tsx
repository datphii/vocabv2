"use client";

import { Word } from "@/types";
import { ImageOff } from "lucide-react";

interface Props {
  word: Word;
}

export default function VisualTab({ word }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] px-6">
      {word.visualSvg ? (
        <div
          className="w-full max-w-sm"
          dangerouslySetInnerHTML={{ __html: word.visualSvg }}
        />
      ) : (
        <div className="flex flex-col items-center text-gray-300">
          <ImageOff size={64} strokeWidth={1} />
          <p className="mt-4 text-sm text-gray-400">
            Hình minh họa sẽ được cập nhật
          </p>
          <p className="text-xs text-gray-300 mt-1">
            (Technical illustration coming soon)
          </p>
        </div>
      )}

      {word.visualCaption && (
        <p className="mt-4 text-sm text-gray-600 text-center italic">
          {word.visualCaption}
        </p>
      )}
    </div>
  );
}
