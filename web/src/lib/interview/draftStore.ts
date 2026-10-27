"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";
import type { InterviewQuestion } from "./types";

const DRAFTS_STORAGE_KEY = "interview_drafts_v1";
const DRAFTS_CHANGE_EVENT = "interview-drafts:change";

export const PUBLISHED_CACHE_STORAGE_KEY = "interview_published_cache_v1";
export const PUBLISHED_CHANGE_EVENT = "interview-published:change";
export const PUBLISHED_CACHE_TTL_MS = 15 * 60 * 1000; // 15 phút

export interface DraftQuestion extends InterviewQuestion {
  isDeleted?: boolean;
}

export type DraftMap = Record<string, DraftQuestion>;

export interface PublishedCacheItem {
  question: DraftQuestion;
  publishedAt: number;
}

export type PublishedCacheMap = Record<string, PublishedCacheItem>;

const EMPTY_DRAFTS: DraftMap = {};
const EMPTY_PUBLISHED: PublishedCacheMap = {};

let cachedRaw: string | null | undefined;
let cachedDrafts: DraftMap = EMPTY_DRAFTS;

let cachedPublishedRaw: string | null | undefined;
let cachedPublished: PublishedCacheMap = EMPTY_PUBLISHED;

/**
 * So sánh 2 câu hỏi xem có giống nhau 100% hay không (Deep Equality Check)
 */
export function areQuestionsEqual(a: InterviewQuestion, b: InterviewQuestion): boolean {
  if (a.id !== b.id) return false;
  if ((a.title || "").trim() !== (b.title || "").trim()) return false;
  if (a.category !== b.category) return false;
  if (a.difficulty !== b.difficulty) return false;
  if ((a.summary || "").trim() !== (b.summary || "").trim()) return false;
  if ((a.answerMarkdown || "").trim() !== (b.answerMarkdown || "").trim()) return false;

  const compareArrays = (arr1?: string[], arr2?: string[]) => {
    const clean1 = (arr1 || []).map((s) => s.trim()).filter(Boolean);
    const clean2 = (arr2 || []).map((s) => s.trim()).filter(Boolean);
    if (clean1.length !== clean2.length) return false;
    return clean1.every((item, idx) => item === clean2[idx]);
  };

  if (!compareArrays(a.keyTakeaways, b.keyTakeaways)) return false;
  if (!compareArrays(a.companies, b.companies)) return false;
  if (!compareArrays(a.tags, b.tags)) return false;

  const cleanNums1 = (a.relatedProblems || []).filter((n) => Number.isInteger(n));
  const cleanNums2 = (b.relatedProblems || []).filter((n) => Number.isInteger(n));
  if (cleanNums1.length !== cleanNums2.length) return false;
  if (!cleanNums1.every((n, idx) => n === cleanNums2[idx])) return false;

  return true;
}

export function getDrafts(): DraftMap {
  if (typeof window === "undefined") return EMPTY_DRAFTS;
  try {
    const raw = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!raw) return EMPTY_DRAFTS;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as DraftMap;
    }
    return EMPTY_DRAFTS;
  } catch {
    return EMPTY_DRAFTS;
  }
}

function writeDrafts(drafts: DraftMap): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(drafts);
    window.localStorage.setItem(DRAFTS_STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedDrafts = drafts;
    window.dispatchEvent(new Event(DRAFTS_CHANGE_EVENT));
  } catch (error) {
    console.error("Failed to persist interview drafts to localStorage:", error);
  }
}

export function getPublishedCache(): PublishedCacheMap {
  if (typeof window === "undefined") return EMPTY_PUBLISHED;
  try {
    const raw = window.localStorage.getItem(PUBLISHED_CACHE_STORAGE_KEY);
    if (!raw) return EMPTY_PUBLISHED;
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as PublishedCacheMap;
    }
    return EMPTY_PUBLISHED;
  } catch {
    return EMPTY_PUBLISHED;
  }
}

