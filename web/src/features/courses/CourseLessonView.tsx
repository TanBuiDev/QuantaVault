"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Share2,
  Check,
  BookOpen,
  Languages,
  Volume2,
  ArrowRight,
  ExternalLink,
  Layers,
  Search,
  Navigation,
  MoreVertical,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MarkdownContent } from "@/features/practice/MarkdownContent";
import { InterviewTextSizeControl } from "@/features/interview/InterviewTextSizeControl";
import { useCourseTextSize } from "./useCourseTextSize";
import type { CourseLesson, CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";
import { useEnglishSpeech } from "@/lib/courses/speech";
import { CourseSyllabusSidebar } from "./CourseSyllabusSidebar";
import { EnglishLessonContent } from "./EnglishLessonContent";
import { SpringLessonContent } from "./SpringLessonContent";
import { SpringTranscriptPanel } from "./SpringTranscriptPanel";
import { SpringDockFlashcards } from "./SpringDockFlashcards";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface CourseLessonViewProps {
  course: CourseManifest;
  lesson: CourseLesson;
  chapterTitle: string;
  prevLesson?: CourseLesson;
  nextLesson?: CourseLesson;
}

export function CourseLessonView({
  course,
  lesson,
  chapterTitle,
  prevLesson,
  nextLesson
}: CourseLessonViewProps) {
  const [mobileSyllabusOpen, setMobileSyllabusOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [rightRailTab, setRightRailTab] = useState<"transcript" | "flashcards" | "syllabus">("transcript");
  const [transcriptSearchQuery, setTranscriptSearchQuery] = useState("");
  const [transcriptAutoScroll, setTranscriptAutoScroll] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click-outside & Escape handler for kebab menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  // --- Video Sync State & Height Matching ---
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videoHeight, setVideoHeight] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const ytPlayerRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { textScale, changeTextScale } = useCourseTextSize();
  const { speak, isSpeaking } = useEnglishSpeech();
  const isEnglish = course.slug === "english-job-interview";
  const isSpring = course.slug === "spring-framework-for-java";
  const visibleMarkdown = isEnglish
    ? lesson.contentMarkdown.replace(/^# Lesson [^\n]*\n\n\*\*Tiếng Việt:\*\*[^\n]*\n\n---\n\n/, "")
    : lesson.contentMarkdown;

  const {
    hydrated,
    isLessonCompleted,
    toggleLessonCompleted,
    recordLastAccessed,
    getCourseCompletion
  } = useCourseProgress();

  const isCompleted = hydrated ? isLessonCompleted(course.id, lesson.id) : false;
  const courseCompleted = hydrated && getCourseCompletion(course.id, course.totalLessons).completedCount === course.totalLessons;

  // Record this lesson as last visited
  useEffect(() => {
    recordLastAccessed(course.id, lesson.id);
  }, [course.id, lesson.id, recordLastAccessed]);

  // Measure exact video height to sync with transcript panel
  useEffect(() => {
    if (!videoContainerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(entry.contentRect.height);
        if (h > 0) {
          setVideoHeight(h);
        }
      }
    });
    ro.observe(videoContainerRef.current);
    return () => ro.disconnect();
  }, []);

  // Initialize YouTube IFrame API & postMessage listener
  useEffect(() => {
    if (!isSpring || !lesson.videoId) return;

    let destroyed = false;

    // 1. Listen for postMessage from YouTube iframe
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data && data.event === "infoDelivery" && data.info) {
          if (typeof data.info.currentTime === "number") {
            setCurrentTime(data.info.currentTime);
          }
          if (typeof data.info.playerState === "number") {
            setIsPlaying(data.info.playerState === 1);
          }
        }
      } catch {
        // ignore non-json messages
      }
    };
    window.addEventListener("message", handleWindowMessage);

    // 2. Setup YouTube IFrame API
    const initYT = () => {
      if (destroyed || typeof window === "undefined" || !window.YT || !window.YT.Player) return;
      try {
        ytPlayerRef.current = new window.YT.Player("spring-youtube-iframe", {
          events: {
            onStateChange: (e: any) => {
              if (destroyed) return;
              const playing = e.data === 1;
              setIsPlaying(playing);
              if (ytPlayerRef.current?.getCurrentTime) {
                const t = ytPlayerRef.current.getCurrentTime();
                if (typeof t === "number") setCurrentTime(t);
              }
            }
          }
        });
      } catch {
        // Fallback gracefully
      }
    };

    if (typeof window !== "undefined") {
      if (window.YT && window.YT.Player) {
        initYT();
      } else {
        const prevOnReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (prevOnReady) prevOnReady();
          initYT();
        };

        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          document.head.appendChild(script);
        }
      }
    }

    return () => {
      destroyed = true;
      window.removeEventListener("message", handleWindowMessage);
      try {
        ytPlayerRef.current?.destroy?.();
      } catch {
        // ignore
      }
      ytPlayerRef.current = null;
    };
  }, [isSpring, lesson.videoId]);

  // Polling currentTime when video is playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
        const t = ytPlayerRef.current.getCurrentTime();
        if (typeof t === "number") {
          setCurrentTime(t);
        }
      }
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Seek handler when user clicks a transcript sentence or timestamp
  const handleSeek = useCallback((seconds: number) => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
      ytPlayerRef.current.seekTo(seconds, true);
      if (typeof ytPlayerRef.current.playVideo === "function") {
        ytPlayerRef.current.playVideo();
      }
    }

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [seconds, true]
        }),
        "*"
      );
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "playVideo",
          args: []
        }),
        "*"
      );
    }

    setCurrentTime(seconds);
  }, []);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl xl:max-w-7xl 2xl:max-w-[1720px] space-y-6 lg:space-y-8 animate-fade-in">
      {/* Mobile Syllabus Drawer Overlay */}
      {mobileSyllabusOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSyllabusOpen(false)}
          />
          <div className="relative w-84 max-w-[85vw] bg-[var(--surface)] h-full shadow-2xl flex flex-col z-10 animate-slide-in-left">
            <div className="flex items-center justify-between p-3.5 border-b border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--foreground)]">Mục Lục Khóa Học</span>
              <button
                type="button"
                onClick={() => setMobileSyllabusOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:bg-[var(--surface-hover)] cursor-pointer"
                aria-label="Đóng mục lục"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CourseSyllabusSidebar
                course={course}
                currentLessonId={lesson.id}
                onLessonSelect={() => setMobileSyllabusOpen(false)}
                className="flex flex-col h-full bg-[var(--surface)] overflow-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* 1. Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSyllabusOpen(true)}
            className="lg:hidden flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] shadow-2xs cursor-pointer"
          >
            <Menu className="h-4 w-4 text-emerald-500" />
            <span>Mục lục</span>
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted)] truncate">
            <Link href="/courses" className="hover:text-[var(--foreground)] transition-colors">
              Khóa học
            </Link>
            <span>/</span>
            <span className="text-[var(--muted-strong)] truncate">{course.title}</span>
            <span>/</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold truncate">
              Bài {lesson.number}
            </span>
          </nav>
        </div>

        {/* Top right actions for non-Spring or mobile fallback */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="lg:hidden">
            <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />
          </div>

          {!isSpring && (
            <>
              {isEnglish && (
                <Link
                  href={`/courses/english-job-interview/practice?lesson=${lesson.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
                  aria-label="Mở chế độ luyện tập tiếng Anh"
                >
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">Luyện tập</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-all cursor-pointer shadow-2xs"
                title="Sao chép liên kết bài học"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Đã chép</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Chia sẻ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleLessonCompleted(course.id, lesson.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isCompleted
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    : "bg-[var(--primary)] text-white hover:brightness-110 shadow-sm active:scale-95"
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Đã học xong</span>
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" />
                    <span>Đánh dấu đã học</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SPECIALIZED SPRING LAYOUT: STUDIO THEATER (60 : 40 DOCK)    */}
      {/* ============================================================== */}
      {isSpring ? (
        <div className="space-y-6 sm:space-y-8">
          {/* HÀNG 1: THEATER DOCK (Video 60% : Transcript/Syllabus 40%) */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">
            {/* Cột 1: Video Player (Chiếm 7/12 = ~58.3% -> 60%) */}
            <div ref={videoContainerRef} className="lg:col-span-7 2xl:col-span-7 flex flex-col">
              {lesson.videoId ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-black shadow-xl">
                  <iframe
                    ref={iframeRef}
                    id="spring-youtube-iframe"
                    src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?enablejsapi=1&rel=0&modestbranding=1`}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
                  Chưa có video bài giảng trực tuyến.
                </div>
              )}
            </div>

            {/* Cột 2: Transcript & Mục lục Panel (Chiếm 5/12 = ~41.7% -> 40%) */}
            <div
              className="hidden lg:flex lg:col-span-5 2xl:col-span-5 flex-col overflow-hidden space-y-2.5 h-[420px] lg:h-[440px] xl:h-[470px] 2xl:h-[510px]"
              style={{
                height: videoHeight ? `${videoHeight}px` : undefined,
                maxHeight: videoHeight ? `${videoHeight}px` : undefined
              }}
            >
              {/* Tab Switcher Header + Search + Menu Tuỳ chọn [⋮] */}
              <div className="flex items-center justify-between gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 sm:p-2 shadow-2xs shrink-0">
                <div className="flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setRightRailTab("transcript")}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      rightRailTab === "transcript"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs"
                        : "text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Transcript ({lesson.transcript?.length || 0})</span>
                  </button>

                  {lesson.flashcards && lesson.flashcards.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setRightRailTab("flashcards")}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        rightRailTab === "flashcards"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs"
                          : "text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Flashcard ({lesson.flashcards.length})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setRightRailTab("syllabus")}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      rightRailTab === "syllabus"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-2xs"
                        : "text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Mục lục ({course.totalLessons})</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  {/* Ô tìm kiếm transcript trên header (chỉ hiện khi tab transcript) */}
                  {rightRailTab === "transcript" && (
                    <div className="relative min-w-[55px] max-w-[110px] 2xl:max-w-[140px] flex-1">
                      <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Tìm..."
                        value={transcriptSearchQuery}
                        onChange={(e) => setTranscriptSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-hover)]/50 pl-6.5 pr-2 py-1 text-[11px] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  {/* Nút Menu Kebab [⋮] */}
                  <div ref={menuRef} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen((prev) => !prev)}
                      className={`inline-flex items-center justify-center rounded-lg p-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                        isMenuOpen
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-2xs"
                          : "border-[var(--border)] text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                      }`}
                      title="Tuỳ chọn bài học"
                      aria-label="Tuỳ chọn bài học"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>

                    {/* Popover Menu */}
                    {isMenuOpen && (
                      <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-xl backdrop-blur-md animate-fade-in space-y-2.5">
                        <div className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider px-1">
                          Tuỳ chọn bài học
                        </div>

                        {/* Tự cuộn theo video (chỉ khi tab transcript) */}
                        {rightRailTab === "transcript" && (
                          <div className="flex items-center justify-between gap-2 px-1 py-1 rounded-lg hover:bg-[var(--surface-hover)]/50">
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-[var(--foreground)]">Tự cuộn theo video</div>
                              <div className="text-[10px] text-[var(--muted)]">Cuộn tới câu đang phát</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setTranscriptAutoScroll((prev) => !prev)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                transcriptAutoScroll ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                              }`}
                              role="switch"
                              aria-checked={transcriptAutoScroll}
                              aria-label="Bật hoặc tắt tự cuộn theo video"
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  transcriptAutoScroll ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        )}

                        {/* Cỡ chữ bài học */}
                        <div className={`px-1 py-1 space-y-1.5 ${rightRailTab === "transcript" ? "border-t border-[var(--border)] pt-2" : ""}`}>
                          <div className="flex items-center justify-between text-xs text-[var(--muted-strong)]">
                            <span className="font-semibold">Cỡ chữ bài học</span>
                            <span className="text-[11px] font-mono text-emerald-500 font-bold">{textScale}%</span>
                          </div>
                          <div className="flex items-center justify-center pt-0.5">
                            <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Panel Content: Khớp 100% chiều cao video */}
              <div className="flex-1 min-h-0 overflow-hidden">
                {rightRailTab === "transcript" ? (
                  <SpringTranscriptPanel
                    transcript={lesson.transcript}
                    inRail
                    textScale={textScale}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    searchQuery={transcriptSearchQuery}
                    onSearchChange={setTranscriptSearchQuery}
                    autoScroll={transcriptAutoScroll}
                    onToggleAutoScroll={() => setTranscriptAutoScroll((prev) => !prev)}
                    className="h-full"
                  />
                ) : rightRailTab === "flashcards" && lesson.flashcards ? (
                  <SpringDockFlashcards
                    flashcards={lesson.flashcards}
                    textScale={textScale}
                    className="h-full"
                  />
                ) : (
                  <CourseSyllabusSidebar
                    course={course}
                    currentLessonId={lesson.id}
                    className="flex flex-col h-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xs overflow-hidden"
                  />
                )}
              </div>
            </div>
          </div>

          {/* HÀNG 2: THÔNG TIN & HÀNH ĐỘNG (Full-width bên dưới Theater Dock) */}
          <div className="space-y-4">
            {/* Title & Speech Header */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight leading-snug">
                  {lesson.title}
                </h1>
                {lesson.titleEn && (
                  <button
                    type="button"
                    onClick={() => speak(lesson.titleEn!)}
                    title="Nghe phát âm chuẩn tiêu đề tiếng Anh"
                    aria-label="Nghe phát âm tiêu đề tiếng Anh"
                    className={`inline-flex items-center justify-center p-1.5 rounded-xl border border-emerald-500/30 transition-all cursor-pointer ${
                      isSpeaking(lesson.titleEn)
                        ? "bg-emerald-600 text-white animate-pulse"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              {lesson.titleEn && (
                <p className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-semibold">
                  {lesson.titleEn}
                </p>
              )}
            </div>

            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 border-y border-[var(--border)]">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Mark complete */}
                <button
                  type="button"
                  onClick={() => toggleLessonCompleted(course.id, lesson.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isCompleted
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-[var(--primary)] text-white hover:brightness-110 shadow-sm active:scale-95"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Đã học xong</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" />
                      <span>Đánh dấu đã học</span>
                    </>
                  )}
                </button>

                {/* Share button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-all cursor-pointer shadow-2xs"
                  title="Sao chép liên kết bài học"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Chia sẻ</span>
                    </>
                  )}
                </button>

                {/* External YouTube Link */}
                {lesson.videoId && (
                  <a
                    href={`https://youtu.be/${lesson.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted-strong)] hover:text-red-500 hover:bg-[var(--surface-hover)] transition-all cursor-pointer shadow-2xs"
                    title="Mở video trên YouTube"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Mở trên YouTube</span>
                  </a>
                )}
              </div>
            </div>

            {/* YouTube-style Collapsible Description Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/60 p-4 transition-all hover:bg-[var(--surface-hover)]/80 shadow-2xs space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {chapterTitle}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{lesson.durationMinutes} phút học dự kiến</span>
                </span>
              </div>

              {lesson.summary && (
                <div>
                  <p className={`text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed ${
                    !descriptionExpanded ? "line-clamp-2" : ""
                  }`}>
                    <span className="font-bold text-[var(--foreground)] mr-1">
                      <BookOpen className="mr-1 inline-block h-3.5 w-3.5" />
                      Tóm tắt:
                    </span>
                    {lesson.summary}
                  </p>
                </div>
              )}

              {/* Expanded metadata: Tags */}
              {descriptionExpanded && lesson.tags && lesson.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border)]">
                  {lesson.tags.map((tag) => (
                    <Badge key={tag} variant="neutral">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  {descriptionExpanded ? "Thu gọn ▲" : "... Xem thêm ▼"}
                </button>
              </div>
            </div>
          </div>

          {/* HÀNG 3: KHÔNG GIAN HỌC CHUYÊN SÂU (Full-width Lower Workspace) */}
          <section aria-label="Nội dung bài học Spring Framework" className="pt-2">
            <SpringLessonContent
              course={course}
              lesson={lesson}
              textScale={textScale}
              onSeek={handleSeek}
              searchQuery={transcriptSearchQuery}
              onSearchChange={setTranscriptSearchQuery}
              autoScroll={transcriptAutoScroll}
              onToggleAutoScroll={() => setTranscriptAutoScroll((prev) => !prev)}
              initialTab="blueprint"
            />
          </section>

          {/* Footer Navigation Bar */}
          <footer className="pt-6 border-t border-[var(--border)]">
            <div className="flex items-center justify-between gap-4">
              {prevLesson ? (
                <Link
                  href={`/courses/${course.slug}/${prevLesson.id}`}
                  className="group flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left hover:border-emerald-500/40 hover:shadow-xs transition-all max-w-[48%]"
                >
                  <ChevronLeft className="h-5 w-5 shrink-0 text-[var(--muted)] group-hover:text-emerald-500 transition-colors" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                      Bài trước
                    </span>
                    <span className="block text-xs font-bold text-[var(--foreground)] truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {prevLesson.titleEn || prevLesson.title}
                    </span>
                    {prevLesson.titleEn && <span className="block truncate text-[11px] text-[var(--muted)]">{prevLesson.title}</span>}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/courses/${course.slug}/${nextLesson.id}`}
                  className="group flex items-center justify-end gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-right hover:border-emerald-500/40 hover:shadow-xs transition-all max-w-[48%]"
                >
                  <div className="min-w-0">
                    <span className="block text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                      Bài tiếp theo
                    </span>
                    <span className="block text-xs font-bold text-[var(--foreground)] truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {nextLesson.titleEn || nextLesson.title}
                    </span>
                    {nextLesson.titleEn && <span className="block truncate text-[11px] text-[var(--muted)]">{nextLesson.title}</span>}
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[var(--muted)] group-hover:text-emerald-500 transition-colors" />
                </Link>
              ) : (
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-500">
                    {courseCompleted ? "Chúc mừng bạn đã hoàn thành khóa học!" : "Đây là bài học cuối của khóa học."}
                  </span>
                </div>
              )}
            </div>
          </footer>
        </div>
      ) : (
        /* ============================================================== */
        /* STANDARD 2-COLUMN LAYOUT (For English & other courses)          */
        /* ============================================================== */
        <div className="xl:grid xl:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_380px] xl:gap-8 xl:items-start">
          <div className="space-y-6 sm:space-y-8 min-w-0">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {chapterTitle}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{lesson.durationMinutes} phút học dự kiến</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--foreground)] tracking-tight leading-snug">
                  {isEnglish && lesson.titleEn ? lesson.titleEn : lesson.title}
                </h1>
                {lesson.titleEn && (
                  <button
                    type="button"
                    onClick={() => speak(lesson.titleEn!)}
                    title="Nghe phát âm chuẩn tiêu đề tiếng Anh"
                    aria-label="Nghe phát âm tiêu đề tiếng Anh"
                    className={`inline-flex items-center justify-center p-2 rounded-xl border border-indigo-500/30 transition-all cursor-pointer ${
                      isSpeaking(lesson.titleEn)
                        ? "bg-indigo-600 text-white animate-pulse"
                        : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20"
                    }`}
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                )}
              </div>
              {isEnglish && lesson.titleEn ? (
                <p className="text-base sm:text-lg text-[var(--muted-strong)] font-medium">{lesson.title}</p>
              ) : lesson.titleEn ? (
                <p className="text-base sm:text-lg text-emerald-600 dark:text-emerald-400 font-semibold">{lesson.titleEn}</p>
              ) : null}

              {/* Quick practice card for English lessons */}
              {isEnglish && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      <Languages className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--foreground)]">Luyện nghe, dịch & phản xạ cho bài này</h4>
                      <p className="text-xs text-[var(--muted-strong)]">Gõ dịch hai chiều, nghe phát âm bản xứ và tự đánh giá khả năng ghi nhớ.</p>
                    </div>
                  </div>
                  <Link
                    href={`/courses/english-job-interview/practice?lesson=${lesson.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-all shadow-xs cursor-pointer"
                  >
                    Luyện tập ngay <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {/* Tags */}
              {lesson.tags && lesson.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {lesson.tags.map((tag) => (
                    <Badge key={tag} variant="neutral">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Summary Box */}
              {!isEnglish && lesson.summary && (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/60 p-4 sm:p-5 text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed shadow-2xs">
                  <span className="font-bold text-[var(--foreground)] block mb-1">
                    <BookOpen className="mr-1.5 inline-block h-4 w-4" aria-hidden="true" />
                    Tóm tắt bài học:
                  </span>
                  {lesson.summary}
                </div>
              )}
            </header>

            {/* Content Area */}
            {isEnglish ? (
              <section aria-label="Nội dung bài học tiếng Anh">
                <EnglishLessonContent
                  lessonId={lesson.id}
                  textScale={textScale}
                  fallbackMarkdown={visibleMarkdown}
                />
              </section>
            ) : (
              <section aria-label="Nội dung bài học" className="prose dark:prose-invert max-w-none text-[var(--foreground)] space-y-6">
                <MarkdownContent markdown={visibleMarkdown} fullWidth textScale={textScale} />
              </section>
            )}

            {/* Footer Navigation Bar */}
            <footer className="pt-6 border-t border-[var(--border)]">
              <div className="flex items-center justify-between gap-4">
                {prevLesson ? (
                  <Link
                    href={`/courses/${course.slug}/${prevLesson.id}`}
                    className="group flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left hover:border-emerald-500/40 hover:shadow-xs transition-all max-w-[48%]"
                  >
                    <ChevronLeft className="h-5 w-5 shrink-0 text-[var(--muted)] group-hover:text-emerald-500 transition-colors" />
                    <div className="min-w-0">
                      <span className="block text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                        Bài trước
                      </span>
                      <span className="block text-xs font-bold text-[var(--foreground)] truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {prevLesson.titleEn || prevLesson.title}
                      </span>
                      {prevLesson.titleEn && <span className="block truncate text-[11px] text-[var(--muted)]">{prevLesson.title}</span>}
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    href={`/courses/${course.slug}/${nextLesson.id}`}
                    className="group flex items-center justify-end gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-right hover:border-emerald-500/40 hover:shadow-xs transition-all max-w-[48%]"
                  >
                    <div className="min-w-0">
                      <span className="block text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                        Bài tiếp theo
                      </span>
                      <span className="block text-xs font-bold text-[var(--foreground)] truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {nextLesson.titleEn || nextLesson.title}
                      </span>
                      {nextLesson.titleEn && <span className="block truncate text-[11px] text-[var(--muted)]">{nextLesson.title}</span>}
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-[var(--muted)] group-hover:text-emerald-500 transition-colors" />
                  </Link>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-500">
                      {courseCompleted ? "Chúc mừng bạn đã hoàn thành khóa học!" : "Đây là bài học cuối của khóa học."}
                    </span>
                  </div>
                )}
              </div>
            </footer>
          </div>

          {/* Right Sticky Column for Standard Layout */}
          <aside className="hidden xl:block sticky top-6 space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 shadow-2xs">
              <span className="text-xs font-semibold text-[var(--foreground)]">Cỡ chữ bài học</span>
              <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />
            </div>

            <CourseSyllabusSidebar course={course} currentLessonId={lesson.id} />
          </aside>
        </div>
      )}
    </div>
  );
}
