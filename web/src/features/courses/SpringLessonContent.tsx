"use client";

import { useState } from "react";
import {
  Layers,
  Sparkles,
  BookOpen
} from "lucide-react";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import type { CourseLesson, CourseManifest } from "@/lib/courses";
import { getUrlParams, updateUrlParams } from "@/lib/utils/urlParams";
import { SpringTranscriptPanel } from "./SpringTranscriptPanel";
import { SpringDockFlashcards } from "./SpringDockFlashcards";

interface SpringLessonContentProps {
  course: CourseManifest;
  lesson: CourseLesson;
  textScale?: number;
  currentTime?: number;
  onSeek?: (seconds: number) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  autoScroll?: boolean;
  onToggleAutoScroll?: () => void;
  initialTab?: SpringTabMode;
}

type SpringTabMode = "flashcards" | "blueprint" | "transcript";

export function SpringLessonContent({
  course,
  lesson,
  textScale = 100,
  currentTime,
  onSeek,
  searchQuery,
  onSearchChange,
  autoScroll,
  onToggleAutoScroll,
  initialTab
}: SpringLessonContentProps) {
  const hasFlashcards = Boolean(lesson.flashcards && lesson.flashcards.length > 0);
  const defaultTab: SpringTabMode = initialTab || (hasFlashcards ? "flashcards" : "blueprint");

  // 1. Tab state synchronized with URL search params (Tier 1 state persistence)
  const [activeTab, setActiveTab] = useState<SpringTabMode>(() => {
    if (typeof window !== "undefined") {
      const paramTab = getUrlParams().get("tab");
      if (paramTab === "flashcards" || paramTab === "blueprint" || paramTab === "transcript") {
        return paramTab;
      }
    }
    return defaultTab;
  });

  const handleTabChange = (tab: SpringTabMode) => {
    setActiveTab(tab);
    updateUrlParams({ tab }, { tab: defaultTab });
  };

  const totalCards = lesson.flashcards?.length || 0;

  return (
    <div className="space-y-6 animate-fade-in" style={{ fontSize: `${textScale}%` }}>
      {/* 1. Lower Workspace Mode Switcher Tabs */}
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

          {/* Flashcard tab (Available for mobile or secondary access) */}
          {totalCards > 0 && (
            <button
              type="button"
              onClick={() => handleTabChange("flashcards")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "flashcards"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Thẻ Flashcard ({totalCards})</span>
            </button>
          )}

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
      </div>

      {/* 2. TAB: INTERACTIVE FLASHCARD DECK (Minimalist Zero-Clutter) */}
      {activeTab === "flashcards" && totalCards > 0 && lesson.flashcards && (
        <div className="h-[380px] max-w-2xl mx-auto animate-fade-in">
          <SpringDockFlashcards
            flashcards={lesson.flashcards}
            textScale={textScale}
            className="h-full"
          />
        </div>
      )}

      {/* 3. TAB: ARCHITECTURE & DEEP DIVE MARKDOWN */}
      {activeTab === "blueprint" && (
        <div className="space-y-6 animate-fade-in">
          <section
            aria-label="Nội dung phân tích kiến trúc bài học"
            className="prose dark:prose-invert max-w-none text-[var(--foreground)] space-y-6"
          >
            <MarkdownContent
              markdown={lesson.contentMarkdown}
              fullWidth
              textScale={textScale}
            />
          </section>
        </div>
      )}

      {/* 4. TAB: MOBILE TRANSCRIPT FALLBACK */}
      {activeTab === "transcript" && lesson.transcript && (
        <div className="space-y-6 animate-fade-in">
          <SpringTranscriptPanel
            transcript={lesson.transcript}
            inRail={false}
            textScale={textScale}
            currentTime={currentTime}
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
}