export function writePublishedCache(cache: PublishedCacheMap): void {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(cache);
    window.localStorage.setItem(PUBLISHED_CACHE_STORAGE_KEY, raw);
    cachedPublishedRaw = raw;
    cachedPublished = cache;
    window.dispatchEvent(new Event(PUBLISHED_CHANGE_EVENT));
  } catch (error) {
    console.error("Failed to persist published cache to localStorage:", error);
  }
}

export function clearAllPublishedCache(): void {
  writePublishedCache({});
}

/**
 * Chuyển toàn bộ bản nháp hiện tại sang Published Cache và dọn sạch drafts
 */
export function commitDraftsToPublished(): void {
  const currentDrafts = getDrafts();
  if (Object.keys(currentDrafts).length === 0) return;

  const currentPublished = { ...getPublishedCache() };
  const now = Date.now();

  for (const [id, draft] of Object.entries(currentDrafts)) {
    currentPublished[id] = {
      question: draft,
      publishedAt: now,
    };
  }

  writePublishedCache(currentPublished);
  clearAllDrafts();
}

/**
 * Lưu bản nháp một cách thông minh (Smart Auto Clean Revert):
 * Nếu nội dung sau khi sửa đã trùng khớp 100% với bản gốc, tự động xóa khỏi danh sách nháp.
 * Trả về true nếu được lưu làm bản nháp, false nếu được hoàn tác về gốc.
 */
export function saveDraft(
  question: DraftQuestion,
  canonicalQuestion?: InterviewQuestion
): boolean {
  if (canonicalQuestion && !question.isDeleted) {
    if (areQuestionsEqual(question, canonicalQuestion)) {
      removeDraft(question.id);
      return false; // Đã hoàn tác về gốc, không cần lưu nháp
    }
  }

  const current = getDrafts();
  const next = {
    ...current,
    [question.id]: question,
  };
  writeDrafts(next);
  return true;
}

/**
 * Đánh dấu một câu hỏi là đã xóa (Delete / Archive draft)
 */
export function markQuestionDeleted(question: InterviewQuestion): void {
  saveDraft({
    ...question,
    isDeleted: true,
  });
}

export function removeDraft(id: string): void {
  const current = getDrafts();
  if (!(id in current)) return;
  const next = { ...current };
  delete next[id];
  writeDrafts(next);
}

export function clearAllDrafts(): void {
  writeDrafts({});
}

function getBrowserSnapshot(): DraftMap {
  if (typeof window === "undefined") return EMPTY_DRAFTS;
  const raw = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
  if (raw === cachedRaw) return cachedDrafts;

  cachedRaw = raw;
  cachedDrafts = getDrafts();
  return cachedDrafts;
}

