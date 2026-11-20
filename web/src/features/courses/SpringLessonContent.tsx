"use client";

import { useState, memo } from "react";
import {
  Layers,
  BookOpen,
  Languages
} from "lucide-react";
import { MarkdownContent, type LanguageMode } from "@/features/practice/MarkdownContent";
import type { CourseLesson, CourseManifest } from "@/lib/courses";
import { getUrlParams, updateUrlParams } from "@/lib/utils/urlParams";
import { SpringTranscriptPanel } from "./SpringTranscriptPanel";

interface SpringLessonContentProps {
  course: CourseManifest;
  lesson: CourseLesson;
  textScale?: number;
  currentTime?: number;
  isPlaying?: boolean;
  onSeek?: (seconds: number) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  autoScroll?: boolean;
  onToggleAutoScroll?: () => void;
  initialTab?: SpringTabMode;
}

type SpringTabMode = "blueprint" | "transcript";

export const SpringLessonContent = memo(function SpringLessonContent({
  lesson,
  textScale = 100,
  currentTime,
  isPlaying = false,
  onSeek,
  searchQuery,
  onSearchChange,
  autoScroll,
  onToggleAutoScroll,
  initialTab
}: SpringLessonContentProps) {
  const defaultTab: SpringTabMode = initialTab || "blueprint";

  // 1. Tab state synchronized with URL search params (Tier 1 state persistence)
  const [activeTab, setActiveTab] = useState<SpringTabMode>(() => {
    if (typeof window !== "undefined") {
      const paramTab = getUrlParams().get("tab");
      if (paramTab === "blueprint" || paramTab === "transcript") {
        return paramTab;
      }
    }
    return defaultTab;
  });

  // 2. Language mode state synchronized with URL search params (Tier 1 state persistence)
  const [langMode, setLangMode] = useState<LanguageMode>(() => {
    if (typeof window !== "undefined") {
      const param = getUrlParams().get("lang");
      if (param === "bilingual" || param === "en" || param === "vi") return param;
    }
    return "bilingual";
  });

  const handleTabChange = (tab: SpringTabMode) => {
    setActiveTab(tab);
    updateUrlParams({ tab }, { tab: defaultTab });
  };

  const handleLangModeChange = (mode: LanguageMode) => {
    setLangMode(mode);
    updateUrlParams({ lang: mode }, { lang: "bilingual" });
  };

  return (
    <div className="space-y-6 animate-fade-in min-w-0 max-w-full overflow-hidden" style={{ fontSize: `${textScale}%` }}>
      {/* 1. Lower Workspace Mode Switcher Tabs + Language Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Blueprint tab (Primary for lower workspace) */}
          <button
            type="button"
            onClick={() => handleTabChange("blueprint")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "blueprint"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
            }`}
          >
            <Layers className="h-4 w-4 text-indigo-500" />
            <span>Kiến trúc & Phân tích chuyên sâu</span>
          </button>

          {/* Transcript tab on mobile screens (< lg) where the right rail is hidden */}
          {lesson.transcript && lesson.transcript.length > 0 && (
            <button
              type="button"
              onClick={() => handleTabChange("transcript")}
              className={`lg:hidden inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "transcript"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
            >
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span>Transcript ({lesson.transcript.length})</span>
            </button>
          )}
        </div>

        {/* Language Mode Selector: Song ngữ | Tiếng Việt | Tiếng Anh */}
        {activeTab === "blueprint" && (
          <div
            role="group"
            aria-label="Chọn chế độ ngôn ngữ bài học"
            className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/60 p-1 text-xs font-semibold max-w-full overflow-x-auto"
          >
            <button
              type="button"
              onClick={() => handleLangModeChange("bilingual")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                langMode === "bilingual"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-2xs border border-[var(--border)] font-bold"
                  : "text-[var(--muted-strong)] hover:text-[var(--foreground)]"
              }`}
              title="Hiển thị song ngữ Anh - Việt"
            >
              <Languages className="h-3.5 w-3.5 text-indigo-500" />
              <span>Song ngữ</span>
            </button>

            <button
              type="button"
              onClick={() => handleLangModeChange("vi")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                langMode === "vi"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-2xs border border-[var(--border)] font-bold"
                  : "text-[var(--muted-strong)] hover:text-[var(--foreground)]"
              }`}
              title="Chỉ hiển thị Tiếng Việt"
            >
              <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400">VI</span>
              <span>Tiếng Việt</span>
            </button>

            <button
              type="button"
              onClick={() => handleLangModeChange("en")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                langMode === "en"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-2xs border border-[var(--border)] font-bold"
                  : "text-[var(--muted-strong)] hover:text-[var(--foreground)]"
              }`}
              title="Chỉ hiển thị Tiếng Anh"
            >
              <span className="rounded bg-indigo-500/10 px-1 py-0.2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">EN</span>
              <span>Tiếng Anh</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. TAB: ARCHITECTURE & DEEP DIVE MARKDOWN */}
      {activeTab === "blueprint" && (
        <div className="space-y-6">
          <section
            aria-label="Nội dung phân tích kiến trúc bài học"
            className="prose dark:prose-invert max-w-none text-[var(--foreground)] space-y-6"
          >
            <MarkdownContent
              markdown={lesson.contentMarkdown}
              languageMode={langMode}
              fullWidth
              textScale={textScale}
            />
          </section>
        </div>
      )}

      {/* 3. TAB: MOBILE TRANSCRIPT FALLBACK */}
      {activeTab === "transcript" && lesson.transcript && (
        <div className="space-y-6 animate-fade-in">
          <SpringTranscriptPanel
            transcript={lesson.transcript}
            inRail={false}
            textScale={textScale}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onSeek={onSeek}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            autoScroll={autoScroll}
            onToggleAutoScroll={onToggleAutoScroll}
          />
        </div>
      )}
    </div>
  );
});
