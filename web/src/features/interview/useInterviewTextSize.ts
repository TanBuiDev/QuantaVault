"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

export const INTERVIEW_TEXT_SCALE_MIN = 80;
export const INTERVIEW_TEXT_SCALE_MAX = 160;
export const INTERVIEW_TEXT_SCALE_STEP = 10;

const STORAGE_KEY = "quantavault_interview_text_scale";
const CHANGE_EVENT = "quantavault_interview_text_scale_change";

function isValidScale(value: number) {
  return Number.isInteger(value) &&
    value >= INTERVIEW_TEXT_SCALE_MIN &&
    value <= INTERVIEW_TEXT_SCALE_MAX &&
    value % INTERVIEW_TEXT_SCALE_STEP === 0;
}

function readStoredScale(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 100;
    const value = Number(raw);
    return isValidScale(value) ? value : 100;
  } catch {
    return 100;
  }
}

function subscribeToScaleChange(callback: () => void): () => void {
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

const serverScale = () => 100;

export function useInterviewTextSize() {
  // SSR-safe localStorage hydration; avoids setState within an effect.
  const stored = useSyncExternalStore(subscribeToScaleChange, readStoredScale, serverScale);
  const [fallback, setFallback] = useState<number | null>(null);
  const textScale = fallback ?? stored;

  const changeTextScale = useCallback((next: number) => {
    if (!isValidScale(next)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
      setFallback(null);
    } catch {
      setFallback(next);
    }
  }, []);

  return { textScale, changeTextScale };
}
