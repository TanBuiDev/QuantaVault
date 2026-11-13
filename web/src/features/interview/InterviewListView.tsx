"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { InterviewTextSizeControl } from "./InterviewTextSizeControl";
import { useInterviewTextSize } from "./useInterviewTextSize";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
  Sparkles,
  Code2,
  HelpCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookOpen,
  Plus,
  Edit3,
  Presentation,
} from "lucide-react";
import type {
  InterviewCategory,
  InterviewFilterState,
  InterviewQuestion,
} from "@/lib/interview/types";
import { filterInterviewQuestions } from "@/lib/interview";
import { formatQuestionBadge } from "@/lib/interview/types";
import { useInterviewProgress } from "@/lib/interview/progress";
import { useAccount } from "@/lib/auth/AccountProvider";
import {
  useInterviewDrafts,
  mergeQuestionsWithDrafts,
} from "@/lib/interview/draftStore";
import { InterviewStatsCard } from "./InterviewStatsCard";


import { InterviewMergeRecovery } from "./InterviewMergeRecovery";
import { isRetiredInterviewId } from "@/lib/interview/questionIdMerge";
import { InterviewFilterBar } from "./InterviewFilterBar";
import { InterviewQuestionCard } from "./InterviewQuestionCard";
import { InterviewEditModal } from "./InterviewEditModal";
import { PublishDrawer } from "./PublishDrawer";
import { PublishedConflictReview } from "./PublishedConflictReview";
import { InterviewRightRail } from "./InterviewRightRail";
import { InterviewPresentationModal } from "./InterviewPresentationModal";
import { getUrlParams, updateUrlParams } from "@/lib/utils/urlParams";
import { clearInterviewViewState, DEFAULT_INTERVIEW_FILTER, getInterviewViewState, saveInterviewViewState } from "@/lib/interview/viewState";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

export interface InterviewListViewProps {
  initialQuestions: InterviewQuestion[];
}

export type RecallMode = "summaries" | "answers";

