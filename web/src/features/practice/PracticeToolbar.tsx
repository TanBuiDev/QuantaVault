"use client";

import { ChevronLeft, ChevronRight, Columns, LayoutTemplate, Settings, WrapText } from "lucide-react";
import Link from "next/link";



import type { usePracticeWorkspace } from "./usePracticeWorkspace";
function getStatusConfig(status?: string) {
  switch (status) {
    case "solved":
      return {
        label: "Solved",
        className: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs shadow-emerald-950/20",
      };
    case "review":
      return {
        label: "Review",
        className: "bg-amber-600 hover:bg-amber-500 text-white shadow-xs shadow-amber-950/20",
      };
    case "in-progress":
      return {
        label: "In Progress",
        className: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-950/20",
      };
    default:
      return {
        label: "Not Started",
        className: "bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/40 shadow-xs",
      };
  }
}

export function PracticeToolbar(model: ReturnType<typeof usePracticeWorkspace>) {
  const {
    content,
    previous,
    next,
    updateProblem,
    progress,
    layoutMode,
    wordWrap,
    isSettingsOpen,
    setIsSettingsOpen,
    settingsRef,
    handleToggleWordWrap,
    handleSetLayoutMode
  } = model;
  return (<>
    <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Problem #{content.id}</p>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
            {content.title}
          </h1>
        </div>

        {/* Quick controls: Problem navigation & Layout switcher & LeetCode link & Status & Settings */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Prev / Next Problem Navigation */}
          <div className="flex items-center gap-0.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-0.5" aria-label="Điều hướng bài tập">
            {previous ? (
              <Link
                href={`/problems/${previous.id}`}
                title={`Bài trước: #${previous.id} ${previous.title}`}
                aria-label={`Bài trước: #${previous.id} ${previous.title}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-strong)] transition-all hover:bg-[var(--surface)] hover:text-[var(--foreground)] hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span
                title="Không có bài trước đó"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted)]/30 cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}

            <div className="h-3.5 w-px bg-[var(--border)]" />

            {next ? (
              <Link
                href={`/problems/${next.id}`}
                title={`Bài tiếp theo: #${next.id} ${next.title}`}
                aria-label={`Bài tiếp theo: #${next.id} ${next.title}`}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-strong)] transition-all hover:bg-[var(--surface)] hover:text-[var(--foreground)] hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span
                title="Không có bài tiếp theo"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted)]/30 cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-1 text-xs">
            <button
              type="button"
              onClick={() => handleSetLayoutMode("split")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${layoutMode === "split"
                ? "bg-[var(--surface)] text-[var(--foreground)] font-bold shadow-xs ring-1 ring-[var(--border)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              title="Giao diện Chia màn hình kiểu LeetCode"
            >
              <Columns className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Split Editor</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetLayoutMode("classic")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${layoutMode === "classic"
                ? "bg-[var(--surface)] text-[var(--foreground)] font-bold shadow-xs ring-1 ring-[var(--border)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              title="Giao diện Truyền thống (Đọc tài liệu)"
            >
              <LayoutTemplate className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Classic</span>
            </button>
          </div>

          <a
            href={content.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface-hover)]"
          >
            LeetCode <span aria-hidden="true">↗</span>
          </a>

          <div className="flex items-center" aria-label="Learning status">
            {(() => {
              const statusConfig = getStatusConfig(progress?.status);
              const handleCycleStatus = () => {
                const current = progress?.status;
                let next: "in-progress" | "solved" | "review" = "in-progress";
                if (current === "in-progress") {
                  next = "solved";
                } else if (current === "solved") {
                  next = "review";
                } else if (current === "review") {
                  next = "in-progress";
                } else {
                  next = "in-progress";
                }
                updateProblem(content.id, { status: next });
              };

              return (
                <button
                  type="button"
                  onClick={handleCycleStatus}
                  title="Click to change status"
                  className={`h-8 px-3.5 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-[0.97] cursor-pointer select-none ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </button>
              );
            })()}
          </div>

          {/* Settings Button (Right of status button) */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title="Cài đặt hiển thị (Settings)"
              aria-label="Cài đặt hiển thị"
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${isSettingsOpen
                ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
            >
              <Settings className={`h-4 w-4 transition-transform duration-200 ${isSettingsOpen ? "rotate-45 text-indigo-500" : ""}`} />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    <Settings className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Cài đặt Editor</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="flex h-5 w-5 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] text-xs cursor-pointer"
                    title="Đóng"
                  >
                    ✕
                  </button>
                </div>

                <div className="pt-3 space-y-3">
                  {/* Word Wrap Setting */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
                        <WrapText className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Tự động xuống dòng</span>
                      </div>
                      <div className="text-[11px] text-[var(--muted)]">Word Wrap (Monaco & Docs)</div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={wordWrap}
                      onClick={handleToggleWordWrap}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${wordWrap ? "bg-indigo-600" : "bg-slate-600/50"
                        }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${wordWrap ? "translate-x-4" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>


  </>);
}
