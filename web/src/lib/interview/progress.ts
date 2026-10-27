"use client";

import { useSyncExternalStore, useCallback } from "react";
import type { InterviewProgressState } from "./types";

const STORAGE_KEY = "interview-prep-progress-v1";
const CHANGE_EVENT = "interview-prep-progress:change";

const EMPTY_STATE: InterviewProgressState = {
  learned: {},
  review: {},
  bookmarks: {},
};

import legacyMap from "./legacyIdMap.json";

let cachedRaw: string | null | undefined;
let cachedState: InterviewProgressState = EMPTY_STATE;

function migrateRecord(record: Record<string, boolean>): { updated: Record<string, boolean>; changed: boolean } {
  const result: Record<string, boolean> = {};
  let changed = false;
  const map = legacyMap as Record<string, string>;

  for (const [key, val] of Object.entries(record)) {
    if (map[key] && map[key] !== key) {
      result[map[key]] = val;
      changed = true;
    } else {
      result[key] = val;
    }
  }
  return { updated: result, changed };
}

function readStorage(): InterviewProgressState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    const learnedRes = migrateRecord(typeof parsed.learned === "object" && parsed.learned ? parsed.learned : {});
    const reviewRes = migrateRecord(typeof parsed.review === "object" && parsed.review ? parsed.review : {});
    const bookmarksRes = migrateRecord(typeof parsed.bookmarks === "object" && parsed.bookmarks ? parsed.bookmarks : {});

    const migratedState: InterviewProgressState = {
      learned: learnedRes.updated,
      review: reviewRes.updated,
      bookmarks: bookmarksRes.updated,
    };

    if (learnedRes.changed || reviewRes.changed || bookmarksRes.changed) {
      writeStorage(migratedState);
    }

    return migratedState;
  } catch {
    return EMPTY_STATE;
  }
}

function writeStorage(state: InterviewProgressState) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedState = state;
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}

function getBrowserSnapshot(): InterviewProgressState {
  if (typeof window === "undefined") return EMPTY_STATE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedState;

  cachedRaw = raw;
  cachedState = readStorage();
  return cachedState;
}

function getServerSnapshot(): InterviewProgressState {
  return EMPTY_STATE;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    cachedRaw = undefined;
    callback();
  };

  const onCustomChange = () => {
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onCustomChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onCustomChange);
  };
}

function subscribeHydration(): () => void {
  return () => undefined;
}

function getHydratedSnapshot(): boolean {
  return true;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

export function useInterviewProgress() {
  const state = useSyncExternalStore(subscribe, getBrowserSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot
  );

  const toggleLearned = useCallback(
    (questionId: string) => {
      const current = readStorage();
      const isLearned = Boolean(current.learned[questionId]);
      const next: InterviewProgressState = {
        ...current,
        learned: { ...current.learned },
        review: { ...current.review },
      };

      if (isLearned) {
        delete next.learned[questionId];
      } else {
        next.learned[questionId] = true;
        delete next.review[questionId]; // Nếu đã hiểu thì bỏ khỏi cần ôn lại
      }

      writeStorage(next);
    },
    []
  );

  const toggleReview = useCallback(
    (questionId: string) => {
      const current = readStorage();
      const isReview = Boolean(current.review[questionId]);
      const next: InterviewProgressState = {
        ...current,
        learned: { ...current.learned },
        review: { ...current.review },
      };

      if (isReview) {
        delete next.review[questionId];
      } else {
        next.review[questionId] = true;
        delete next.learned[questionId]; // Nếu cần ôn lại thì bỏ khỏi đã hiểu
      }

      writeStorage(next);
    },
    []
  );

  const toggleBookmark = useCallback(
    (questionId: string) => {
      const current = readStorage();
      const isBookmarked = Boolean(current.bookmarks[questionId]);
      const next: InterviewProgressState = {
        ...current,
        bookmarks: { ...current.bookmarks },
      };

      if (isBookmarked) {
        delete next.bookmarks[questionId];
      } else {
        next.bookmarks[questionId] = true;
      }

      writeStorage(next);
    },
    []
  );

  const isLearned = useCallback((id: string) => Boolean(state.learned[id]), [state.learned]);
  const isReview = useCallback((id: string) => Boolean(state.review[id]), [state.review]);
  const isBookmarked = useCallback((id: string) => Boolean(state.bookmarks[id]), [state.bookmarks]);

  return {
    state,
    hydrated,
    isLearned,
    isReview,
    isBookmarked,
    toggleLearned,
    toggleReview,
    toggleBookmark,
  };
}
