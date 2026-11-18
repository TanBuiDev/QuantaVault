"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Volume2,
  Copy,
  Check,
  Search,
  Play,
  Radio,
  Navigation
} from "lucide-react";
import type { CourseTranscriptSentence } from "@/lib/courses";
import { useEnglishSpeech } from "@/lib/courses/speech";

export interface SpringTranscriptPanelProps {
  transcript?: CourseTranscriptSentence[];
  inRail?: boolean;
  textScale?: number;
  className?: string;
  currentTime?: number;
  onSeek?: (seconds: number) => void;
}

type TranscriptFilterMode = "bilingual" | "vi-only" | "en-only";

export function SpringTranscriptPanel({
  transcript = [],
  inRail = false,
  textScale = 100,
  className = "",
  currentTime,
  onSeek
}: SpringTranscriptPanelProps) {
  const [transcriptFilter, setTranscriptFilter] = useState<TranscriptFilterMode>("bilingual");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedSentenceId, setCopiedSentenceId] = useState<string | null>(null);
  const { speak, isSpeaking } = useEnglishSpeech();

  const listContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  const handleCopyText = (text: string, id: string) => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(text);
      setCopiedSentenceId(id);
      setTimeout(() => setCopiedSentenceId((cur) => (cur === id ? null : cur)), 2000);
    }
  };

  const filteredTranscript = useMemo(() => {
    if (!transcript) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return transcript;
    return transcript.filter(
      (s) => s.en.toLowerCase().includes(q) || s.vi.toLowerCase().includes(q)
    );
  }, [transcript, searchQuery]);

  // Compute active sentence based on video currentTime
  const activeIndex = useMemo(() => {
    if (currentTime === undefined || currentTime < 0 || !transcript || transcript.length === 0) {
      return -1;
    }
    for (let i = transcript.length - 1; i >= 0; i--) {
      const s = transcript[i];
      if (s.start !== undefined && currentTime >= s.start) {
        return i;
      }
    }
    return -1;
  }, [currentTime, transcript]);

  const activeSentenceId = activeIndex >= 0 && transcript ? transcript[activeIndex]?.id : null;

  // Auto-scroll to active sentence inside the panel container
  useEffect(() => {
    if (!autoScroll || !activeSentenceId) return;
    const container = listContainerRef.current;
    const activeEl = activeItemRef.current;
    if (!container || !activeEl) return;

    const offsetWithinContainer = activeEl.offsetTop - container.offsetTop;
    const targetScrollTop = offsetWithinContainer - container.clientHeight / 2 + activeEl.clientHeight / 2;

    if (typeof container.scrollTo === "function") {
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth"
      });
    } else {
      container.scrollTop = Math.max(0, targetScrollTop);
    }
  }, [activeSentenceId, autoScroll]);

  const handleSentenceClick = (sent: CourseTranscriptSentence) => {
    if (sent.start !== undefined && onSeek) {
      onSeek(sent.start);
    }
  };

  if (!transcript || transcript.length === 0) {
    return (
      <div className={`rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center text-xs text-[var(--muted)] ${className}`}>
        Chưa có transcript cho bài học này.
      </div>
    );
  }

  // --- 1. Right Rail Mode (Compact, scrollable beside video in Theater Dock) ---
  if (inRail) {
    return (
      <div
        className={`flex flex-col h-full rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:p-3.5 shadow-2xs space-y-2.5 overflow-hidden ${className}`}
        style={{ fontSize: `${textScale}%` }}
      >
        {/* Rail Top Action Bar: Search & Auto-scroll Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Tìm trong bài..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/50 pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => setAutoScroll((prev) => !prev)}
            className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold border transition-all shrink-0 cursor-pointer ${
              autoScroll
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] bg-[var(--surface-hover)]/40"
            }`}
            title={autoScroll ? "Đang bật tự cuộn theo video (nhấp để tắt)" : "Đã tắt tự cuộn (nhấp để bật lại)"}
          >
            <Navigation className={`h-3 w-3 transition-transform ${autoScroll ? "rotate-45 text-emerald-500" : ""}`} />
            <span className="hidden sm:inline">{autoScroll ? "Tự cuộn: Bật" : "Tự cuộn: Tắt"}</span>
          </button>
        </div>

        {/* Rail Filter Switcher */}
        <div className="flex items-center justify-between gap-1 text-[11px] border-b border-[var(--border)] pb-2 shrink-0">
          <div className="flex rounded-lg bg-[var(--surface-hover)] p-0.5 border border-[var(--border)] font-medium">
            <button
              type="button"
              onClick={() => setTranscriptFilter("bilingual")}
              className={`rounded-md px-2 py-0.5 transition-all cursor-pointer ${
                transcriptFilter === "bilingual"
                  ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Song ngữ
            </button>
            <button
              type="button"
              onClick={() => setTranscriptFilter("vi-only")}
              className={`rounded-md px-2 py-0.5 transition-all cursor-pointer ${
                transcriptFilter === "vi-only"
                  ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => setTranscriptFilter("en-only")}
              className={`rounded-md px-2 py-0.5 transition-all cursor-pointer ${
                transcriptFilter === "en-only"
                  ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Tiếng Anh
            </button>
          </div>

          <span className="text-[10px] text-[var(--muted)] shrink-0 font-medium">
            {filteredTranscript.length} câu
          </span>
        </div>

        {/* Rail Scrollable Sentences List (Flex-1 to fill exact video height) */}
        <div
          ref={listContainerRef}
          className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar"
        >
          {filteredTranscript.length === 0 ? (
            <p className="text-center py-6 text-xs text-[var(--muted)]">
              Không tìm thấy câu nào khớp với từ khóa.
            </p>
          ) : (
            filteredTranscript.map((sent, idx) => {
              const isActive = sent.id === activeSentenceId;
              return (
                <div
                  key={sent.id || idx}
                  ref={isActive ? activeItemRef : undefined}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    handleSentenceClick(sent);
                  }}
                  className={`group relative rounded-xl p-2.5 transition-all text-xs cursor-pointer select-text ${
                    isActive
                      ? "border-2 border-emerald-500 bg-emerald-500/15 shadow-sm ring-1 ring-emerald-500/20"
                      : "border border-[var(--border)] bg-[var(--surface-hover)]/30 hover:border-emerald-500/40 hover:bg-[var(--surface-hover)]/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    {/* Timestamp / Index Pill */}
                    {isActive ? (
                      <span className="shrink-0 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white shadow-2xs flex items-center gap-1">
                        <Play className="h-2.5 w-2.5 fill-current animate-pulse" />
                        <span>{sent.time || `#${String(idx + 1).padStart(2, "0")}`}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSentenceClick(sent)}
                        className="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer flex items-center gap-1"
                        title={sent.time ? `Nhảy video tới ${sent.time}` : "Nhấp để nhảy video đến câu này"}
                      >
                        <Play className="h-2 w-2 opacity-70" />
                        <span>{sent.time || `#${String(idx + 1).padStart(2, "0")}`}</span>
                      </button>
                    )}

                    <div className="space-y-1 min-w-0 flex-1">
                      {isActive && (
                        <div className="flex items-center gap-1 pb-0.5">
                          <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Đang phát
                          </span>
                        </div>
                      )}

                      {transcriptFilter !== "vi-only" && (
                        <p
                          className={`text-xs sm:text-[13px] leading-relaxed ${
                            isActive
                              ? "font-bold text-emerald-950 dark:text-emerald-100"
                              : "font-semibold text-[var(--foreground)]"
                          }`}
                        >
                          {sent.en}
                        </p>
                      )}
                      {transcriptFilter !== "en-only" && (
                        <p
                          className={`text-xs leading-relaxed ${
                            isActive
                              ? "font-medium text-emerald-800 dark:text-emerald-300"
                              : "text-[var(--muted-strong)]"
                          }`}
                        >
                          {sent.vi}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => speak(sent.en)}
                        className={`p-1 rounded-md border border-[var(--border)] hover:bg-[var(--surface)] cursor-pointer transition-all ${
                          isSpeaking(sent.en)
                            ? "text-emerald-500 animate-pulse bg-emerald-500/10"
                            : "text-[var(--muted)] hover:text-emerald-500"
                        }`}
                        title="Phát âm tiếng Anh"
                        aria-label="Phát âm tiếng Anh"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyText(`${sent.en}\n${sent.vi}`, sent.id)}
                        className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer transition-all"
                        title="Sao chép câu"
                        aria-label="Sao chép câu"
                      >
                        {copiedSentenceId === sent.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // --- 2. Full / Mobile Mode ---
  return (
    <div className={`space-y-4 ${className}`} style={{ fontSize: `${textScale}%` }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 sm:p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-500" />
          <span className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
            Transcript Song Ngữ Anh – Việt ({filteredTranscript.length} câu)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Auto-scroll toggle */}
          <button
            type="button"
            onClick={() => setAutoScroll((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer ${
              autoScroll
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            title={autoScroll ? "Đang bật tự cuộn theo video (nhấp để tắt)" : "Đã tắt tự cuộn (nhấp để bật lại)"}
          >
            <Navigation className={`h-3 w-3 transition-transform ${autoScroll ? "rotate-45 text-emerald-500" : ""}`} />
            <span>{autoScroll ? "Tự cuộn: Bật" : "Tự cuộn: Tắt"}</span>
          </button>

          <div className="flex rounded-xl bg-[var(--surface-hover)] p-0.5 border border-[var(--border)] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTranscriptFilter("bilingual")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                transcriptFilter === "bilingual"
                  ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Song ngữ
            </button>
            <button
              type="button"
              onClick={() => setTranscriptFilter("vi-only")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                transcriptFilter === "vi-only"
                  ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Chỉ Tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => setTranscriptFilter("en-only")}
              className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                transcriptFilter === "en-only"
                  ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Chỉ Tiếng Anh
            </button>
          </div>

          <div className="relative min-w-[160px] sm:min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Tìm trong bài..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-8 pr-3 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div ref={listContainerRef} className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredTranscript.length === 0 ? (
          <p className="text-center py-8 text-xs text-[var(--muted)]">
            Không tìm thấy câu nào khớp với từ khóa.
          </p>
        ) : (
          filteredTranscript.map((sent, idx) => {
            const isActive = sent.id === activeSentenceId;
            return (
              <div
                key={sent.id || idx}
                ref={isActive ? activeItemRef : undefined}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button")) return;
                  handleSentenceClick(sent);
                }}
                className={`group relative rounded-2xl p-4 transition-all cursor-pointer select-text ${
                  isActive
                    ? "border-2 border-emerald-500 bg-emerald-500/15 shadow-sm ring-1 ring-emerald-500/20"
                    : "border border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/40 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {isActive ? (
                      <span className="shrink-0 mt-0.5 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-2xs flex items-center gap-1">
                        <Play className="h-2.5 w-2.5 fill-current animate-pulse" />
                        <span>{sent.time || `#${String(idx + 1).padStart(2, "0")}`}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSentenceClick(sent)}
                        className="shrink-0 mt-0.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors cursor-pointer flex items-center gap-1"
                        title={sent.time ? `Nhảy video tới ${sent.time}` : "Nhấp để nhảy video đến câu này"}
                      >
                        <Play className="h-2 w-2 opacity-70" />
                        <span>{sent.time || `#${String(idx + 1).padStart(2, "0")}`}</span>
                      </button>
                    )}

                    <div className="space-y-2 min-w-0 flex-1">
                      {isActive && (
                        <div className="flex items-center gap-1.5 pb-0.5">
                          <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Đang phát
                          </span>
                        </div>
                      )}

                      {transcriptFilter !== "vi-only" && (
                        <p
                          className={`text-sm leading-relaxed ${
                            isActive
                              ? "font-bold text-emerald-950 dark:text-emerald-100"
                              : "font-semibold text-[var(--foreground)]"
                          }`}
                        >
                          {sent.en}
                        </p>
                      )}
                      {transcriptFilter !== "en-only" && (
                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            isActive
                              ? "font-medium text-emerald-800 dark:text-emerald-300"
                              : "text-[var(--muted-strong)]"
                          }`}
                        >
                          {sent.vi}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      type="button"
                      onClick={() => speak(sent.en)}
                      className={`p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] cursor-pointer transition-all ${
                        isSpeaking(sent.en) ? "text-emerald-500 animate-pulse bg-emerald-500/10" : "text-[var(--muted)] hover:text-emerald-500"
                      }`}
                      title="Nghe phát âm chuẩn tiếng Anh"
                      aria-label="Nghe phát âm chuẩn tiếng Anh"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyText(`${sent.en}\n${sent.vi}`, sent.id)}
                      className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer transition-all"
                      title="Sao chép câu song ngữ"
                      aria-label="Sao chép câu song ngữ"
                    >
                      {copiedSentenceId === sent.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