function getServerSnapshot(): DraftMap {
  return EMPTY_DRAFTS;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(DRAFTS_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DRAFTS_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getPublishedBrowserSnapshot(): PublishedCacheMap {
  if (typeof window === "undefined") return EMPTY_PUBLISHED;
  const raw = window.localStorage.getItem(PUBLISHED_CACHE_STORAGE_KEY);
  if (raw === cachedPublishedRaw) return cachedPublished;

  cachedPublishedRaw = raw;
  cachedPublished = getPublishedCache();
  return cachedPublished;
}

function getPublishedServerSnapshot(): PublishedCacheMap {
  return EMPTY_PUBLISHED;
}

function subscribePublished(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PUBLISHED_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(PUBLISHED_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export interface MergedInterviewQuestion extends InterviewQuestion {
  isDraft?: boolean;
  isDeleted?: boolean;
}

export function mergeQuestionsWithDrafts(
  canonicalQuestions: InterviewQuestion[],
  drafts: DraftMap,
  publishedCache?: PublishedCacheMap
): MergedInterviewQuestion[] {
  const currentPublished = publishedCache ?? getPublishedCache();
  const now = Date.now();
  const activePublished = { ...currentPublished };
  let hasReconciledChanges = false;

  // 1. Smart Reconciliation & TTL Purge
  for (const [id, item] of Object.entries(activePublished)) {
    // A. TTL check
    if (now - item.publishedAt > PUBLISHED_CACHE_TTL_MS) {
      delete activePublished[id];
      hasReconciledChanges = true;
      continue;
    }

    // B. Reconciliation check with canonicalQuestions from Cloudflare
    const canonical = canonicalQuestions.find((q) => q.id === id);

    if (item.question.isDeleted) {
      // If deleted and no longer present in canonical -> Cloudflare has applied deletion!
      if (!canonical) {
        delete activePublished[id];
        hasReconciledChanges = true;
      }
    } else if (canonical && areQuestionsEqual(canonical, item.question)) {
      // Canonical now matches cached question 100% -> Cloudflare build finished!
      delete activePublished[id];
      hasReconciledChanges = true;
    }
  }

  if (hasReconciledChanges) {
    writePublishedCache(activePublished);
  }

  // 2. 3-Layer Merging: drafts > publishedCache > canonical
  const draftIds = new Set(Object.keys(drafts));
  const publishedIds = new Set(Object.keys(activePublished));
  const merged: MergedInterviewQuestion[] = [];

  for (const q of canonicalQuestions) {
    if (drafts[q.id]) {
      draftIds.delete(q.id);
      publishedIds.delete(q.id);
      const draft = drafts[q.id];
      if (!draft.isDeleted) {
        merged.push({
          ...draft,
          isDraft: true,
        });
      }
    } else if (activePublished[q.id]) {
      publishedIds.delete(q.id);
      const cached = activePublished[q.id].question;
      if (!cached.isDeleted) {
        merged.push({
          ...cached,
          isDraft: false,
        });
      }
    } else {
      merged.push(q);
    }
  }

  // Any newly added questions from publishedCache
  for (const newId of publishedIds) {
    const cached = activePublished[newId].question;
    if (!cached.isDeleted && !drafts[newId]) {
      merged.unshift({
        ...cached,
        isDraft: false,
      });
    }
  }

  // Any newly added questions from drafts
  for (const newId of draftIds) {
    const draft = drafts[newId];
    if (!draft.isDeleted) {
      merged.unshift({
        ...draft,
        isDraft: true,
      });
    }
  }

  return merged;
}

/**
 * Tải file JSON sao lưu đầy đủ câu hỏi về máy tính
 */
export function downloadQuestionsBackup(
  canonicalQuestions: InterviewQuestion[],
  drafts: DraftMap,
  publishedCache?: PublishedCacheMap
): void {
  const merged = mergeQuestionsWithDrafts(canonicalQuestions, drafts, publishedCache);
  const jsonContent = JSON.stringify(merged, null, 2) + "\n";
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `interview-questions-backup-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function useInterviewDrafts() {
  const drafts = useSyncExternalStore(subscribe, getBrowserSnapshot, getServerSnapshot);
  const publishedCache = useSyncExternalStore(
    subscribePublished,
    getPublishedBrowserSnapshot,
    getPublishedServerSnapshot
  );

  const draftList = useMemo(() => Object.values(drafts), [drafts]);
  const draftCount = Object.keys(drafts).length;

  const handleSaveDraft = useCallback(
    (question: DraftQuestion, canonicalQuestion?: InterviewQuestion) => {
      return saveDraft(question, canonicalQuestion);
    },
    []
  );

  const handleRemoveDraft = useCallback((id: string) => {
    removeDraft(id);
  }, []);

  const handleClearAllDrafts = useCallback(() => {
    clearAllDrafts();
  }, []);

  const handleCommitDraftsToPublished = useCallback(() => {
    commitDraftsToPublished();
  }, []);

  const handleClearAllPublishedCache = useCallback(() => {
    clearAllPublishedCache();
  }, []);

  const handleMarkDeleted = useCallback((question: InterviewQuestion) => {
    markQuestionDeleted(question);
  }, []);

  return {
    drafts,
    draftList,
    draftCount,
    publishedCache,
    saveDraft: handleSaveDraft,
    removeDraft: handleRemoveDraft,
    markDeleted: handleMarkDeleted,
    clearAllDrafts: handleClearAllDrafts,
    commitDraftsToPublished: handleCommitDraftsToPublished,
    clearAllPublishedCache: handleClearAllPublishedCache,
  };
}
