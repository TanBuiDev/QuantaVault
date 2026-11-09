"use client";

import { useSyncExternalStore } from "react";

import rawPractice from "@/data/courses/english-job-interview/practice.json";

export type PracticeKind = "question" | "answer";
export type PracticeDirection = "vi-en" | "en-vi";
export type PracticeStatus = "remembered" | "review";
export type PracticeStatusFilter = "all" | "review" | "remembered" | "unreviewed";

export interface PracticeAnswer {
  id: string;
  en: string;
  vi: string;
}

export interface PracticeQuestion {
  id: string;
  lessonId: string;
  questionEn: string;
  questionVi: string;
  answers: PracticeAnswer[];
}

export interface PracticeCard {
  id: string;
  lessonId: string;
  kind: PracticeKind;
  en: string;
  vi: string;
  questionEn: string;
  questionVi: string;
  sampleNumber?: number;
}

export const practiceQuestions: PracticeQuestion[] = rawPractice.questions;

export function getPracticeCards(lessonId: string, kind: PracticeKind): PracticeCard[] {
  const relevant = practiceQuestions.filter((q) => lessonId === "all" || q.lessonId === lessonId);
  if (kind === "question") {
    return relevant.map((q) => ({
      id: q.id,
      lessonId: q.lessonId,
      kind,
      en: q.questionEn,
      vi: q.questionVi,
      questionEn: q.questionEn,
      questionVi: q.questionVi
    }));
  }
  return relevant.flatMap((q) => q.answers.map((answer, index) => ({
    id: answer.id,
    lessonId: q.lessonId,
    kind,
    en: answer.en,
    vi: answer.vi,
    questionEn: q.questionEn,
    questionVi: q.questionVi,
    sampleNumber: index + 1
  })));
}

export function filterPracticeCards(
  cards: PracticeCard[],
  direction: PracticeDirection,
  scores: Record<string, PracticeStatus>,
  filter: PracticeStatusFilter
): PracticeCard[] {
  if (filter === "all") return cards;
  return cards.filter((card) => {
    const score = scores[practiceScoreKey(card.id, direction)];
    if (filter === "remembered") return score === "remembered";
    if (filter === "review") return score === "review";
    if (filter === "unreviewed") return !score;
    return true;
  });
}

const STORAGE_KEY = "quantavault-english-practice:v1";
const CHANGE_EVENT = "quantavault-english-practice:change";
const EMPTY_SCORES: Record<string, PracticeStatus> = {};
let cachedRaw: string | null = null;
let cachedScores: Record<string, PracticeStatus> = EMPTY_SCORES;

export function practiceScoreKey(cardId: string, direction: PracticeDirection): string {
  return cardId + ":" + direction;
}

/** Never reads or modifies progress, drafts, or D1 storage keys. */
export function readPracticeScores(): Record<string, PracticeStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { version?: unknown; scores?: unknown };
    if (parsed?.version !== 1 || !parsed.scores || typeof parsed.scores !== "object" || Array.isArray(parsed.scores)) return {};
    return Object.fromEntries(
      Object.entries(parsed.scores).filter((entry): entry is [string, PracticeStatus] =>
        entry[1] === "remembered" || entry[1] === "review")
    );
  } catch {
    return {};
  }
}

function getSnapshot(): Record<string, PracticeStatus> {
  if (typeof window === "undefined") return EMPTY_SCORES;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY_SCORES;
  }
  if (raw === cachedRaw) return cachedScores;
  cachedRaw = raw;
  cachedScores = readPracticeScores();
  return cachedScores;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useEnglishPracticeScores(): Record<string, PracticeStatus> {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SCORES);
}

export function writePracticeScores(scores: Record<string, PracticeStatus>): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify({ version: 1, scores });
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedScores = scores;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Private browsing or exhausted quota must not prevent practicing.
  }
}
