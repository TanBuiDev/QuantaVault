"use client";

import { useSyncExternalStore, useCallback, useMemo, useEffect } from "react";
import type { InterviewQuestion } from "./types";
import { questionVersion } from "./questionVersion";

const DRAFTS_STORAGE_KEY = "interview_drafts_v1";
const DRAFTS_CHANGE_EVENT = "interview-drafts:change";

export const PUBLISHED_CACHE_STORAGE_KEY = "interview_published_cache_v1";
export const PUBLISHED_CHANGE_EVENT = "interview-published:change";
export const PUBLISHED_CACHE_TTL_MS = 15 * 60 * 1000; // 15 phút

export interface DraftQuestion extends InterviewQuestion {
  isDeleted?: boolean;
  baseVersion?: string;
}

export type DraftMap = Record<string, DraftQuestion>;

export interface PublishedCacheItem {
  question: DraftQuestion;
  publishedAt: number;
  baseVersion?: string;
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
  const raw = JSON.stringify(drafts);
  window.localStorage.setItem(DRAFTS_STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedDrafts = drafts;
  window.dispatchEvent(new Event(DRAFTS_CHANGE_EVENT));
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
  const raw = JSON.stringify(cache);
  window.localStorage.setItem(PUBLISHED_CACHE_STORAGE_KEY, raw);
  cachedPublishedRaw = raw;
  cachedPublished = cache;
  window.dispatchEvent(new Event(PUBLISHED_CHANGE_EVENT));
}


/**
 * Resolve one published-cache conflict after the user has reviewed and backed
 * up both versions. Protect against changes from another tab while the dialog
 * is open; never clear other published entries or unpublished drafts.
 */
function unchangedPublishedSnapshot(id: string, expected: PublishedCacheItem): PublishedCacheMap {
  const current = getPublishedCache();
  if (!current[id] || JSON.stringify(current[id]) !== JSON.stringify(expected)) {
    throw new Error("Phiên bản lưu trên máy đã thay đổi. Hãy mở lại phần đối chiếu để kiểm tra.");
  }
  return current;
}

/** Keep the canonical website copy for one ID; drafts remain untouched. */
export function acceptWebsitePublishedVersion(id: string, expected: PublishedCacheItem): void {
  const cache = unchangedPublishedSnapshot(id, expected);
  const next = { ...cache };
  delete next[id];
  writePublishedCache(next);
}

/**
 * Preserve the locally published copy as an explicit unpublished draft.
 * Write the draft before removing its cache entry so a storage failure never
 * destroys the only local copy. Refuse to overwrite any existing draft.
 */
export function keepPublishedVersionAsDraft(
  id: string,
  expected: PublishedCacheItem,
  websiteQuestion: InterviewQuestion | null
): void {
  const cache = unchangedPublishedSnapshot(id, expected);
  if (websiteQuestion && websiteQuestion.id !== id) {
    throw new Error("ID phiên bản website không khớp với câu hỏi đang đối chiếu.");
  }
  const currentDrafts = getDrafts();
  if (currentDrafts[id]) {
    throw new Error("Câu hỏi đã có bản nháp chưa xuất bản. Không thể ghi đè bản nháp đó.");
  }
  const draft: DraftQuestion = {
    ...cache[id].question,
    baseVersion: questionVersion(websiteQuestion),
  };
  // Order matters: a quota error leaves the published cache intact.
  writeDrafts({ ...currentDrafts, [id]: draft });
  // A cache-write failure leaves two copies, not zero copies.
  acceptWebsitePublishedVersion(id, expected);
}

/** Download all three layers, not a merged view that hides one side of a conflict. */
export function downloadPublishedConflictBackup(
  canonicalQuestions: InterviewQuestion[],
  drafts: DraftMap,
  publishedCache: PublishedCacheMap
): void {
  const snapshot = {
    format: "quantavault-interview-conflict-backup-v1",
    createdAt: new Date().toISOString(),
    canonicalQuestions,
    drafts,
    publishedCache,
  };
  const blob = new Blob([JSON.stringify(snapshot, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quantavault-interview-conflict-backup-" + new Date().toISOString().replace(/[:.]/g, "-") + ".json";
  document.body.appendChild(link);
  try { link.click(); } finally {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function clearAllPublishedCache(): void {
  writePublishedCache({});
}

/**
 * Chuyển toàn bộ bản nháp hiện tại sang Published Cache và dọn sạch drafts
 */
export function commitDraftsToPublished(submitted: DraftMap = getDrafts(), baseQuestions?: InterviewQuestion[]): void {
  const currentDrafts = getDrafts();
  if (Object.keys(submitted).length === 0) return;

  const currentPublished = { ...getPublishedCache() };
  const now = Date.now();

  const remaining = { ...currentDrafts };
  for (const [id, draft] of Object.entries(submitted)) {
    currentPublished[id] = {
      question: draft,
      publishedAt: now,
      baseVersion: draft.baseVersion ?? (baseQuestions ? questionVersion(baseQuestions.find(q => q.id === id) ?? null) : undefined),
    };
    const current = currentDrafts[id];
    if (current && areQuestionsEqual(current, draft) && Boolean(current.isDeleted) === Boolean(draft.isDeleted)) {
      delete remaining[id];
    } else if (current) {
      // Further edits are based on the version that has just been published.
      remaining[id] = { ...current, baseVersion: questionVersion(draft.isDeleted ? null : draft) };
    }
  }

  writePublishedCache(currentPublished);
  writeDrafts(remaining);
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
  const published = getPublishedCache()[question.id];
  const effectiveBase = published ? (published.question.isDeleted ? undefined : published.question) : canonicalQuestion;
  if (effectiveBase && !question.isDeleted) {
    if (areQuestionsEqual(question, effectiveBase)) {
      removeDraft(question.id);
      return false; // Đã hoàn tác về gốc, không cần lưu nháp
    }
  }

  const current = getDrafts();
  const next = {
    ...current,
    [question.id]: {
      ...question,
      baseVersion: current[question.id]?.baseVersion ?? question.baseVersion ??
        questionVersion(published ? (published.question.isDeleted ? null : published.question) : canonicalQuestion ?? null),
    },
  };
  writeDrafts(next);
  return true;
}

/**
 * Đánh dấu một câu hỏi là đã xóa (Delete / Archive draft)
 */
export function markQuestionDeleted(question: InterviewQuestion, canonicalQuestion?: InterviewQuestion): void {
  saveDraft({
    ...question,
    isDeleted: true,
  }, canonicalQuestion);
}

export function removeDraft(id: string): void {
  const current = getDrafts();
  if (!(id in current)) return;
  const next = { ...current };
  delete next[id];
  writeDrafts(next);
}

/** Apply a reviewed remote baseline without replacing edited content. */
export function rebaseDraft(id: string, expected: DraftQuestion, remote: InterviewQuestion | null): void {
  const drafts = getDrafts();
  const current = drafts[id];
  if (!current || current.id !== id || expected.id !== id || (remote && remote.id !== id) ||
    questionVersion(current) !== questionVersion(expected) || current.isDeleted !== expected.isDeleted ||
    current.baseVersion !== expected.baseVersion) {
    throw new Error("Bản nháp đã thay đổi trong lúc đối chiếu. Hãy mở lại phần đối chiếu trước khi cập nhật phiên bản nền.");
  }
  writeDrafts({ ...drafts, [id]: { ...current, baseVersion: questionVersion(remote) } });
}

export function clearAllDrafts(): void {
  writeDrafts({});
}

function getBrowserSnapshot(): DraftMap {
  if (typeof window === "undefined") return EMPTY_DRAFTS;
  let raw: string | null;
  try { raw = window.localStorage.getItem(DRAFTS_STORAGE_KEY); }
  catch { return cachedDrafts; }
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
  let raw: string | null;
  try { raw = window.localStorage.getItem(PUBLISHED_CACHE_STORAGE_KEY); }
  catch { return cachedPublished; }
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

/** Pure reconciliation; callers persist the result outside React render. */
export function reconcilePublishedCache(canonicalQuestions: InterviewQuestion[], cache: PublishedCacheMap): PublishedCacheMap {
  const next = { ...cache };
  let changed = false;
  for (const [id, item] of Object.entries(cache)) {
    const canonical = canonicalQuestions.find(q => q.id === id);
    if (item.question.isDeleted ? !canonical : canonical && areQuestionsEqual(canonical, item.question)) {
      delete next[id];
      changed = true;
    }
  }
  return changed ? next : cache;
}

export function getPublishedConflicts(canonicalQuestions: InterviewQuestion[], cache: PublishedCacheMap): string[] {
  return Object.entries(cache).filter(([id, item]) => {
    const canonical = canonicalQuestions.find(q => q.id === id) ?? null;
    const matchesPublished = item.question.isDeleted ? canonical === null : canonical && areQuestionsEqual(canonical, item.question);
    return !matchesPublished && item.baseVersion !== undefined && questionVersion(canonical) !== item.baseVersion;
  }).map(([id]) => id);
}

export function mergeQuestionsWithDrafts(
  canonicalQuestions: InterviewQuestion[],
  drafts: DraftMap,
  publishedCache?: PublishedCacheMap
): MergedInterviewQuestion[] {
  const currentPublished = publishedCache ?? getPublishedCache();
  const activePublished = { ...currentPublished };

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

const subscribeHydration = () => () => {};
const browserHydrated = () => true;
const serverHydrated = () => false;

export function useInterviewDrafts(canonicalQuestions?: InterviewQuestion[]) {
  const hydrated = useSyncExternalStore(subscribeHydration, browserHydrated, serverHydrated);
  const drafts = useSyncExternalStore(subscribe, getBrowserSnapshot, getServerSnapshot);
  const publishedCache = useSyncExternalStore(
    subscribePublished,
    getPublishedBrowserSnapshot,
    getPublishedServerSnapshot
  );

  const draftList = useMemo(() => Object.values(drafts), [drafts]);
  const draftCount = Object.keys(drafts).length;

  useEffect(() => {
    if (!canonicalQuestions || !hydrated) return;
    const current = getPublishedCache();
    const reconciled = reconcilePublishedCache(canonicalQuestions, current);
    if (reconciled !== current) {
      try { writePublishedCache(reconciled); } catch { /* Keep the cache when storage is unavailable. */ }
    }
  }, [canonicalQuestions, hydrated, publishedCache]);

  const publishedConflicts = useMemo(() => canonicalQuestions ? getPublishedConflicts(canonicalQuestions, publishedCache) : [], [canonicalQuestions, publishedCache]);

  const handleSaveDraft = useCallback(
    (question: DraftQuestion, canonicalQuestion?: InterviewQuestion) => {
      return saveDraft(question, canonicalQuestion);
    },
    []
  );

  const handleRemoveDraft = useCallback((id: string) => {
    removeDraft(id);
  }, []);

  const handleRebaseDraft = useCallback((id: string, expected: DraftQuestion, remote: InterviewQuestion | null) => {
    rebaseDraft(id, expected, remote);
  }, []);

  const handleClearAllDrafts = useCallback(() => {
    clearAllDrafts();
  }, []);

  const handleCommitDraftsToPublished = useCallback((submitted?: DraftMap, baseQuestions?: InterviewQuestion[]) => {
    commitDraftsToPublished(submitted, baseQuestions);
  }, []);

  const handleClearAllPublishedCache = useCallback(() => {
    clearAllPublishedCache();
  }, []);

  const handleMarkDeleted = useCallback((question: InterviewQuestion, canonicalQuestion?: InterviewQuestion) => {
    markQuestionDeleted(question, canonicalQuestion);
  }, []);

  return {
    hydrated,
    publishedConflicts,
    drafts,
    draftList,
    draftCount,
    publishedCache,
    saveDraft: handleSaveDraft,
    removeDraft: handleRemoveDraft,
    rebaseDraft: handleRebaseDraft,
    markDeleted: handleMarkDeleted,
    clearAllDrafts: handleClearAllDrafts,
    commitDraftsToPublished: handleCommitDraftsToPublished,
    clearAllPublishedCache: handleClearAllPublishedCache,
  };
}
