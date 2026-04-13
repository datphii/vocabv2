"use client";

import { use, useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import ChatInterface from "@/components/pronunciation/ChatInterface";
import { usePronunciationStore } from "@/stores/pronunciationStore";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  params: Promise<{ word: string }>;
}

export default function WordPracticePage({ params }: Props) {
  const { word: encodedWord } = use(params);
  const word = decodeURIComponent(encodedWord);
  const [mounted, setMounted] = useState(false);

  const { improvementWords, markWordPassedInList } = usePronunciationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 size={24} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  const wordData = improvementWords.find((w) => w.word === word);

  const handleWordPassed = (score: number) => {
    if (score >= 80) {
      markWordPassedInList(word);
    }
  };

  const initialMessage = `Hãy luyện phát âm từ:\n\n"${word}"\n\nNhấn 🎤 và đọc từ này. Mình sẽ phân tích chi tiết và hướng dẫn bạn cách phát âm chính xác.\n\nBạn cũng có thể hỏi trước về cách đọc, vị trí lưỡi, hay âm nào trong từ này hay bị sai!`;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title={`Luyện: "${word}"`} showBack />

      {/* Word header card */}
      <div className="border-b border-gray-100 px-4 py-4 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">{word}</p>
            {wordData && (
              <div className="flex items-center gap-1.5 mt-2">
                <div
                  className={`flex items-center gap-1 text-xs ${
                    wordData.passedInWordList ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {wordData.passedInWordList ? (
                    <CheckCircle2 size={13} />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" />
                  )}
                  <span>Luyện riêng</span>
                </div>
              </div>
            )}
          </div>

          {wordData?.passedInWordList && (
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-xl font-semibold">
              Đã qua ✓
            </span>
          )}
        </div>

        {wordData?.passedInWordList && (
          <p className="text-xs text-gray-400 mt-2">
            Tiếp tục luyện trong câu để hoàn thành điều kiện thứ 2
          </p>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          targetText={word}
          mode="word"
          initialMessage={initialMessage}
          onWordPassed={handleWordPassed}
        />
      </div>
    </div>
  );
}
