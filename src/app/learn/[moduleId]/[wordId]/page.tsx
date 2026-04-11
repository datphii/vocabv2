"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getModule, getWord } from "@/data/modules";
import { useAppStore } from "@/stores/appStore";
import Header from "@/components/layout/Header";
import PronunciationTab from "@/components/word-card/PronunciationTab";
import MeaningTab from "@/components/word-card/MeaningTab";
import VisualTab from "@/components/word-card/VisualTab";
import ContextTab from "@/components/word-card/ContextTab";
import CollocationTab from "@/components/word-card/CollocationTab";
import ExplainTab from "@/components/word-card/ExplainTab";
import {
  Volume2,
  BookOpen,
  Image,
  MessageSquare,
  Puzzle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const TABS = [
  { key: "pronunciation", label: "Sound", icon: Volume2 },
  { key: "meaning", label: "Meaning", icon: BookOpen },
  { key: "visual", label: "Visual", icon: Image },
  { key: "context", label: "Context", icon: MessageSquare },
  { key: "collocation", label: "Collocate", icon: Puzzle },
  { key: "explain", label: "Explain", icon: GraduationCap },
];

export default function WordCardPage({
  params,
}: {
  params: Promise<{ moduleId: string; wordId: string }>;
}) {
  const { moduleId, wordId } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);
  const markWordLearned = useAppStore((s) => s.markWordLearned);

  const mod = getModule(moduleId);
  const word = getWord(moduleId, wordId);

  useEffect(() => {
    if (word) {
      markWordLearned(word.id);
    }
  }, [word, markWordLearned]);

  if (!mod || !word) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Word not found</p>
      </div>
    );
  }

  const currentIndex = mod.words.findIndex((w) => w.id === wordId);
  const hasNext = currentIndex < mod.words.length - 1;
  const hasPrev = currentIndex > 0;

  const goToTab = (index: number) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  const nextWord = () => {
    if (hasNext) {
      const next = mod.words[currentIndex + 1];
      router.push(`/learn/${moduleId}/${next.id}`);
      setActiveTab(0);
    } else {
      router.push(`/practice?module=${moduleId}&from=${currentIndex - 4}&to=${currentIndex}`);
    }
  };

  const prevWord = () => {
    if (hasPrev) {
      const prev = mod.words[currentIndex - 1];
      router.push(`/learn/${moduleId}/${prev.id}`);
      setActiveTab(0);
    }
  };

  // Trigger practice every 5 words
  const shouldPractice =
    (currentIndex + 1) % 5 === 0 && activeTab === TABS.length - 1;

  const renderTab = () => {
    switch (TABS[activeTab].key) {
      case "pronunciation":
        return <PronunciationTab word={word} />;
      case "meaning":
        return <MeaningTab word={word} />;
      case "visual":
        return <VisualTab word={word} />;
      case "context":
        return <ContextTab word={word} />;
      case "collocation":
        return <CollocationTab word={word} />;
      case "explain":
        return <ExplainTab word={word} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header
        title={`${currentIndex + 1}/${mod.words.length} — ${mod.name}`}
        showBack
      />

      {/* Tab Bar */}
      <div className="sticky top-14 bg-white border-b border-gray-100 z-30">
        <div className="max-w-lg mx-auto flex overflow-x-auto no-scrollbar">
          {TABS.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => goToTab(i)}
                className={`flex flex-col items-center min-w-[60px] px-3 py-2 text-xs transition-colors relative ${
                  i === activeTab
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={18} />
                <span className="mt-1">{tab.label}</span>
                {i === activeTab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content with swipe */}
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ x: direction * 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 && activeTab < TABS.length - 1) {
                goToTab(activeTab + 1);
              } else if (info.offset.x > 80 && activeTab > 0) {
                goToTab(activeTab - 1);
              }
            }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={prevWord}
            disabled={!hasPrev}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              hasPrev
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={18} />
            Prev
          </button>

          <div className="flex gap-1">
            {TABS.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeTab ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {shouldPractice ? (
            <button
              onClick={() =>
                router.push(
                  `/practice?module=${moduleId}&from=${currentIndex - 4}&to=${currentIndex}`
                )
              }
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Practice
            </button>
          ) : (
            <button
              onClick={nextWord}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Next
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
