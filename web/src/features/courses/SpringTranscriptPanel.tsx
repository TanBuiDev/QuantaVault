"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  BookOpen,
  Volume2,
  Copy,
  Check,
  Search,
  Play,
  Navigation,
  Maximize2
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { CourseTranscriptSentence } from "@/lib/courses";
import { useEnglishSpeech } from "@/lib/courses/speech";

export interface SpringTranscriptPanelProps {
  transcript?: CourseTranscriptSentence[];
  inRail?: boolean;
  textScale?: number;
  className?: string;
  currentTime?: number;
  isPlaying?: boolean;
  onSeek?: (seconds: number) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  autoScroll?: boolean;
  onToggleAutoScroll?: () => void;
}

type TranscriptFilterMode = "bilingual" | "vi-only" | "en-only";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function SpringTranscriptPanel({
  transcript = [],
  inRail = false,
  textScale = 100,
  className = "",
  currentTime,
  isPlaying = false,
  onSeek,
  searchQuery,
  onSearchChange,
  autoScroll,
  onToggleAutoScroll
}: SpringTranscriptPanelProps) {
  const [transcriptFilter, setTranscriptFilter] = useState<TranscriptFilterMode>("bilingual");
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalAutoScroll, setInternalAutoScroll] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedSentenceId, setCopiedSentenceId] = useState<string | null>(null);
  const { speak, isSpeaking } = useEnglishSpeech();

  const activeSearchQuery = searchQuery !== undefined ? searchQuery : internalSearchQuery;
  const activeAutoScroll = autoScroll !== undefined ? autoScroll : internalAutoScroll;

  const handleSearchChange = (q: string) => {
    if (onSearchChange) onSearchChange(q);
    else setInternalSearchQuery(q);
  };

  const handleToggleAutoScroll = () => {
    if (onToggleAutoScroll) onToggleAutoScroll();
    else setInternalAutoScroll((prev) => !prev);
  };

  const listContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);
  const isUserInteractingRef = useRef(false);
  const userInteractionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Lắng nghe thao tác cuộn thủ công của người dùng để tạm hoãn auto-scroll
  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;

    const handleUserScroll = () => {
      isUserInteractingRef.current = true;
      if (userInteractionTimerRef.current) {
        clearTimeout(userInteractionTimerRef.current);
      }
      userInteractionTimerRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 3500);
    };

    container.addEventListener("wheel", handleUserScroll, { passive: true });
    container.addEventListener("touchmove", handleUserScroll, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleUserScroll);
      container.removeEventListener("touchmove", handleUserScroll);
      if (userInteractionTimerRef.current) {
        clearTimeout(userInteractionTimerRef.current);
      }
    };
  }, []);

  const handleCopyText = (text: string, id: string) => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(text);
      setCopiedSentenceId(id);
      setTimeout(() => setCopiedSentenceId((cur) => (cur === id ? null : cur)), 2000);
    }
  };

  const filteredTranscript = useMemo(() => {
    if (!transcript) return [];
    const q = activeSearchQuery.trim().toLowerCase();
    if (!q) return transcript;
    return transcript.filter(
      (s) => s.en.toLowerCase().includes(q) || s.vi.toLowerCase().includes(q)
    );
  }, [transcript, activeSearchQuery]);

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

  // Tính toán vị trí cuộn an toàn tuyệt đối: mép trên của thẻ active neo tại 20% chiều cao vùng cuộn
  const computeAnchorScrollTop = useCallback(() => {
    const container = listContainerRef.current;
    const activeEl = activeItemRef.current;
    if (!container || !activeEl) return null;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    // Khoảng cách thực tế từ mép trên khung cuộn đến mép trên của thẻ active
    const currentVisualTop = activeRect.top - containerRect.top;

    // Điểm neo mục tiêu: mép trên thẻ active nằm tại chính xác 20% chiều cao vùng cuộn
    const anchorTop = Math.round(containerRect.height * 0.20);

    // Độ lệch cần bù trừ vào scrollTop hiện tại
    const delta = currentVisualTop - anchorTop;
    const targetScrollTop = container.scrollTop + delta;

    // Xử lý ngoại lệ đầu & cuối danh sách (Clamp safe scroll boundaries)
    const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
    return Math.min(maxScrollTop, Math.max(0, targetScrollTop));
  }, []);

  // 1. Khi đổi tab Song ngữ / Tiếng Việt / Tiếng Anh hoặc cỡ chữ: Căn tức thì (Instant) trước khi paint
  useIsomorphicLayoutEffect(() => {
    if (!activeAutoScroll || !activeSentenceId) return;
    const safeTop = computeAnchorScrollTop();
    if (safeTop === null) return;

    const container = listContainerRef.current;
    if (container) {
      if (typeof container.scrollTo === "function") {
        container.scrollTo({ top: safeTop, behavior: "instant" as ScrollBehavior });
      } else {
        container.scrollTop = safeTop;
      }
    }
  }, [transcriptFilter, textScale, activeSentenceId, activeAutoScroll, computeAnchorScrollTop]);

  // 2. Khi đổi câu đang phát: Cuộn mượt (Smooth) đưa mép trên thẻ mới vào điểm neo 20%
  useEffect(() => {
    if (!activeAutoScroll || !activeSentenceId) return;
    if (isUserInteractingRef.current) return;

    const safeTop = computeAnchorScrollTop();
    if (safeTop === null) return;

    const container = listContainerRef.current;
    if (!container) return;

    // Bỏ qua nếu đã nằm chuẩn xác trong ngưỡng dung sai 2px
    if (Math.abs(container.scrollTop - safeTop) <= 2) return;

    if (typeof container.scrollTo === "function") {
      container.scrollTo({
        top: safeTop,
        behavior: "smooth"
      });
    } else {
      container.scrollTop = safeTop;
    }
  }, [activeSentenceId, activeAutoScroll, computeAnchorScrollTop]);

  const handleSentenceClick = (sent: CourseTranscriptSentence) => {
    isUserInteractingRef.current = false;
    if (userInteractionTimerRef.current) {
      clearTimeout(userInteractionTimerRef.current);
    }
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
      >
        {/* Rail Filter Switcher + Expand Reading Mode Button */}
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

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[var(--muted)] shrink-0 font-medium">
              {filteredTranscript.length} câu
            </span>

            {/* Nút Mở rộng (Zen Reading Mode) */}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/40 px-2 py-0.5 text-[11px] font-semibold text-[var(--muted-strong)] hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer shadow-2xs"
              title="Mở rộng chế độ đọc chuyên sâu toàn màn hình"
            >
              <Maximize2 className="h-3 w-3" />
              <span className="hidden sm:inline">Mở rộng</span>
            </button>
          </div>
        </div>

        {/* Rail Scrollable Sentences List (Hidden Scrollbar) */}
        <div
          ref={listContainerRef}
          className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {filteredTranscript.length === 0 ? (
            <p className="text-center py-6 text-xs text-[var(--muted)]">
              Không tìm thấy câu nào khớp với từ khóa.
            </p>
          ) : (
            filteredTranscript.map((sent, idx) => {
              const isActive = sent.id === activeSentenceId;
              const isPast = activeIndex >= 0 && idx < activeIndex;
              const isFuture = activeIndex >= 0 && idx > activeIndex;

              return (
                <div
                  key={sent.id || idx}
                  ref={isActive ? activeItemRef : undefined}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    handleSentenceClick(sent);
                  }}
                  className={`group relative rounded-xl p-2.5 transition-all duration-300 ease-out cursor-pointer select-text overflow-hidden ${
                    isActive
                      ? "border-2 border-emerald-500 bg-emerald-500/15 shadow-sm ring-1 ring-emerald-500/20 opacity-100"
                      : `border-2 border-[var(--border)]/70 bg-[var(--surface-hover)]/30 hover:border-emerald-500/40 hover:bg-[var(--surface-hover)]/60 ${
                          isPast ? "opacity-70 hover:opacity-100" : isFuture ? "opacity-90 hover:opacity-100" : "opacity-100"
                        }`
                  }`}
                >
                  {/* Dải sáng định vị bên trái (Left Accent Pill) */}
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-all duration-300 ${
                      isActive ? "bg-emerald-500 opacity-100 scale-y-100" : "bg-transparent opacity-0 scale-y-50"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-2.5 pl-1.5">
                    {/* Timestamp / Index Pill with Equalizer */}
                    {isActive ? (
                      <span className="shrink-0 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] font-mono font-bold text-white shadow-2xs flex items-center gap-1.5">
                        <span className="flex items-end gap-0.5 h-2.5 w-2.5 justify-center overflow-hidden pb-0.5" aria-hidden="true">
                          <span className={`w-0.5 bg-white rounded-full transition-all ${isPlaying ? "animate-eq-1" : "h-2"}`} />
                          <span className={`w-0.5 bg-white rounded-full transition-all ${isPlaying ? "animate-eq-2" : "h-2.5"}`} />
                          <span className={`w-0.5 bg-white rounded-full transition-all ${isPlaying ? "animate-eq-3" : "h-1.5"}`} />
                        </span>
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
                      {transcriptFilter !== "vi-only" && (
                        <p
                          style={{ fontSize: `${(13 * textScale) / 100}px` }}
                          className={`leading-relaxed ${
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
                          style={{ fontSize: `${(12 * textScale) / 100}px` }}
                          className={`leading-relaxed ${
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

        {/* Modal Chế độ Đọc Chuyên Sâu (Zen Reading Mode) */}
        <Modal
          isOpen={isExpanded}
          onClose={() => setIsExpanded(false)}
          title="Chế độ Đọc Chuyên Sâu (Zen Reading Mode)"
          description={`Nội dung bài học & Transcript song ngữ (${filteredTranscript.length} câu)`}
          maxWidth="3xl"
          contentClassName="p-4 sm:p-6"
        >
          <div className="space-y-4">
            {/* Modal Header Actions: Search & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border)] pb-3">
              <div className="flex rounded-lg bg-[var(--surface-hover)] p-0.5 border border-[var(--border)] font-medium text-xs">
                <button
                  type="button"
                  onClick={() => setTranscriptFilter("bilingual")}
                  className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
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
                  className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
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
                  className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                    transcriptFilter === "en-only"
                      ? "bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-2xs font-bold"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Tiếng Anh
                </button>
              </div>

              <div className="relative min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung..."
                  value={activeSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/50 pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Modal Sentences List */}
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {filteredTranscript.map((sent, idx) => {
                const isActive = sent.id === activeSentenceId;
                return (
                  <div
                    key={`modal-${sent.id || idx}`}
                    onClick={() => handleSentenceClick(sent)}
                    className={`group relative rounded-2xl p-4 transition-all cursor-pointer select-text ${
                      isActive
                        ? "border-2 border-emerald-500 bg-emerald-500/15 shadow-sm ring-1 ring-emerald-500/20"
                        : "border border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/40 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {isActive ? (
                          <span className="shrink-0 mt-0.5 rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-mono font-bold text-white shadow-2xs flex items-center gap-1">
                            <Play className="h-3 w-3 fill-current animate-pulse" />
                            <span>{sent.time || `#${String(idx + 1).padStart(2, "0")}`}</span>
                          </span>
                        ) : (
                          <span className="shrink-0 mt-0.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Play className="h-2.5 w-2.5 opacity-70" />
                            <span>{sent.time || `#${String(idx + 1).padStart(2, "0")}`}</span>
                          </span>
                        )}

                        <div className="space-y-1.5 min-w-0 flex-1">
                          {transcriptFilter !== "vi-only" && (
                            <p
                              style={{ fontSize: `${Math.max(14, (15 * textScale) / 100)}px` }}
                              className={`leading-relaxed ${
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
                              style={{ fontSize: `${Math.max(13, (14 * textScale) / 100)}px` }}
                              className={`leading-relaxed ${
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

                      <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speak(sent.en);
                          }}
                          className={`p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] cursor-pointer transition-all ${
                            isSpeaking(sent.en)
                              ? "text-emerald-500 animate-pulse bg-emerald-500/10"
                              : "text-[var(--muted)] hover:text-emerald-500"
                          }`}
                          title="Phát âm tiếng Anh"
                          aria-label="Phát âm tiếng Anh"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyText(`${sent.en}\n${sent.vi}`, sent.id);
                          }}
                          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer transition-all"
                          title="Sao chép câu"
                          aria-label="Sao chép câu"
                        >
                          {copiedSentenceId === sent.id ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // --- 2. Full / Mobile Mode ---
  return (
    <div className={`space-y-4 ${className}`}>
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
            onClick={handleToggleAutoScroll}
            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer ${
              activeAutoScroll
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            title={activeAutoScroll ? "Đang bật tự cuộn theo video (nhấp để tắt)" : "Đã tắt tự cuộn (nhấp để bật lại)"}
          >
            <Navigation className={`h-3 w-3 transition-transform ${activeAutoScroll ? "rotate-45 text-emerald-500" : ""}`} />
            <span>{activeAutoScroll ? "Tự cuộn: Bật" : "Tự cuộn: Tắt"}</span>
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
              value={activeSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-8 pr-3 py-1 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div ref={listContainerRef} className="space-y-3 max-h-[600px] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {filteredTranscript.length === 0 ? (
          <p className="text-center py-8 text-xs text-[var(--muted)]">
            Không tìm thấy câu nào khớp với từ khóa.
          </p>
        ) : (
          filteredTranscript.map((sent, idx) => {
            const isActive = sent.id === activeSentenceId;
            const isPast = activeIndex >= 0 && idx < activeIndex;
            const isFuture = activeIndex >= 0 && idx > activeIndex;

            return (
              <div
                key={sent.id || idx}
                ref={isActive ? activeItemRef : undefined}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("button")) return;
                  handleSentenceClick(sent);
                }}
                className={`group relative rounded-2xl p-4 transition-all duration-300 ease-out cursor-pointer select-text overflow-hidden ${
                  isActive
                    ? "border-2 border-emerald-500 bg-emerald-500/15 shadow-sm ring-1 ring-emerald-500/20 opacity-100"
                    : `border-2 border-[var(--border)]/70 bg-[var(--surface)] hover:border-emerald-500/40 hover:shadow-sm ${
                        isPast ? "opacity-70 hover:opacity-100" : isFuture ? "opacity-90 hover:opacity-100" : "opacity-100"
                      }`
                }`}
              >
                {/* Dải sáng định vị bên trái (Left Accent Pill) */}
                <span
                  className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full transition-all duration-300 ${
                    isActive ? "bg-emerald-500 opacity-100 scale-y-100" : "bg-transparent opacity-0 scale-y-50"
                  }`}
                />

                <div className="flex items-start justify-between gap-3 pl-2">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Timestamp / Index Pill with Equalizer */}
                    {isActive ? (
                      <span className="shrink-0 mt-0.5 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-2xs flex items-center gap-1.5">
                        <span className="flex items-end gap-0.5 h-2.5 w-2.5 justify-center overflow-hidden pb-0.5" aria-hidden="true">
                          <span className={`w-0.5 bg-white rounded-full transition-all ${isPlaying ? "animate-eq-1" : "h-2"}`} />
                          <span className={`w-0.5 bg-white rounded-full transition-all ${isPlaying ? "animate-eq-2" : "h-2.5"}`} />
                          <span className={`w-0.5 bg-white rounded-full transition-all ${isPlaying ? "animate-eq-3" : "h-1.5"}`} />
                        </span>
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

                    <div className="space-y-1.5 min-w-0 flex-1">
                      {transcriptFilter !== "vi-only" && (
                        <p
                          style={{ fontSize: `${(14 * textScale) / 100}px` }}
                          className={`leading-relaxed ${
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
                          style={{ fontSize: `${(13 * textScale) / 100}px` }}
                          className={`leading-relaxed ${
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


