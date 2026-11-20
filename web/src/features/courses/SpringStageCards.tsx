"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Code2,
  Terminal,
  BookOpen,
  HelpCircle,
  Clock
} from "lucide-react";
import type { CourseLesson } from "@/lib/courses";
import { SpringDockFlashcards } from "./SpringDockFlashcards";

function formatAudioTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// =======================================================================
// 1. QUIZ STAGE: 3D Flashcard Arena tái sử dụng component Flashcard dùng chung
// =======================================================================
export function SpringQuizStage({
  lesson,
  textScale = 100
}: {
  lesson: CourseLesson;
  textScale?: number;
}) {
  const flashcards = lesson.flashcards || [];

  if (flashcards.length === 0) {
    return (
      <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center p-6 text-center shadow-xl">
        <HelpCircle className="h-12 w-12 text-emerald-500 mb-2" />
        <h3 className="text-base font-bold text-[var(--foreground)]">{lesson.title}</h3>
        <p className="text-xs text-[var(--muted)]">Không có thẻ flashcard nào trong bài học này.</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-xl flex flex-col p-2 sm:p-3">
      <SpringDockFlashcards
        flashcards={flashcards}
        textScale={textScale}
        className="h-full w-full"
      />
    </div>
  );
}

// =======================================================================
// 2. AUDIO STAGE: Studio Podcast Player matching 16:9 aspect ratio
// =======================================================================
export function SpringAudioStage({ lesson }: { lesson: CourseLesson }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

  const skipTime = (delta: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    if (audioRef.current) audioRef.current.playbackRate = newRate;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-6 sm:p-8 flex flex-col justify-between shadow-xl text-white overflow-hidden">
      {lesson.audioUrl && (
        <audio ref={audioRef} src={lesson.audioUrl} preload="metadata" />
      )}

      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between text-xs z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
          <Volume2 className="h-3.5 w-3.5" />
          <span>Bài đọc kết hợp Audio Lecture</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRate}
            className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-mono font-bold hover:bg-white/20 transition-colors"
            title="Tốc độ phát"
          >
            {playbackRate}x
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-lg border border-white/20 bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            title={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Center Waveform & Title */}
      <div className="my-auto text-center space-y-3 z-10">
        <h3 className="text-base sm:text-lg lg:text-xl font-black text-white line-clamp-2 px-4">
          {lesson.title}
        </h3>
        {lesson.titleEn && (
          <p className="text-xs sm:text-sm text-indigo-300 font-medium">
            {lesson.titleEn}
          </p>
        )}
      </div>

      {/* Audio Controls & Slider */}
      <div className="space-y-3 z-10">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => skipTime(-10)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Lùi 10s"
          >
            <Rewind className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer ${
              isPlaying
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-indigo-500 text-white shadow-indigo-500/30"
            }`}
            aria-label={isPlaying ? "Tạm dừng" : "Phát audio"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 sm:h-7 sm:w-7 fill-current" />
            ) : (
              <Play className="h-6 w-6 sm:h-7 sm:w-7 ml-0.5 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={() => skipTime(10)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Tua 10s"
          >
            <FastForward className="h-4 w-4" />
          </button>
        </div>

        {/* Seek slider */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
            <span>{formatAudioTime(currentTime)}</span>
            <span>{formatAudioTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =======================================================================
// 3. DOCUMENT STAGE: Reading / Cheatsheet / Practice matching 16:9 aspect ratio
// =======================================================================
export function SpringDocumentStage({
  lesson,
  chapterTitle
}: {
  lesson: CourseLesson;
  chapterTitle: string;
}) {
  const isCheatsheet = lesson.lessonType === "cheatsheet";
  const isPractice = lesson.lessonType === "practice";

  const Icon = isCheatsheet ? Code2 : isPractice ? Terminal : BookOpen;
  const label = isCheatsheet
    ? "Sổ tay tra cứu mã nguồn (Cheat Sheet)"
    : isPractice
    ? "Bài thực hành kịch bản & Tình huống"
    : "Tài liệu đọc chuyên sâu";

  return (
    <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--surface-hover)] p-6 sm:p-8 flex flex-col justify-between shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Icon className="h-3.5 w-3.5" />
          <span>{label}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[var(--muted)]">
          <Clock className="h-3.5 w-3.5" />
          <span>{lesson.durationMinutes} phút đọc</span>
        </span>
      </div>

      {/* Center Hero Information */}
      <div className="my-auto space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 shrink-0">
            <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg lg:text-xl font-black text-[var(--foreground)] tracking-tight line-clamp-2">
              {lesson.title}
            </h3>
            {lesson.titleEn && (
              <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                {lesson.titleEn}
              </p>
            )}
          </div>
        </div>

        {lesson.summary && (
          <p className="text-xs sm:text-sm text-[var(--muted-strong)] line-clamp-3 leading-relaxed">
            {lesson.summary}
          </p>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)] pt-2 border-t border-[var(--border)]">
        <span className="truncate">{chapterTitle}</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] shrink-0">
          Xem tài liệu chi tiết bên dưới ↓
        </span>
      </div>
    </div>
  );
}
