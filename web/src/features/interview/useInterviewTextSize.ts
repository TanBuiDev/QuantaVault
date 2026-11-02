"use client";
import { useCallback, useEffect, useState } from "react";

export const INTERVIEW_TEXT_SCALE_MIN = 80;
export const INTERVIEW_TEXT_SCALE_MAX = 160;
export const INTERVIEW_TEXT_SCALE_STEP = 10;
const STORAGE_KEY = "quantavault_interview_text_scale";

export function useInterviewTextSize() {
  const [textScale, setTextScale] = useState(100);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY));
      if (Number.isInteger(saved) && saved >= 80 && saved <= 160 && saved % 10 === 0) {
        setTextScale(saved);
      }
    } catch {
      // Storage may be disabled; resizing still works for this session.
    }
  }, []);

  const changeTextScale = useCallback((next: number) => {
    if (!Number.isInteger(next) || next < 80 || next > 160 || next % 10 !== 0) return;
    setTextScale(next);
    try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
  }, []);

  return { textScale, changeTextScale };
}
