import { module1 } from "./lv1-drawing-basics";
import { Module } from "@/types";

export const allModules: Module[] = [module1];

export function getModule(moduleId: string): Module | undefined {
  return allModules.find((m) => m.id === moduleId);
}

export function getWord(moduleId: string, wordId: string) {
  const mod = getModule(moduleId);
  return mod?.words.find((w) => w.id === wordId);
}
