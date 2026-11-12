import type { InterviewProgressState } from "./types";
import retiredIds from "./retiredInterviewIds.json";
import historicalIds from "./legacyIdMap.json";

export const retiredInterviewIds: Readonly<Record<string, string>> = retiredIds;

export interface RetiredProgressEntry {
  oldId: string;
  newId: string;
  historicalTarget: string | null;
  learned: boolean;
  review: boolean;
  bookmarked: boolean;
}

/**
 * These IDs are valid CURRENT canonical IDs in the pre-merge 526-question bank.
 * Some are also historical aliases for different questions. Unversioned data
 * cannot tell which identity was meant, so this list is inspection-only.
 */
export function isRetiredInterviewId(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(retiredInterviewIds, id);
}

export function inspectRetiredProgress(state: InterviewProgressState): RetiredProgressEntry[] {
  const legacy = historicalIds as Record<string, string>;
  return Object.entries(retiredInterviewIds)
    .filter(([oldId]) => Boolean(state.learned[oldId] || state.review[oldId] || state.bookmarks[oldId]))
    .map(([oldId, newId]) => ({
      oldId,
      newId,
      historicalTarget: legacy[oldId] && legacy[oldId] !== oldId ? legacy[oldId] : null,
      learned: Boolean(state.learned[oldId]),
      review: Boolean(state.review[oldId]),
      bookmarked: Boolean(state.bookmarks[oldId]),
    }));
}

/**
 * Only IDs explicitly approved by the user are remapped.
 * Input is never modified. Unapproved and unrelated records are retained.
 * When learning histories are incomplete, downgrade to "review" rather than
 * incorrectly granting mastery of a merged, wider question.
 */
export function mergeApprovedRetiredProgress(
  state: InterviewProgressState,
  approvedIds: readonly string[],
): InterviewProgressState {
  const approved = new Set(approvedIds);
  for (const oldId of approved) {
    if (!isRetiredInterviewId(oldId)) throw new Error(`Unknown retired ID: ${oldId}`);
  }
  const next: InterviewProgressState = {
    learned: { ...state.learned },
    review: { ...state.review },
    bookmarks: { ...state.bookmarks },
  };
  const targets = new Set<string>();
  for (const oldId of approved) {
    const target = retiredInterviewIds[oldId];
    if (!state.learned[oldId] && !state.review[oldId] && !state.bookmarks[oldId]) continue;
    targets.add(target);
    if (state.bookmarks[oldId]) next.bookmarks[target] = true;
    delete next.learned[oldId];
    delete next.review[oldId];
    delete next.bookmarks[oldId];
  }
  for (const target of targets) {
    const sourceIds = Object.entries(retiredInterviewIds)
      .filter(([, destination]) => destination === target)
      .map(([oldId]) => oldId);
    const allSourceLearned = [target, ...sourceIds].every(id => Boolean(state.learned[id]));
    const anySourceReview = [target, ...sourceIds].some(id => Boolean(state.review[id]));
    const anySourceLearned = [target, ...sourceIds].some(id => Boolean(state.learned[id]));
    const anyUnapprovedSource = sourceIds.some(id =>
      !approved.has(id) && Boolean(state.learned[id] || state.review[id]));
    // Keep pending sources separate and never grant mastery from incomplete coverage.
    if (anySourceReview || anyUnapprovedSource || (anySourceLearned && !allSourceLearned)) {
      next.review[target] = true;
      delete next.learned[target];
    } else if (allSourceLearned) {
      next.learned[target] = true;
      delete next.review[target];
    }
  }
  return next;
}

/**
 * Save a local immutable pre-migration snapshot BEFORE changing progress.
 * Refuse to migrate if localStorage cannot persist the archive.
 * This archive contains progress only, never the cloud sync bearer code.
 */
export function archiveProgressBeforeMerge(state: InterviewProgressState): void {
  if (typeof window === "undefined") throw new Error("Browser storage unavailable");
  const key = "interview-progress-merge-archives-v1";
  const raw = window.localStorage.getItem(key);
  const previous: unknown = raw ? JSON.parse(raw) : [];
  if (!Array.isArray(previous)) throw new Error("Existing migration archive is invalid");
  const snapshot = {
    at: new Date().toISOString(),
    state: JSON.parse(JSON.stringify(state)) as InterviewProgressState,
  };
  // Never discard older snapshots to make room. Fail closed on storage quotas.
  window.localStorage.setItem(key, JSON.stringify([...previous, snapshot]));
}
