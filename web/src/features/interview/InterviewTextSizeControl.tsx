"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  INTERVIEW_TEXT_SCALE_MAX,
  INTERVIEW_TEXT_SCALE_MIN,
  INTERVIEW_TEXT_SCALE_STEP,
} from "./useInterviewTextSize";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function InterviewTextSizeControl({ value, onChange }: Props) {
  const [feedbackValue, setFeedbackValue] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (fadeTimer.current !== null) clearTimeout(fadeTimer.current);
    if (hideTimer.current !== null) clearTimeout(hideTimer.current);
  }, []);

  const adjust = (next: number) => {
    onChange(next);
    setFeedbackValue(next);
    setIsVisible(true);
    // Updating one toast avoids stacking notifications on consecutive clicks.
    if (fadeTimer.current !== null) clearTimeout(fadeTimer.current);
    if (hideTimer.current !== null) clearTimeout(hideTimer.current);
    fadeTimer.current = setTimeout(() => setIsVisible(false), 850);
    hideTimer.current = setTimeout(() => setFeedbackValue(null), 1100);
  };

  return (
    <>
      <div
        role="group"
        aria-label="Điều chỉnh cỡ chữ"
        className="inline-flex min-h-9 items-center gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 text-xs font-semibold text-[var(--foreground)]"
      >
        <button
          type="button"
          aria-label="Giảm cỡ chữ"
          title="Giảm cỡ chữ (tối thiểu 80%)"
          disabled={value <= INTERVIEW_TEXT_SCALE_MIN}
          onClick={() => adjust(value - INTERVIEW_TEXT_SCALE_STEP)}
          className="rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          A−
        </button>
        <button
          type="button"
          aria-label="Tăng cỡ chữ"
          title="Tăng cỡ chữ (tối đa 160%)"
          disabled={value >= INTERVIEW_TEXT_SCALE_MAX}
          onClick={() => adjust(value + INTERVIEW_TEXT_SCALE_STEP)}
          className="rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          A+
        </button>
      </div>
      {feedbackValue !== null && typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center">
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={`rounded-2xl border border-white/15 bg-slate-950/90 px-6 py-3 text-center text-white shadow-2xl backdrop-blur-sm transition-all duration-200 motion-reduce:transition-none ${
                isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            >
              <div className="text-xl font-bold tabular-nums">{feedbackValue}%</div>
              <div className="text-[11px] text-slate-300">Cỡ chữ</div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
