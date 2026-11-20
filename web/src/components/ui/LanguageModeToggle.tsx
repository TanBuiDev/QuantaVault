"use client";

import { Languages } from "lucide-react";

export type LanguageMode = "bilingual" | "vi" | "en";

export interface LanguageModeToggleProps {
  value: LanguageMode;
  onChange: (mode: LanguageMode) => void;
  size?: "sm" | "md";
  showIcon?: boolean;
  className?: string;
  labels?: {
    bilingual?: string;
    vi?: string;
    en?: string;
  };
}

/**
 * Shared bilingual language mode toggle (Song ngữ | Tiếng Việt | Tiếng Anh).
 * Reused across Quizzes, Reading Studio, Transcripts, and Practice cards.
 */
export function LanguageModeToggle({
  value,
  onChange,
  size = "sm",
  showIcon = false,
  className = "",
  labels = {
    bilingual: "Song ngữ",
    vi: "Tiếng Việt",
    en: "Tiếng Anh",
  },
}: LanguageModeToggleProps) {
  const options: { id: LanguageMode; label: string }[] = [
    { id: "bilingual", label: labels.bilingual || "Song ngữ" },
    { id: "vi", label: labels.vi || "Tiếng Việt" },
    { id: "en", label: labels.en || "Tiếng Anh" },
  ];

  const paddingClass = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs sm:text-sm";

  return (
    <div
      role="group"
      aria-label="Chế độ ngôn ngữ hiển thị"
      className={`inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/70 p-1 shadow-2xs backdrop-blur-xs ${className}`}
    >
      {showIcon && (
        <span className="pl-1.5 pr-1 text-[var(--muted)]" aria-hidden="true">
          <Languages className="h-3.5 w-3.5" />
        </span>
      )}
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(opt.id)}
            className={`rounded-lg font-bold transition-all cursor-pointer ${paddingClass} ${
              isActive
                ? "bg-emerald-500 text-white shadow-xs font-black"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
