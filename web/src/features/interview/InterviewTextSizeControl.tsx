"use client";
import { INTERVIEW_TEXT_SCALE_MAX, INTERVIEW_TEXT_SCALE_MIN, INTERVIEW_TEXT_SCALE_STEP } from "./useInterviewTextSize";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function InterviewTextSizeControl({ value, onChange }: Props) {
  return (
    <div role="group" aria-label="Điều chỉnh cỡ chữ" className="inline-flex min-h-9 items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 text-xs font-semibold text-[var(--foreground)]">
      <button type="button" aria-label="Giảm cỡ chữ" title="Giảm cỡ chữ" disabled={value <= INTERVIEW_TEXT_SCALE_MIN} onClick={() => onChange(value - INTERVIEW_TEXT_SCALE_STEP)} className="rounded-lg px-2 py-1.5 hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed">A−</button>
      <button type="button" aria-label="Đặt lại cỡ chữ về 100%" title="Đặt lại cỡ chữ" disabled={value === 100} onClick={() => onChange(100)} className="min-w-12 rounded-lg px-1.5 py-1.5 tabular-nums hover:bg-[var(--surface-hover)] disabled:cursor-default">{value}%</button>
      <button type="button" aria-label="Tăng cỡ chữ" title="Tăng cỡ chữ" disabled={value >= INTERVIEW_TEXT_SCALE_MAX} onClick={() => onChange(value + INTERVIEW_TEXT_SCALE_STEP)} className="rounded-lg px-2 py-1.5 hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed">A+</button>
    </div>
  );
}