function getPageList(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    const list: number[] = [];
    for (let i = 1; i <= totalPages; i++) list.push(i);
    return list;
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function InterviewListView({ initialQuestions }: InterviewListViewProps) {
  const confirm = useConfirm();
  const { user, loading: accountLoading, requestLogin } = useAccount();
  const canEdit = user?.role === "admin";
  const { textScale, changeTextScale } = useInterviewTextSize();
  // Explicit URL view params win over remembered settings from this browser tab.
  const [initialView] = useState(getInterviewViewState);
  const [filter, setFilter] = useState<InterviewFilterState>(initialView.filter);
  const [recallMode, setRecallMode] = useState<RecallMode>(initialView.recallMode);
  const [pageSize, setPageSize] = useState<number | "all">(initialView.pageSize);
  const [currentPage, setCurrentPage] = useState<number>(initialView.currentPage);
  const [directQuestionId, setDirectQuestionId] = useState<string | null>(() => getUrlParams().get("questionId"));

  const listTopRef = useRef<HTMLDivElement>(null);

  // Browser Back/Forward can update the URL without remounting this component.
  useEffect(() => {
    const restoreFromHistory = () => {
      const next = getInterviewViewState();
      setFilter(next.filter);
      setCurrentPage(next.currentPage);
      setPageSize(next.pageSize);
      setRecallMode(next.recallMode);
      setDirectQuestionId(getUrlParams().get("questionId"));
    };
    window.addEventListener("popstate", restoreFromHistory);
    return () => window.removeEventListener("popstate", restoreFromHistory);
  }, []);

  const leaveDirectQuestion = () => {
    if (!directQuestionId) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("questionId");
    window.history.pushState(window.history.state, "", url.pathname + url.search + url.hash);
    setDirectQuestionId(null);
  };

  const handleFilterChange = (next: InterviewFilterState) => {
    leaveDirectQuestion();
    setFilter(next);
    setCurrentPage(1);
  };

  // Synchronize URL search params with filter, pagination, and recall mode (debounced 250ms)
  useEffect(() => {
    // Persist immediately, before the debounced URL update or a quick navigation away.
    saveInterviewViewState({ filter, currentPage, pageSize, recallMode });
    const timer = setTimeout(() => {
      updateUrlParams({
        q: null, // drop legacy search alias
        search: filter.search || null,
        category: filter.category !== "all" ? filter.category : null,
        difficulty: filter.difficulty !== "all" ? filter.difficulty : null,
        status: filter.status !== "all" ? filter.status : null,
        company: filter.company !== "all" ? filter.company : null,
        page: currentPage > 1 ? currentPage : null,
        size: pageSize !== 15 ? pageSize : null,
        recall: recallMode !== "summaries" ? recallMode : null,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [filter, currentPage, pageSize, recallMode]);

  // Reader Mode by default, Editor Mode on demand (?edit=true or Ctrl+Shift+E)
  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("edit") === "true" || urlParams.get("mode") === "editor") {
      try {
        localStorage.setItem("interview_edit_mode", "true");
      } catch {}
      return true;
    }
    try {
      return localStorage.getItem("interview_edit_mode") === "true";
    } catch {
      return false;
    }
  });

  // Synchronize URL search params with Edit Mode state
  const syncEditUrl = (enable: boolean) => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      if (enable) {
        url.searchParams.set("edit", "true");
      } else {
        url.searchParams.delete("edit");
        url.searchParams.delete("mode");
      }
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : "") + url.hash);
    } catch {}
  };

  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [presentationStartIndex, setPresentationStartIndex] = useState(0);

  // Sync URL on initial mount if already in edit mode
  useEffect(() => {
    if (isEditMode && canEdit) syncEditUrl(true);
    else if (!accountLoading && !canEdit) syncEditUrl(false);
  }, [isEditMode, canEdit, accountLoading]);
  // URL and localStorage merely store UI preferences; they never grant admin rights.
  const activeEditMode = canEdit && isEditMode;

  // Shortcut Ctrl + Shift + E to toggle edit mode, and P to toggle presentation mode
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (canEdit && e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) {
        e.preventDefault();
        setIsEditMode((prev) => {
          const next = !prev;
          try {
            if (next) {
              localStorage.setItem("interview_edit_mode", "true");
            } else {
              localStorage.removeItem("interview_edit_mode");
            }
          } catch {}
          syncEditUrl(next);
          return next;
        });
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        setIsPresentationOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canEdit]);

  const handleToggleEditMode = () => {
    if (!canEdit) return;
    setIsEditMode((prev) => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem("interview_edit_mode", "true");
        } else {
          localStorage.removeItem("interview_edit_mode");
        }
      } catch {}
      syncEditUrl(next);
      return next;
    });
  };

  // Draft management hook (Offline-first localStorage)
  const {
    drafts,
    publishedCache,
    saveDraft,
    removeDraft,
    markDeleted,
    clearAllDrafts,
    commitDraftsToPublished,
    hydrated: draftsHydrated,
    publishedConflicts,
  } = useInterviewDrafts(initialQuestions);

  const [restoredEditingId] = useState(() => {
    if (typeof window === "undefined") return null;
    try { return sessionStorage.getItem("interview_editing_id") || getUrlParams().get("editQuestion"); }
    catch { return getUrlParams().get("editQuestion"); }
  });

  const [editingQuestion, setEditingQuestion] = useState<InterviewQuestion | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const editingId = sessionStorage.getItem("interview_editing_id") || getUrlParams().get("editQuestion");
      if (!editingId) return null;
      const canonical = initialQuestions.find((q) => q.id === editingId);
      if (canonical) return canonical;
      // An unsaved new question has no canonical row yet; allow the recovery prompt to open.
      return sessionStorage.getItem(`interview_draft_${editingId}`) ? {
        id: editingId, title: "Câu hỏi chưa lưu", category: "java-core", difficulty: "junior", summary: "", answerMarkdown: "", tags: [],
      } : null;
    } catch { return null; }
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isEdit = urlParams.get("edit") === "true" || localStorage.getItem("interview_edit_mode") === "true";
      if (!isEdit) return false;
      const editingId = sessionStorage.getItem("interview_editing_id") || urlParams.get("editQuestion");
      return Boolean(editingId);
    } catch { return false; }
  });

  // Merge canonical initialQuestions with user drafts and published cache
  const mergedQuestions = useMemo(() => {
    // Saved drafts and unpublished cache must never alter what ordinary learners
    // see, even when another account previously used the same browser.
    // Preserve all local drafts without deleting them.
    if (!canEdit) return initialQuestions;
    return mergeQuestionsWithDrafts(initialQuestions, drafts, publishedCache);
  }, [initialQuestions, drafts, publishedCache, canEdit]);

  const effectiveEditingId = editingQuestion?.id ?? restoredEditingId;
  const effectiveEditingQuestion = draftsHydrated ? mergedQuestions.find(q => q.id === effectiveEditingId) ??
    (effectiveEditingId && !isRetiredInterviewId(effectiveEditingId) && !drafts[effectiveEditingId]?.isDeleted && !publishedCache[effectiveEditingId]?.question.isDeleted ? editingQuestion : null) : null;

  const canonicalQuestion = useMemo(() => {
    return initialQuestions.find((q) => q.id === effectiveEditingId);
  }, [initialQuestions, effectiveEditingId]);

  const {
    state: progress,
    hydrated,
    canTrackProgress,
    storageError,
    isLearned,
    isReview,
    isBookmarked,
    toggleLearned,
    toggleReview,
    toggleBookmark,
  } = useInterviewProgress();

  const canMarkProgress = !accountLoading && Boolean(user) && canTrackProgress;

  // Restore scroll position after progress is hydrated
  useScrollRestoration("interview_list_scroll", hydrated);

  const handleOpenEdit = (q: InterviewQuestion) => {
    setEditingQuestion(q);
    setIsEditModalOpen(true);
    try {
      sessionStorage.setItem("interview_editing_id", q.id);
      updateUrlParams({ editQuestion: q.id });
    } catch {}
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setEditingQuestion(null);
    try {
      sessionStorage.removeItem("interview_editing_id");
      updateUrlParams({ editQuestion: null });
    } catch {}
  };



  // Filter questions dynamically
  const filteredQuestions = useMemo(() => {
    return filterInterviewQuestions(mergedQuestions, filter, progress);
  }, [mergedQuestions, filter, progress]);

  // The URL target takes priority over persisted filters, without mutating them.
  const directQuestion = directQuestionId
    ? mergedQuestions.find((q) => q.id === directQuestionId)
    : undefined;
  const visibleQuestions = directQuestionId
    ? (directQuestion ? [directQuestion] : [])
    : filteredQuestions;

  const totalPages = pageSize === "all" ? 1 : Math.max(1, Math.ceil(visibleQuestions.length / Number(pageSize)));
  const safeCurrentPage = directQuestionId ? 1 : Math.min(currentPage, totalPages);

  const pagedQuestions = useMemo(() => {
    if (pageSize === "all") return visibleQuestions;
    const size = Number(pageSize);
    const start = (safeCurrentPage - 1) * size;
    return visibleQuestions.slice(start, start + size);
  }, [visibleQuestions, safeCurrentPage, pageSize]);

  // The target must exist in the mounted page before scrolling.
  useEffect(() => {
    if (!directQuestionId || !directQuestion || !hydrated) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`question-${directQuestionId}`)?.scrollIntoView?.({
        behavior: "smooth", block: "center",
      });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [directQuestionId, directQuestion, hydrated]);

  const handlePageChange = (newPage: number) => {
    const page = Math.max(1, Math.min(totalPages, newPage));
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleResetFilter = () => {
    leaveDirectQuestion();
    clearInterviewViewState();
    setFilter(DEFAULT_INTERVIEW_FILTER);
    setCurrentPage(1);
    // Also clear stale URL filters before navigation can interrupt the debounce.
    updateUrlParams({
      q: null, search: null, category: null, difficulty: null,
      status: null, company: null, page: null,
    });
  };

  const handleSelectStatusFilter = (status: InterviewFilterState["status"]) => {
    handleFilterChange({ ...filter, status });
  };

  const handleJumpToQuestion = (id: string) => {
    // Keep edit=true and existing filters, and make this selection navigable via Back.
    const url = new URL(window.location.href);
    url.searchParams.set("questionId", id);
    window.history.pushState(window.history.state, "", url.pathname + url.search + url.hash);
    setDirectQuestionId(id);
  };

  return (
    <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-[1720px] space-y-8 lg:space-y-10 animate-fade-in">
      {/* 1. Header Banner */}
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" dot>
              Java Interview Hub
            </Badge>
            <span className="text-sm font-medium text-[var(--muted)]">
              {initialQuestions.length} câu hỏi chọn lọc · Cập nhật phỏng vấn 2026
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <img
              src="/brand-logo.png"
              alt="Logo Java"
              className="size-10 sm:size-12 rounded-2xl object-cover shadow-lg shadow-indigo-500/20 ring-1 ring-[var(--border)] shrink-0"
            />
            <h1 className="text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl xl:text-5xl">
              Bộ Câu Hỏi Phỏng Vấn Java
            </h1>
          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Tổng hợp câu hỏi phỏng vấn thực tế từ các công ty công nghệ hàng đầu (FPT, Viettel, VNG, VNPay, Shopee, Techcombank).
            Ôn luyện từ nền tảng <strong>Java Core, Concurrency, JVM</strong> đến <strong>Spring Boot & Database</strong>.
          </p>
        </div>

        {/* Action buttons: Presentation, Add question (only in Edit mode) & switch to LeetCode practice */}
        <div className="flex flex-wrap items-center gap-2.5 self-start">
          {/* Compact fallback when the sticky right rail is hidden. */}
          <div className="2xl:hidden">
            <InterviewTextSizeControl value={textScale} onChange={changeTextScale} />
          </div>
          <button
            type="button"
            onClick={() => {
              setPresentationStartIndex(0);
              setIsPresentationOpen(true);
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-indigo-500/40 bg-indigo-500/10 px-4 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 shadow-xs transition-all hover:bg-indigo-500/20 active:scale-95 cursor-pointer"
            title="Mở chế độ trình chiếu (Phím P)"
          >
            <Presentation className="h-4 w-4" />
            <span>Trình chiếu (P)</span>
          </button>

          {canEdit && !activeEditMode && (
            <button type="button" onClick={handleToggleEditMode}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-indigo-500/40 bg-indigo-500/10 px-4 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              <Edit3 className="h-4 w-4" /> Vào chế độ biên tập
            </button>
          )}
          {activeEditMode ? (
            <>
              <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                <Edit3 className="h-4 w-4" />
                <span>Chế độ Biên tập</span>
                <button
                  type="button"
                  onClick={handleToggleEditMode}
                  className="ml-1 rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] font-bold hover:bg-indigo-500/30 transition-colors cursor-pointer text-indigo-700 dark:text-indigo-300"
                  title="Thoát chế độ biên tập và quay lại chế độ đọc"
                >
                  Thoát
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `q-${Date.now().toString().slice(-4)}`;
                  const newQ: InterviewQuestion = {
                    id: newId,
                    title: "[Mới] Tiêu đề câu hỏi phỏng vấn của bạn...",
                    category: "java-core",
                    difficulty: "junior",
                    tags: ["Java", "Interview"],
                    summary: "",
                    answerMarkdown: "### Trả lời chi tiết:\n\n",
                  };
                  handleOpenEdit(newQ);
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm câu hỏi</span>
              </button>
            </>
          ) : null}

          <Link
            href="/problems"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 text-xs sm:text-sm font-bold text-[var(--foreground)] shadow-xs transition-all hover:bg-[var(--surface-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            <Code2 className="h-4 w-4 text-indigo-500" />
            <span>Luyện 150 Thuật toán</span>
          </Link>
        </div>
      </header>

      {!accountLoading && !canMarkProgress && (
        <div role="note" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
          <p className="text-[var(--muted-strong)]">Đăng nhập Google để đánh dấu đã hiểu, cần ôn lại hoặc lưu câu hỏi.</p>
          <button type="button" onClick={requestLogin} className="font-semibold text-[var(--primary-strong)] hover:underline">Đăng nhập Google</button>
        </div>
      )}
      {storageError && <div role="alert" className="rounded-xl border border-amber-500/40 p-3 text-sm text-amber-600">
        Trình duyệt chưa lưu được đánh dấu tiến độ. Hãy kiểm tra dung lượng/quyền lưu trữ và thử lại; thao tác này chưa được đồng bộ.
      </div>}
      {/* 2. Progress Overview Stats Card */}
      {canEdit && <PublishedConflictReview
        canonicalQuestions={initialQuestions}
        drafts={drafts}
        publishedCache={publishedCache}
        conflictingIds={publishedConflicts}
      />}
      <section aria-label="Thống kê tiến độ ôn luyện">
        <InterviewStatsCard
          questions={initialQuestions}
          progress={progress}
          hydrated={hydrated}
          canTrackProgress={canMarkProgress}
          activeStatusFilter={filter.status}
          onSelectStatusFilter={handleSelectStatusFilter}
        />
      </section>

      {canMarkProgress && <InterviewMergeRecovery progress={progress} drafts={drafts} publishedCache={publishedCache} />}



      {/* 3. Filter Controls */}
      <section aria-label="Bộ lọc câu hỏi">
        <InterviewFilterBar
          questions={initialQuestions}
          filter={filter}
          onFilterChange={handleFilterChange}
          onResetFilter={handleResetFilter}
        />
      </section>

      {/* 4. Main Two-Column Layout on 2xl+ screens */}
      <div className="2xl:grid 2xl:grid-cols-[1fr_360px] 2xl:gap-8 2xl:items-start">
        {/* Left Column: Questions List Toolbar, Cards, Pagination & Footer */}
        <div className="space-y-8 min-w-0">
          <section aria-label="Danh sách câu hỏi phỏng vấn" className="space-y-4">
            {/* Scroll anchor target */}
            <div ref={listTopRef} className="-mt-4 pt-4" />

            {/* Toolbar info & Bulk view controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1 text-xs text-[var(--muted)]">
              <div className="flex flex-wrap items-center gap-2 font-medium">
                <span>
                  Hiển thị{" "}
                  <strong>
                    {visibleQuestions.length === 0
                      ? 0
                      : pageSize === "all"
                      ? `1 - ${visibleQuestions.length}`
                      : `${(safeCurrentPage - 1) * Number(pageSize) + 1} - ${Math.min(
                          safeCurrentPage * Number(pageSize),
                          visibleQuestions.length
                        )}`}
                  </strong>{" "}
                  / {visibleQuestions.length} câu hỏi
                </span>

                {filter.status !== "all" && (
                  <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 font-bold text-indigo-600 dark:text-indigo-400">
                    Lọc: {filter.status}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Page Size Selector */}
                <div className="flex items-center gap-1.5">
                  <span>Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(e.target.value === "all" ? "all" : Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-2 py-1 text-xs font-semibold text-[var(--foreground)] cursor-pointer"
                    aria-label="Số câu hỏi mỗi trang"
                  >
                    <option value={15}>15 / trang</option>
                    <option value={30}>30 / trang</option>
                    <option value={50}>50 / trang</option>
                    <option value={100}>100 / trang</option>
                    <option value="all">Tất cả ({visibleQuestions.length})</option>
                  </select>
                </div>

                {/* Bulk View Mode Switcher: Tóm tắt & Đầy đủ */}
                {filteredQuestions.length > 0 && (
                  <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setRecallMode("summaries")}
                      title="Hiện tóm tắt cốt lõi của tất cả câu hỏi"
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        recallMode === "summaries"
                          ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Tóm tắt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecallMode("answers")}
                      title="Mở bung toàn bộ lời giải chi tiết"
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        recallMode === "answers"
                          ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Đầy đủ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {directQuestionId && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-3 text-sm">
                <span>
                  Đang mở liên kết câu hỏi <strong className="font-mono">{formatQuestionBadge(directQuestionId)}</strong>
                </span>
                <button type="button" onClick={leaveDirectQuestion} className="font-semibold text-indigo-600 hover:underline">
                  Quay lại danh sách
                </button>
              </div>
            )}

            {/* Cards or Empty State */}
            {!hydrated && (filter.status === "learned" || filter.status === "review" || filter.status === "bookmarked") ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-36 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 animate-pulse"
                  />
                ))}
              </div>
            ) : pagedQuestions.length > 0 ? (
              <div className="space-y-4">
                {pagedQuestions.map((question) => {
                  const isQuestionDraft = Boolean(drafts[question.id]);

                  return (
                    <InterviewQuestionCard
                      key={`${question.id}-${recallMode}`}
                      question={question}
                      textScale={textScale}
                      canMarkProgress={canMarkProgress}
                      isLearned={isLearned(question.id)}
                      isReview={isReview(question.id)}
                      isBookmarked={isBookmarked(question.id)}
                      isDraft={isQuestionDraft}
                      onEdit={
                        activeEditMode
                          ? () => handleOpenEdit(question)
                          : undefined
                      }
                      onDiscardDraft={
                        activeEditMode && isQuestionDraft
                          ? async () => {
                              const isConfirmed = await confirm({
                                title: "Hủy bản nháp?",
                                message: `Bạn có chắc muốn hủy bỏ các chỉnh sửa nháp của câu hỏi "${question.title}"?`,
                                confirmText: "Hủy bản nháp",
                                cancelText: "Giữ lại",
                                variant: "warning",
                              });
                              if (isConfirmed) {
                                removeDraft(question.id);
                              }
                            }
                          : undefined
                      }
                      onToggleLearned={() => canMarkProgress ? toggleLearned(question.id) : requestLogin()}
                      onToggleReview={() => canMarkProgress ? toggleReview(question.id) : requestLogin()}
                      onToggleBookmark={() => canMarkProgress ? toggleBookmark(question.id) : requestLogin()}
                      defaultExpanded={recallMode === "answers"}
                      defaultShowSummary={true}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center sm:p-12">
                <HelpCircle className="mx-auto h-12 w-12 text-[var(--muted)]" />
                <h3 className="mt-4 text-base font-bold text-[var(--foreground)] sm:text-lg">
                  Không tìm thấy câu hỏi phù hợp
                </h3>
                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[var(--muted)]">
                  {directQuestionId
                    ? `Không tồn tại Question ID "${directQuestionId}". Không tự động chuyển đến một câu đã gộp khác.`
                    : "Không có câu hỏi nào khớp với từ khóa tìm kiếm hoặc các bộ lọc bạn đã chọn."}
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[var(--primary)]/90 transition-all cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Đặt lại toàn bộ bộ lọc</span>
                  </button>
                </div>
              </div>
            )}

            {/* 5. Pagination Bar */}
            {totalPages > 1 && pageSize !== "all" && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[var(--border)] text-xs">
                <div className="text-[var(--muted)] font-medium">
                  Trang <strong>{safeCurrentPage}</strong> / <strong>{totalPages}</strong> ({visibleQuestions.length} câu hỏi)
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-bold text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-hover)] transition-colors shadow-2xs cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Trước</span>
                  </button>

                  {/* Page Number Pills */}
                  <div className="flex items-center gap-1">
                    {getPageList(currentPage, totalPages).map((p, pIdx) =>
                      p === "..." ? (
                        <span
                          key={`ellipsis-${pIdx}`}
                          className="px-2 py-1 text-[var(--muted)] font-bold select-none"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${p}`}
                          type="button"
                          onClick={() => handlePageChange(p as number)}
                          className={`h-8 w-8 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            currentPage === p
                              ? "bg-[var(--primary)] text-white shadow-xs scale-105"
                              : "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-bold text-[var(--foreground)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface-hover)] transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Sau</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 5. Footer Info Box */}
          <aside className="rounded-3xl border border-[var(--border)] bg-gradient-to-r from-indigo-500/[0.04] via-transparent to-purple-500/[0.04] p-5 sm:p-6 text-xs text-[var(--muted)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
                <span className="font-semibold text-[var(--foreground)]">
                  {activeEditMode ? "Chế độ Biên tập đang bật" : "Phương pháp ôn tập gợi nhớ chủ động (Active Recall)"}
                </span>
              </div>
              <span>
                {activeEditMode ? (
                  <>
                    Bạn có thể sửa câu hỏi trực tiếp hoặc thêm câu mới, sau đó xuất bản 1 commit lên GitHub khi kết thúc buổi làm việc.
                  </>
                ) : (
                  <>
                    Hãy thử tự trả lời hoặc tóm tắt ý chính trước khi bấm <code className="rounded bg-[var(--surface-hover)] px-1.5 py-0.5 font-mono text-[var(--foreground)]">Xem chi tiết</code> để tối đa hóa hiệu quả ghi nhớ dài hạn khi đi phỏng vấn.
                  </>
                )}
              </span>
            </div>
          </aside>
        </div>

        {/* Right Sticky Rail (Visible on 2xl+ / 27" screens) */}
        <aside className="hidden 2xl:block sticky top-6 space-y-6">
          <InterviewRightRail
            textScale={textScale}
            onTextScaleChange={changeTextScale}
            questions={pagedQuestions}
            allQuestions={mergedQuestions}
            progress={progress}
            activeCategory={filter.category}
            onSelectCategory={(cat) =>
              handleFilterChange({ ...filter, category: cat as InterviewCategory | "all" })
            }
            onOpenPresentation={() => {
              setPresentationStartIndex(0);
              setIsPresentationOpen(true);
            }}
            onJumpToQuestion={handleJumpToQuestion}
          />
        </aside>
      </div>

      {/* 6. Interview Edit Modal (Only active in Edit Mode) */}
      {activeEditMode && draftsHydrated && (
        <InterviewEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          question={effectiveEditingQuestion}
          canonicalQuestion={canonicalQuestion}
          textScale={textScale}
          onTextScaleChange={changeTextScale}
          onSave={(updated, canonical) => {
            saveDraft(updated, canonical);
          }}
          onDelete={(q) => {
            markDeleted(q, canonicalQuestion);
          }}
        />
      )}

      {/* 7. Floating Bottom Publish Drawer (Only visible in Edit Mode) */}
      {activeEditMode && (
        <PublishDrawer
          drafts={drafts}
          publishedCache={publishedCache}
          canonicalQuestions={initialQuestions}
          onClearAll={clearAllDrafts}
          onPublishSuccess={(submitted) => commitDraftsToPublished(submitted, initialQuestions)}
        />
      )}

      {/* 8. Interview Presentation Modal (Projector & Auditorium Mode) */}
      <InterviewPresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        questions={visibleQuestions.length > 0 ? visibleQuestions : mergedQuestions}
        initialIndex={presentationStartIndex}
        isLearned={isLearned}
        isReview={isReview}
        isBookmarked={isBookmarked}
        onToggleLearned={(id) => canMarkProgress ? toggleLearned(id) : requestLogin()}
        onToggleReview={(id) => canMarkProgress ? toggleReview(id) : requestLogin()}
        onToggleBookmark={(id) => canMarkProgress ? toggleBookmark(id) : requestLogin()}
        canMarkProgress={canMarkProgress}
      />
    </div>
  );
}
