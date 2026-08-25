"use client";

import Link from "next/link";
import { useState, useEffect } from "react";


import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import type { ProblemContent } from "@/lib/content";
import { useProgress } from "@/lib/progress/provider";

import { MarkdownContent } from "./MarkdownContent";
import { AddApproachModal } from "./AddApproachModal";
import { CodeVersionModal } from "./CodeVersionModal";
import type { CodeVersionItem } from "@/lib/content";
import { useToast } from "@/components/ui/Toast";



export interface AdjacentProblemLink {
  id: number;
  title: string;
}

export interface PracticeViewProps {
  content: ProblemContent;
  hints: string[];
  previous: AdjacentProblemLink | null;
  next: AdjacentProblemLink | null;
  sectionName: string;
}

type PracticeTab = "problem" | "hints" | "solution" | "interview";

function difficultyVariant(difficulty: ProblemContent["difficulty"]) {
  if (difficulty === "Easy") return "success" as const;
  if (difficulty === "Medium") return "warning" as const;
  if (difficulty === "Hard") return "danger" as const;
  return "neutral" as const;
}


export function PracticeView({ content, hints, previous, next, sectionName }: PracticeViewProps) {
  const { getProgress, updateProblem } = useProgress();
  const progress = getProgress(content.id);
  const [activeTab, setActiveTab] = useState<PracticeTab>("problem");
  const [langMode, setLangMode] = useState<"bilingual" | "en" | "vi">(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("preferred_lang_mode");
        if (saved === "bilingual" || saved === "en" || saved === "vi") {
          return saved;
        }
      } catch {
        // ignore
      }
    }
    return "bilingual";
  });

  function handleSetLangMode(mode: "bilingual" | "en" | "vi") {
    setLangMode(mode);
    try {
      localStorage.setItem("preferred_lang_mode", mode);
    } catch {
      // ignore
    }
  }



  // Khôi phục tab & scroll position khi reload trang
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const savedTab = window.sessionStorage.getItem(`active_tab_${content.id}`);
        if (savedTab === "hints" || savedTab === "solution" || savedTab === "interview") {
          setActiveTab(savedTab as PracticeTab);
        }

        const savedScroll = window.sessionStorage.getItem(`scroll_pos_${content.id}`);
        if (savedScroll !== null) {
          const scrollY = parseInt(savedScroll, 10);
          if (!isNaN(scrollY) && scrollY > 0) {
            // Đợi layout và DOM render ổn định rồi scroll đến vị trí cũ
            requestAnimationFrame(() => {
              setTimeout(() => {
                window.scrollTo({ top: scrollY, behavior: "instant" });
              }, 50);
            });
          }
        }
      }
    } catch {
      // ignore
    }
  }, [content.id]);

  // Tự động lưu vị trí cuộn trang định kỳ hoặc khi người dùng cuộn
  useEffect(() => {
    function handleScroll() {
      try {
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.setItem(`scroll_pos_${content.id}`, String(window.scrollY));
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [content.id]);

  // Phím tắt điều hướng nhanh giữa các bài tập (Alt + Left / Alt + Right)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.altKey && e.key === "ArrowLeft" && previous) {
        window.location.href = `/problems/${previous.id}`;
      } else if (e.altKey && e.key === "ArrowRight" && next) {
        window.location.href = `/problems/${next.id}`;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previous, next]);



  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const hasHints = content.contentStatus.hints !== "none" && hints.length > 0;
  const hasSolution =
    content.contentStatus.solution !== "none" && Boolean(content.solutionMarkdown || content.javaSource);
  const hasInterview =
    content.contentStatus.interview !== "none" && Boolean(content.interviewMarkdown);
  const media = content.media ?? [];
  const problemMedia = media.filter((item) => item.scope === "problem");
  const solutionMedia = media.filter((item) => item.scope === "solution");

  const tabs = [
    { id: "problem", label: "Problem" },
    { id: "hints", label: "Hints", disabled: !hasHints },
    { id: "solution", label: "Solution", disabled: !hasSolution },
    { id: "interview", label: "Interview", disabled: !hasInterview },
  ] as const;

  function changeTab(value: string) {
    const tab = value as PracticeTab;
    setActiveTab(tab);

    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        if (tab === "problem") {
          window.sessionStorage.removeItem(`active_tab_${content.id}`);
        } else {
          window.sessionStorage.setItem(`active_tab_${content.id}`, tab);
        }
      }
    } catch {
      // ignore
    }

    if (tab === "interview" && hasInterview) {
      updateProblem(content.id, { interviewViewed: true });
    }
    if (tab === "solution" && hasSolution) {
      updateProblem(content.id, { solutionViewed: true });
    }
  }




  const approaches = content.approaches ?? [];
  const defaultApproach = approaches.find((a) => a.isDefault) ?? approaches[0];
  const [selectedApproachId, setSelectedApproachId] = useState<string>(defaultApproach?.id ?? "");

  const activeApproach = approaches.find((a) => a.id === selectedApproachId) ?? defaultApproach;
  const currentSolutionMarkdown = activeApproach ? activeApproach.solutionMarkdown : content.solutionMarkdown;

  // Quản lý các phiên bản code (Code Versions Carousel)
  const codeVersions = content.codeVersions ?? (content.javaSource ? [{ id: "v1", name: "Version 1", source: content.javaSource, isCanonical: true, isDefault: true }] : []);
  
  // Mặc định chọn version có cờ isDefault: true (hoặc version đầu tiên)
  const defaultVersionIdx = codeVersions.findIndex((v) => v.isDefault);
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number>(defaultVersionIdx >= 0 ? defaultVersionIdx : 0);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [editingVersion, setEditingVersion] = useState<CodeVersionItem | null>(null);

  const currentCodeItem = codeVersions[selectedVersionIdx] ?? codeVersions[0];
  const currentJavaSource = currentCodeItem ? currentCodeItem.source : content.javaSource;

  const { toast, success, error: toastError, warning } = useToast();

  async function copyJavaSource() {
    const sourceToCopy = currentJavaSource;
    if (!sourceToCopy) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(sourceToCopy);
      setCopyState("copied");
      success("Đã sao chép toàn bộ code Java vào clipboard!", "Sao chép thành công");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      toastError("Không thể truy cập clipboard của trình duyệt.", "Lỗi sao chép");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  async function handleDeleteCodeVersion(version: CodeVersionItem) {
    if (codeVersions.length <= 1) {
      warning("Không thể xóa phiên bản code duy nhất còn lại.", "Thao tác không hợp lệ");
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa "${version.name || version.id}" không?`)) {
      return;
    }
    try {
      const res = await fetch("/api/code-versions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: content.id, id: version.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        toastError(data.error || "Xóa phiên bản code thất bại.", "Lỗi");
        return;
      }
      success(`Đã xóa "${version.name || version.id}" thành công!`);
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch {
      toastError("Đã có lỗi xảy ra trong quá trình xóa.", "Lỗi mạng");
    }
  }





  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={difficultyVariant(content.difficulty)}>{content.difficulty}</Badge>
          <Badge variant="info">{sectionName}</Badge>
          {content.topics.slice(0, 4).map((topic) => (
            <Badge key={topic}>{topic}</Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Problem {content.id}</p>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Study the problem here, then write and submit your Java solution on LeetCode.
            </p>
          </div>
          <a
            href={content.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[var(--primary)] px-5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            Open on LeetCode <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4" aria-label="Learning status">
          <span className="mr-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Quick status</span>
          {([
            ["in-progress", "In progress"],
            ["solved", "Solved"],
            ["review", "Review"],
          ] as const).map(([status, label]) => (
            <Button
              key={status}
              size="sm"
              variant={progress?.status === status ? "primary" : "secondary"}
              aria-pressed={progress?.status === status}
              onClick={() => updateProblem(content.id, { status })}
            >
              {label}
            </Button>
          ))}
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(18rem,3fr)] xl:items-start">
        <section aria-label="Study content" className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              items={tabs}
              value={activeTab}
              onValueChange={changeTab}
              ariaLabel="Practice content"
            />

            {/* Language Mode Selector: Bilingual | EN | VI */}
            <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-1 shadow-inner text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleSetLangMode("bilingual")}
                className={`rounded-xl px-2.5 py-1.5 transition-all ${
                  langMode === "bilingual"
                    ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Hiển thị song ngữ Anh - Việt"
              >
                🌐 Song ngữ
              </button>
              <button
                type="button"
                onClick={() => handleSetLangMode("en")}
                className={`rounded-xl px-2.5 py-1.5 transition-all ${
                  langMode === "en"
                    ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Chỉ hiển thị đề Tiếng Anh"
              >
                🇺🇸 English
              </button>
              <button
                type="button"
                onClick={() => handleSetLangMode("vi")}
                className={`rounded-xl px-2.5 py-1.5 transition-all ${
                  langMode === "vi"
                    ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title="Chỉ hiển thị đề Tiếng Việt"
              >
                🇻🇳 Tiếng Việt
              </button>
            </div>
          </div>



          <Card>
            <CardContent className="p-5 sm:p-7 lg:p-8">
              <div role="tabpanel" aria-label={`${activeTab} content`}>
                {activeTab === "problem" ? (
                  <div className="space-y-6">
                    {content.problemMarkdown ? (
                      <ProblemStatement
                        markdown={content.problemMarkdown}
                        media={problemMedia}
                        problemId={content.id}
                        languageMode={langMode}
                      />
                    ) : (
                      <EmptyState
                        title="Full problem source is not available yet"
                        description="This canonical package currently has only limited source metadata. The web app will not fabricate a problem statement."
                      />
                    )}
                  </div>
                ) : null}

                {activeTab === "hints" ? (
                  <div className="space-y-5">
                    {hints.map((hint, index) => (
                      <section
                        key={`${content.id}-hint-${index + 1}`}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-4 sm:p-5"
                      >
                        <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
                          Hint {index + 1}
                        </div>
                        <MarkdownContent markdown={hint} languageMode={langMode} />
                      </section>
                    ))}
                  </div>
                ) : null}


                {activeTab === "solution" ? (
                  <div className="space-y-8">
                    {approaches.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-1.5 sm:p-2">
                        {approaches.map((app) => {
                          const isSelected = app.id === (activeApproach?.id ?? "");
                          return (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => setSelectedApproachId(app.id)}
                              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                                isSelected
                                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm ring-1 ring-[var(--border-strong)]"
                                  : "text-[var(--muted-strong)] hover:bg-[var(--surface)]/50 hover:text-[var(--foreground)]"
                              }`}
                            >
                              <span>{app.name}</span>
                              {app.tag ? (
                                <span
                                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    app.tag.toLowerCase() === "optimal"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : "bg-[var(--surface-hover)] text-[var(--muted)]"
                                  }`}
                                >
                                  {app.tag}
                                </span>
                              ) : null}
                              {app.timeComplexity ? (
                                <span className="text-[11px] text-[var(--muted)]">{app.timeComplexity}</span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}

                    {currentSolutionMarkdown ? <MarkdownContent markdown={currentSolutionMarkdown} languageMode={langMode} /> : null}
                    <MediaGallery items={solutionMedia} problemId={content.id} />
                    
                    <section className="space-y-3" aria-labelledby="java-solution-heading">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">Reference code</p>
                            <div className="mt-1 flex items-center gap-2">
                              <h2 id="java-solution-heading" className="text-lg font-bold text-[var(--foreground)]">
                                Java solution
                              </h2>
                              {codeVersions.length > 1 && currentCodeItem?.name ? (
                                <span
                                  className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                                    currentCodeItem.isDefault
                                      ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 ring-1 ring-indigo-500/30"
                                      : "bg-[var(--surface-hover)] text-[var(--muted-strong)]"
                                  }`}
                                >
                                  {currentCodeItem.name}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>



                        {/* Actions: Thêm mới, Chỉnh sửa, Xóa, Copy */}
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setEditingVersion(null);
                              setIsCodeModalOpen(true);
                            }}
                            className="gap-1.5"
                            title="Thêm một phiên bản code Java mới"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Thêm code</span>
                          </Button>

                          {currentCodeItem ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setEditingVersion(currentCodeItem);
                                setIsCodeModalOpen(true);
                              }}
                              className="gap-1.5"
                              title="Chỉnh sửa phiên bản code này"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                              </svg>
                              <span>Sửa code</span>
                            </Button>
                          ) : null}

                          {currentCodeItem && codeVersions.length > 1 ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDeleteCodeVersion(currentCodeItem)}
                              className="text-red-500 hover:bg-red-500/10 hover:text-red-600 gap-1.5"
                              title="Xóa phiên bản code này"
                            >
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                              <span>Xóa</span>
                            </Button>
                          ) : null}

                          {currentJavaSource ? (
                            <Button size="sm" variant="secondary" onClick={copyJavaSource}>
                              {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy unavailable" : "Copy Java solution"}
                            </Button>
                          ) : null}
                        </div>
                      </div>


                      {/* Dots pagination ở trên chính giữa khối code khi có từ 2 phiên bản code trở lên */}
                      {codeVersions.length > 1 ? (
                        <div className="flex items-center justify-center gap-2 py-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedVersionIdx((prev) => (prev > 0 ? prev - 1 : codeVersions.length - 1))}
                            className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
                            title="Phiên bản trước (←)"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                          </button>

                          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 shadow-sm">
                            {codeVersions.map((v, idx) => {
                              const isSelected = idx === selectedVersionIdx;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => setSelectedVersionIdx(idx)}
                                  title={v.name || `Version ${idx + 1}`}
                                  className={`group relative flex items-center justify-center transition-all ${
                                    isSelected ? "scale-110" : "hover:scale-105"
                                  }`}
                                >
                                  <span
                                    className={`block rounded-full transition-all ${
                                      isSelected
                                        ? "h-2.5 w-6 bg-[var(--primary-strong)] ring-2 ring-[var(--primary)]/20"
                                        : "h-2 w-2 bg-[var(--muted)]/50 group-hover:bg-[var(--muted-strong)]"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedVersionIdx((prev) => (prev < codeVersions.length - 1 ? prev + 1 : 0))}
                            className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
                            title="Phiên bản tiếp theo (→)"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </button>
                        </div>
                      ) : null}

                      {currentJavaSource ? (
                        <pre className="max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--code-surface)] p-4 text-sm leading-6 text-[var(--code-foreground)]">
                          <code>{currentJavaSource}</code>
                        </pre>
                      ) : null}
                    </section>

                  </div>
                ) : null}




                {activeTab === "interview" && content.interviewMarkdown ? (
                  <MarkdownContent markdown={content.interviewMarkdown} languageMode={langMode} />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside aria-label="Study progress" className="space-y-4 xl:sticky xl:top-6">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">Your study data</p>
                  <h2 className="mt-1 text-lg font-bold text-[var(--foreground)]">Progress & notes</h2>
                </div>
                <Button
                  size="sm"
                  variant={progress?.bookmarked ? "primary" : "secondary"}
                  aria-pressed={Boolean(progress?.bookmarked)}
                  onClick={() => updateProblem(content.id, { bookmarked: !progress?.bookmarked })}
                >
                  {progress?.bookmarked ? "★ Saved" : "Bookmark"}
                </Button>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Confidence / Độ tự tin</span>
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    {progress?.confidence ? `${progress.confidence} / 5 sao` : "Chưa đánh giá"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 py-1" role="group" aria-label="5 Star Rating">
                    {([1, 2, 3, 4, 5] as const).map((star) => {
                      const isFilled = (progress?.confidence ?? 0) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          aria-label={`Rate ${star} star`}
                          onClick={() => {
                            const newRating = progress?.confidence === star ? null : star;
                            updateProblem(content.id, { confidence: newRating });
                          }}
                          title={`Đánh giá ${star} sao`}
                          className="group p-1 text-2xl transition-transform hover:scale-125 active:scale-95 focus-visible:outline-none"
                        >
                          <span
                            className={
                              isFilled
                                ? "text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                                : "text-[var(--border-strong)] group-hover:text-amber-300"
                            }
                          >
                            ★
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <select
                    aria-label="Confidence"
                    value={progress?.confidence ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      updateProblem(content.id, {
                        confidence: value === "" ? null : (Number(value) as 1 | 2 | 3 | 4 | 5),
                      });
                    }}
                    className="h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-semibold text-[var(--foreground)] outline-none focus:border-[var(--focus)]"
                  >
                    <option value="">Chưa rate</option>
                    <option value="1">1 sao</option>
                    <option value="2">2 sao</option>
                    <option value="3">3 sao</option>
                    <option value="4">4 sao</option>
                    <option value="5">5 sao</option>
                  </select>
                </div>
              </div>


              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={`notes-${content.id}`} className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] cursor-pointer">
                    Personal notes
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Tự động lưu
                  </span>
                </div>
                <textarea
                  id={`notes-${content.id}`}
                  aria-label="Personal notes"
                  rows={7}
                  value={progress?.notes ?? ""}
                  onChange={(event) => updateProblem(content.id, { notes: event.target.value })}
                  placeholder="Lưu lại điểm cần lưu ý, mẹo tối ưu, lỗi sai hay gặp..."
                  className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-3.5 text-sm leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 transition-all"
                />
              </div>
            </CardContent>
          </Card>

          <nav aria-label="Problem navigation" className="grid gap-2.5">
            {previous ? (
              <Link
                href={`/problems/${previous.id}`}
                aria-label={`Previous · ${previous.title}`}
                className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:-translate-y-0.5 shadow-2xs"
              >
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Previous</span>
                  <span className="mt-0.5 block truncate font-semibold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)]">
                    Previous · #{previous.id} {previous.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--muted)] shrink-0">Alt + ←</span>
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/problems/${next.id}`}
                aria-label={`Next · ${next.title}`}
                className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:-translate-y-0.5 shadow-2xs"
              >
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Next</span>
                  <span className="mt-0.5 block truncate font-semibold text-sm text-[var(--foreground)] group-hover:text-[var(--primary)]">
                    Next · #{next.id} {next.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--muted)] shrink-0">Alt + →</span>
              </Link>
            ) : null}
          </nav>
        </aside>
      </div>



      <AddApproachModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        problemId={content.id}
        onSuccess={() => {
          window.location.reload();
        }}
      />

      <CodeVersionModal
        isOpen={isCodeModalOpen}
        onClose={() => {
          setIsCodeModalOpen(false);
          setEditingVersion(null);
        }}
        problemId={content.id}
        editingVersion={editingVersion}
        onSuccess={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}



function ProblemStatement({
  markdown,
  media,
  problemId,
  languageMode = "bilingual",
}: {
  markdown: string;
  media: NonNullable<ProblemContent["media"]>;
  problemId: number;
  languageMode?: "bilingual" | "en" | "vi";
}) {
  if (media.length === 0) return <MarkdownContent markdown={markdown} languageMode={languageMode} />;
  const insertion = markdown.search(/^##\s+(?:Constraints|Ràng buộc|Source|Nguồn)\b/im);
  if (insertion < 0) {
    return (
      <>
        <MarkdownContent markdown={markdown} languageMode={languageMode} />
        <MediaGallery items={media} problemId={problemId} />
      </>
    );
  }
  return (
    <>
      <MarkdownContent markdown={markdown.slice(0, insertion).trimEnd()} languageMode={languageMode} />
      <MediaGallery items={media} problemId={problemId} />
      <MarkdownContent markdown={markdown.slice(insertion).trimStart()} languageMode={languageMode} />
    </>
  );
}

function MediaGallery({ items, problemId }: { items: NonNullable<ProblemContent["media"]>; problemId: number }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4" aria-label="Illustrations">
      {items.map((item) => (
        <figure key={item.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]">
          <img src={`/media/${problemId}/${encodeURIComponent(item.path.split("/").pop() ?? "")}`} alt={item.altEn} loading="lazy" className="mx-auto max-h-[32rem] w-auto max-w-full object-contain" />
          <figcaption className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)]">{item.altVi}</figcaption>
        </figure>
      ))}
    </div>
  );
}

