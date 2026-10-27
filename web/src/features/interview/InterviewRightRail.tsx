"use client";

import { useState } from "react";
import {
  Presentation,
  Compass,
  FileText,
  Copy,
  Trash2,
  Keyboard,
} from "lucide-react";
import type { InterviewProgressState, InterviewQuestion } from "@/lib/interview/types";
import { INTERVIEW_CATEGORIES } from "@/lib/interview/types";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

export interface InterviewRightRailProps {
  questions: InterviewQuestion[];
  allQuestions: InterviewQuestion[];
  progress: InterviewProgressState;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenPresentation: () => void;
  onJumpToQuestion: (id: string) => void;
}

export function InterviewRightRail({
  questions,
  allQuestions,
  progress,
  activeCategory,
  onSelectCategory,
  onOpenPresentation,
  onJumpToQuestion,
}: InterviewRightRailProps) {
  const { success } = useToast();
  const confirm = useConfirm();

  // Scratchpad state stored in localStorage
  const [scratchpad, setScratchpad] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem("interview_scratchpad_notes") || "";
    } catch {
      return "";
    }
  });

  const handleScratchpadChange = (val: string) => {
    setScratchpad(val);
    try {
      localStorage.setItem("interview_scratchpad_notes", val);
    } catch {}
  };

  const handleCopyScratchpad = () => {
    if (!scratchpad.trim()) return;
    void navigator.clipboard.writeText(scratchpad);
    success("Đã sao chép ghi chú vào clipboard!");
  };

  const handleClearScratchpad = async () => {
    if (!scratchpad.trim()) return;
    const isConfirmed = await confirm({
      title: "Xóa toàn bộ ghi chú?",
      message: "Hành động này sẽ xóa sạch nội dung trong sổ tay ghi chú phỏng vấn của bạn.",
      confirmText: "Xóa ngay",
      cancelText: "Hủy",
      variant: "danger",
    });

    if (isConfirmed) {
      setScratchpad("");
      try {
        localStorage.removeItem("interview_scratchpad_notes");
      } catch {}
      success("Đã dọn sạch sổ tay ghi chú.");
    }
  };

  // Calculate progress per category across all canonical questions
  const categoryStats = Object.values(INTERVIEW_CATEGORIES).map((cat) => {
    const catQuestions = allQuestions.filter((q) => q.category === cat.id);
    const total = catQuestions.length;
    let learned = 0;
    for (const q of catQuestions) {
      if (progress.learned[q.id]) learned++;
    }
    const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
    return {
      ...cat,
      total,
      learned,
      percent,
    };
  });

  return (
    <div className="space-y-6">
      {/* 1. Presentation Mode Launch Card */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/60 via-indigo-950/80 to-slate-950 p-5 text-white shadow-xl shadow-indigo-950/20 backdrop-blur-md">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-xl bg-indigo-500/30 text-indigo-300 ring-1 ring-white/20">
              <Presentation className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Chế Độ Trình Chiếu
            </span>
          </div>

          <div>
            <h3 className="text-base font-black tracking-tight text-white">
              Chế Độ Trình Chiếu (P)
            </h3>
            <p className="mt-1 text-xs text-indigo-100/80 leading-relaxed">
              Giao diện trực quan: chữ to rõ nét, ẩn phiền nhiễu, tương tác mở đáp án từng câu hỏi.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPresentation}
            className="w-full inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:scale-98 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <Presentation className="h-3.5 w-3.5" />
            <span>Bật Trình Chiếu Ngay</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-6 -bottom-6 size-28 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Question Matrix / Mini-Map for current page */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Bản Đồ Câu Hỏi
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[var(--muted)]">
            {questions.length} câu hiển thị
          </span>
        </div>

        <p className="mt-2.5 text-[11px] text-[var(--muted)] leading-relaxed">
          Nhấp vào số thứ tự để cuộn nhanh đến câu hỏi tương ứng:
        </p>

        {/* Grid of question buttons */}
        <div className="mt-3.5 max-h-56 overflow-y-auto pr-1">
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, idx) => {
              const isLearned = Boolean(progress.learned[q.id]);
              const isReview = Boolean(progress.review[q.id]);
              const isBookmarked = Boolean(progress.bookmarks[q.id]);

              let statusStyle =
                "border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted-strong)] hover:border-indigo-500/50 hover:text-[var(--foreground)]";
              if (isLearned) {
                statusStyle =
                  "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold";
              } else if (isReview) {
                statusStyle =
                  "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold";
              } else if (isBookmarked) {
                statusStyle =
                  "border-indigo-500/40 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onJumpToQuestion(q.id)}
                  title={`#${idx + 1}: ${q.title}`}
                  className={`group relative flex h-8 items-center justify-center rounded-xl border text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer ${statusStyle}`}
                >
                  <span>#{idx + 1}</span>
                  {isBookmarked && (
                    <span className="absolute top-1 right-1 size-1.5 rounded-full bg-indigo-500 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3.5 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-3 text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Nắm vững</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            <span>Cần ôn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-indigo-500" />
            <span>Đã lưu</span>
          </div>
        </div>
      </div>

      {/* 3. Category Breakdown / Topic Progress */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            Tiến Độ Theo Chuyên Đề
          </h3>
          {activeCategory !== "all" && (
            <button
              type="button"
              onClick={() => onSelectCategory("all")}
              className="text-[11px] font-bold text-indigo-500 hover:underline cursor-pointer"
            >
              Xem tất cả
            </button>
          )}
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {categoryStats.map((cat) => {
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? "all" : cat.id)}
                className={`w-full text-left rounded-2xl border p-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-indigo-500/50 bg-indigo-500/10 shadow-xs"
                    : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-[var(--foreground)]"}>
                    {cat.label}
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    {cat.learned} / {cat.total}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-hover)] border border-[var(--border)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Interview Scratchpad / Quick Notes */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Sổ Tay Phỏng Vấn
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyScratchpad}
              disabled={!scratchpad.trim()}
              className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Sao chép toàn bộ ghi chú"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => void handleClearScratchpad()}
              disabled={!scratchpad.trim()}
              className="rounded-lg p-1 text-[var(--muted)] hover:bg-rose-500/10 hover:text-rose-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Xóa ghi chú"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <textarea
          value={scratchpad}
          onChange={(e) => handleScratchpadChange(e.target.value)}
          placeholder="Ghi chú nhanh câu hỏi, checklist trọng tâm hoặc keyword cần tra cứu..."
          rows={4}
          className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-xs leading-relaxed text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
          <span>Tự động lưu vào trình duyệt</span>
          <span>{scratchpad.length} ký tự</span>
        </div>
      </div>

      {/* 5. Keyboard Shortcuts Cheat-sheet */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-hover)]/50 p-4 text-xs text-[var(--muted)] space-y-2">
        <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
          <Keyboard className="h-3.5 w-3.5 text-indigo-500" />
          <span>Phím tắt tiện dụng</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="flex items-center justify-between">
            <span>Trình chiếu:</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--foreground)]">
              P
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Tìm kiếm:</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--foreground)]">
              Ctrl K
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Thanh bên:</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--foreground)]">
              Ctrl B
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Biên tập:</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--foreground)]">
              Ctrl+Shift+E
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
