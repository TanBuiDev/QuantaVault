"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Volume2,
  Copy,
  Check,
  Search
} from "lucide-react";
import type { CourseTranscriptSentence } from "@/lib/courses";
import { useEnglishSpeech } from "@/lib/courses/speech";

export interface SpringTranscriptPanelProps {
  transcript?: CourseTranscriptSentence[];
  inRail?: boolean;
  textScale?: number;
  className?: string;
}

type TranscriptFilterMode = "bilingual" | "vi-only" | "en-only";

export function SpringTranscriptPanel({
  transcript = [],
  inRail = false,
  textScale = 100,
  className = ""
}: SpringTranscriptPanelProps) {
  const [transcriptFilter, setTranscriptFilter] = useState<TranscriptFilterMode>("bilingual");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSentenceId, setCopiedSentenceId] = useState<string | null>(null);
  const { speak, isSpeaking } = useEnglishSpeech();

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

  if (!transcript || transcript.length === 0) {
    return (
      <div className={`rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center text-xs text-[var(--muted)] ${className}`}>
        Chưa có transcript cho bài học này.
      </div>
    );
  }

  // --- 1. Right Rail Mode (Compact, scrollable beside video) ---
  if (inRail) {
    return (
      <div
        className={`flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-2xs space-y-3 ${className}`}
        style={{ fontSize: `${textScale}%` }}
      >
        {/* Rail Search Box */}
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Tìm trong bài..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/50 pl-8 pr-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Rail Filter Switcher */}
        <div className="flex items-center justify-between gap-1 text-[11px] border-b border-[var(--border)] pb-2.5">
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

        {/* Rail Scrollable Sentences List */}
        <div className="overflow-y-auto max-h-[460px] 2xl:max-h-[540px] space-y-2 pr-1 custom-scrollbar">
          {filteredTranscript.length === 0 ? (
            <p className="text-center py-6 text-xs text-[var(--muted)]">
              Không tìm thấy câu nào khớp với từ khóa.
            </p>
          ) : (
            filteredTranscript.map((sent, idx) => (
              <div
                key={sent.id || idx}
                className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/30 p-2.5 hover:border-emerald-500/40 hover:bg-[var(--surface-hover)]/60 transition-all text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="shrink-0 rounded bg-emerald-500/10 px-1 py-0.5 text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="space-y-1 min-w-0 flex-1">
                    {transcriptFilter !== "vi-only" && (
                      <p className="font-semibold text-[var(--foreground)] leading-relaxed select-text">
                        {sent.en}
                      </p>
                    )}
                    {transcriptFilter !== "en-only" && (
                      <p className="text-[11px] text-[var(--muted-strong)] leading-relaxed select-text">
                        {sent.vi}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
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
                      <Volume2 className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyText(`${sent.en}\n${sent.vi}`, sent.id)}
                      className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer transition-all"
                      title="Sao chép câu"
                      aria-label="Sao chép câu"
                    >
                      {copiedSentenceId === sent.id ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
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

      <div className="space-y-3">
        {filteredTranscript.length === 0 ? (
          <p className="text-center py-8 text-xs text-[var(--muted)]">
            Không tìm thấy câu nào khớp với từ khóa.
          </p>
        ) : (
          filteredTranscript.map((sent, idx) => (
            <div
              key={sent.id || idx}
              className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-emerald-500/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="shrink-0 mt-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="space-y-2 min-w-0 flex-1">
                    {transcriptFilter !== "vi-only" && (
                      <p className="text-sm font-semibold text-[var(--foreground)] leading-relaxed">
                        {sent.en}
                      </p>
                    )}
                    {transcriptFilter !== "en-only" && (
                      <p className="text-xs sm:text-sm text-[var(--muted-strong)] leading-relaxed">
                        {sent.vi}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
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
          ))
        )}
      </div>
    </div>
  );
}
