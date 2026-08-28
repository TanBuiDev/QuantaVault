"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Play, Send, Terminal, CheckCircle2, Columns, LayoutTemplate, ArrowRightLeft } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import type { ProblemContent } from "@/lib/content";
import { useProgress } from "@/lib/progress/provider";
import { parseCasesYaml, generateStarterCode, type CasesData } from "@/lib/cases";
import type { RunCodeResponse } from "@/app/api/run-code/route";

import { MarkdownContent } from "./MarkdownContent";
import { AddApproachModal } from "./AddApproachModal";
import { CodeVersionModal } from "./CodeVersionModal";
import { CodeEditorPanel } from "./CodeEditorPanel";
import { TestcasePanel } from "./TestcasePanel";
import { TestResultPanel } from "./TestResultPanel";
import type { CodeVersionItem } from "@/lib/content";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

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

type PracticeTab = "problem" | "hints" | "solution" | "interview" | "notes";

function difficultyVariant(difficulty: ProblemContent["difficulty"]) {
  if (difficulty === "Easy") return "success" as const;
  if (difficulty === "Medium") return "warning" as const;
  if (difficulty === "Hard") return "danger" as const;
  return "neutral" as const;
}

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

export function PracticeView({ content, hints, previous, next, sectionName }: PracticeViewProps) {
  const { getProgress, updateProblem } = useProgress();
  const progress = getProgress(content.id);
  const [activeTab, setActiveTab] = useState<PracticeTab>("problem");
  const [mounted, setMounted] = useState(false);
  const [localLangMode, setLocalLangMode] = useState<"bilingual" | "en" | "vi">("bilingual");
  const [layoutMode, setLayoutMode] = useState<"split" | "classic">("split");

  // Bottom console state
  const [bottomTab, setBottomTab] = useState<"testcase" | "result">("testcase");
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunCodeResponse | null>(null);

  // Parse Cases YAML
  const casesData = useMemo<CasesData | null>(() => {
    return parseCasesYaml(content.casesYaml);
  }, [content.casesYaml]);

  // Starter skeleton code (LeetCode style empty template)
  const starterCode = useMemo<string>(() => {
    return generateStarterCode(casesData, content.javaSource);
  }, [casesData, content.javaSource]);

  // Code Versions (Reference Solution)
  const codeVersions = content.codeVersions ?? (content.javaSource ? [{ id: "v1", name: "Version 1", source: content.javaSource, isCanonical: true, isDefault: true }] : []);
  const defaultVersionIdx = codeVersions.findIndex((v) => v.isDefault);
  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number>(defaultVersionIdx >= 0 ? defaultVersionIdx : 0);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [editingVersion, setEditingVersion] = useState<CodeVersionItem | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const currentCodeItem = codeVersions[selectedVersionIdx] ?? codeVersions[0];
  const currentJavaSource = currentCodeItem ? currentCodeItem.source : content.javaSource;

  // User Code in Editor (default to starterCode template)
  const [userCode, setUserCode] = useState<string>(starterCode);

  const { success, error: toastError, info, warning } = useToast();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
      try {
        const savedLang = localStorage.getItem("preferred_lang_mode");
        if (savedLang === "bilingual" || savedLang === "en" || savedLang === "vi") {
          setLocalLangMode(savedLang);
        }
        const savedLayout = localStorage.getItem("preferred_layout_mode");
        if (savedLayout === "split" || savedLayout === "classic") {
          setLayoutMode(savedLayout);
        }
        const savedCode = localStorage.getItem(`user_code_${content.id}`);
        if (savedCode) {
          setUserCode(savedCode);
        } else {
          setUserCode(starterCode);
        }
      } catch {
        // ignore
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [content.id, starterCode]);

  const langMode = mounted ? localLangMode : "bilingual";

  function handleSetLangMode(mode: "bilingual" | "en" | "vi") {
    setLocalLangMode(mode);
    try {
      localStorage.setItem("preferred_lang_mode", mode);
    } catch {
      // ignore
    }
  }

  function handleSetLayoutMode(mode: "split" | "classic") {
    setLayoutMode(mode);
    try {
      localStorage.setItem("preferred_layout_mode", mode);
    } catch {
      // ignore
    }
  }

  function handleCodeChange(newCode: string) {
    setUserCode(newCode);
    try {
      localStorage.setItem(`user_code_${content.id}`, newCode);
    } catch {
      // ignore
    }
  }

  const confirm = useConfirm();

  async function handleLoadSolutionToEditor() {
    if (currentJavaSource) {
      const ok = await confirm({
        title: "Đưa lời giải vào Editor?",
        message: "Mã nguồn hiện tại trong Code Editor của bạn sẽ được thay thế bằng mã nguồn lời giải tham khảo này.",
        confirmText: "Đồng ý thay thế",
        cancelText: "Hủy",
        variant: "warning",
      });
      if (ok) {
        handleCodeChange(currentJavaSource);
        success("Đã đưa lời giải tham khảo vào Code Editor!");
      }
    }
  }

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
    const ok = await confirm({
      title: "Xóa phiên bản code?",
      message: `Bạn có chắc chắn muốn xóa vĩnh viễn phiên bản "${version.name || version.id}" không?`,
      confirmText: "Xóa phiên bản",
      cancelText: "Hủy",
      variant: "danger",
    });
    if (!ok) {
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

  // Run Code logic (sample cases)
  async function handleRunCode() {
    if (isRunning) return;
    setIsRunning(true);
    setBottomTab("result");

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: userCode,
          language: "java",
          casesData,
          runAll: false,
        }),
      });

      const data: RunCodeResponse = await res.json();
      setRunResult(data);

      if (data.overallStatus === "ACCEPTED") {
        success("Kiểm thử mẫu: Tất cả testcase đều chính xác!", "Sample Passed");
      } else if (data.overallStatus === "COMPILE_ERROR") {
        toastError("Lỗi biên dịch mã nguồn Java", "Compile Error");
      } else {
        info("Một số testcase chưa chính xác", "Wrong Answer");
      }
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Lỗi kết nối khi chạy mã nguồn", "Lỗi");
    } finally {
      setIsRunning(false);
    }
  }

  // Submit Code logic (all cases)
  async function handleSubmitCode() {
    if (isRunning) return;
    setIsRunning(true);
    setBottomTab("result");

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: userCode,
          language: "java",
          casesData,
          runAll: true,
        }),
      });

      const data: RunCodeResponse = await res.json();
      setRunResult(data);

      if (data.overallStatus === "ACCEPTED") {
        updateProblem(content.id, { status: "solved" });
        success(`Xuất sắc! Bạn đã vượt qua ${data.passedCases}/${data.totalCases} testcases!`, "Accepted");
      } else if (data.overallStatus === "COMPILE_ERROR") {
        toastError("Mã nguồn bị lỗi biên dịch (Compile Error)", "Compile Error");
      } else if (data.overallStatus === "WRONG_ANSWER") {
        toastError(`Wrong Answer (${data.passedCases}/${data.totalCases} passed)`, "Chưa đạt");
      } else {
        toastError("Kiểm thử chưa hoàn tất", "Lỗi thực thi");
      }
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Lỗi kết nối khi nộp bài", "Lỗi");
    } finally {
      setIsRunning(false);
    }
  }

  // Shortcut key: Alt+Left / Alt+Right for navigation
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
    { id: "notes", label: "Notes" },
  ] as const;

  function changeTab(tab: PracticeTab) {
    setActiveTab(tab);
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(`active_tab_${content.id}`, tab);
    }
    if (tab === "solution" && hasSolution) {
      updateProblem(content.id, { solutionViewed: true });
    }
    if (tab === "interview" && hasInterview) {
      updateProblem(content.id, { interviewViewed: true });
    }
  }

  const approaches = content.approaches ?? [];
  const defaultApproach = approaches.find((a) => a.isDefault) ?? approaches[0];
  const [selectedApproachId, setSelectedApproachId] = useState<string>(defaultApproach?.id ?? "");
  const activeApproach = approaches.find((a) => a.id === selectedApproachId) ?? defaultApproach;
  const currentSolutionMarkdown = activeApproach ? activeApproach.solutionMarkdown : content.solutionMarkdown;

  // Study Content Node (shared between split and classic views)
  const renderStudyContent = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          items={tabs}
          value={activeTab}
          onValueChange={(val) => changeTab(val as PracticeTab)}
          ariaLabel="Practice content"
        />

        {/* Language Mode Selector: Bilingual | EN | VI */}
        <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-1 shadow-inner text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleSetLangMode("bilingual")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all ${
              langMode === "bilingual"
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            title="Hiển thị song ngữ Anh - Việt"
          >
            <svg className="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>Song ngữ</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetLangMode("en")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all ${
              langMode === "en"
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            title="Chỉ hiển thị đề Tiếng Anh"
          >
            <span className="rounded bg-indigo-500/10 px-1 py-0.2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">EN</span>
            <span>English</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetLangMode("vi")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all ${
              langMode === "vi"
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
            title="Chỉ hiển thị đề Tiếng Việt"
          >
            <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400">VI</span>
            <span>Tiếng Việt</span>
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6 lg:p-7">
          <div role="tabpanel" aria-label={`${activeTab} content`}>
            {activeTab === "problem" ? (
              <div className="space-y-6">
                {content.problemMarkdown ? (
                  <ProblemStatement
                    markdown={content.problemMarkdown}
                    media={problemMedia}
                    problemId={content.id}
                    languageMode={langMode}
                    badges={
                      <>
                        <Badge variant={difficultyVariant(content.difficulty)}>{content.difficulty}</Badge>
                        <Badge variant="info">{sectionName}</Badge>
                        {content.topics.map((topic) => (
                          <Badge key={topic}>{topic}</Badge>
                        ))}
                        {content.patterns?.map((pattern) => (
                          <Badge key={pattern} variant="primary">{pattern}</Badge>
                        ))}
                      </>
                    }
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
              <div className="space-y-6">
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

                {currentSolutionMarkdown ? (
                  <MarkdownContent markdown={currentSolutionMarkdown} languageMode={langMode} />
                ) : (
                  <EmptyState title="No solution explanation available" description="This problem does not have a detailed markdown solution guide yet." />
                )}

                <MediaGallery items={solutionMedia} problemId={content.id} />

                {/* Java Reference Solution Card with Versioning & Copy */}
                <section className="space-y-3 pt-2" aria-labelledby="java-solution-heading">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">Reference code</p>
                      <div className="mt-1 flex items-center gap-2">
                        <h2 id="java-solution-heading" className="text-lg font-bold text-[var(--foreground)]">
                          Java solution
                        </h2>
                        {codeVersions.length > 1 && currentCodeItem?.name ? (
                          <span
                            className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
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

                    <div className="flex flex-wrap items-center gap-2">
                      {currentJavaSource ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleLoadSolutionToEditor}
                          className="gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold"
                          title="Đưa mã nguồn tham khảo này vào Code Editor"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                          <span>Đưa vào Editor</span>
                        </Button>
                      ) : null}

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
                          {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy unavailable" : "Copy Java"}
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  {/* Versions Dots Pagination */}
                  {codeVersions.length > 1 ? (
                    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-4 py-2">
                      <button
                        type="button"
                        onClick={() => setSelectedVersionIdx((prev) => (prev > 0 ? prev - 1 : codeVersions.length - 1))}
                        className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
                        title="Phiên bản trước"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>

                      <div className="flex items-center gap-2">
                        {codeVersions.map((v, idx) => {
                          const isSelected = idx === selectedVersionIdx;
                          return (
                            <button
                              key={v.id || idx}
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
                        title="Phiên bản tiếp theo"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                  ) : null}

                  {currentJavaSource ? (
                    <pre className="max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--code-surface)] p-4 text-xs font-mono leading-6 text-[var(--code-foreground)]">
                      <code>{currentJavaSource}</code>
                    </pre>
                  ) : null}
                </section>
              </div>
            ) : null}

            {activeTab === "interview" ? (
              <div className="space-y-6">
                {content.interviewMarkdown ? (
                  <MarkdownContent markdown={content.interviewMarkdown} languageMode={langMode} />
                ) : (
                  <EmptyState title="No interview guide available" description="This problem does not have an interview walkthrough yet." />
                )}
              </div>
            ) : null}

            {activeTab === "notes" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor={`notes-${content.id}`} className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Ghi chú cá nhân (Tự động lưu)
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    Đã lưu
                  </span>
                </div>
                <textarea
                  id={`notes-${content.id}`}
                  rows={10}
                  value={progress?.notes ?? ""}
                  onChange={(event) => updateProblem(content.id, { notes: event.target.value })}
                  placeholder="Ghi chú lại thuật toán, bẫy testcase, độ phức tạp..."
                  className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-4 text-sm leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Problem #{content.id}</p>
            <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">
              {content.title}
            </h1>
          </div>

          {/* Quick controls: Layout switcher & LeetCode link & Status */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-1 text-xs">
              <button
                type="button"
                onClick={() => handleSetLayoutMode("split")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                  layoutMode === "split"
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
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                  layoutMode === "classic"
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
          </div>
        </div>
      </header>

      {/* Main Practice Container */}
      {layoutMode === "split" ? (
        <div className="h-[calc(100vh-130px)] min-h-[750px] lg:min-h-[820px] w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm">
          <Group orientation="horizontal" className="h-full w-full">
            {/* Left Panel: Study Content */}
            <Panel defaultSize={46} minSize={25} className="flex flex-col h-full overflow-hidden bg-[var(--surface)]">
              <div className="h-full overflow-y-auto p-4 sm:p-5">
                {renderStudyContent()}
              </div>
            </Panel>

            {/* Vertical Resize Separator */}
            <Separator className="w-1.5 bg-[var(--border)] hover:bg-indigo-500 active:bg-indigo-600 transition-colors cursor-col-resize flex items-center justify-center">
              <div className="h-8 w-0.5 rounded-full bg-[var(--muted)]/40" />
            </Separator>

            {/* Right Panel: Code Editor (Top) & Console (Bottom) */}
            <Panel defaultSize={54} minSize={30} className="flex flex-col h-full overflow-hidden">
              <Group orientation="vertical" className="h-full w-full">
                {/* Top: Monaco Editor (Adjusted ratio) */}
                <Panel defaultSize={67} minSize={30} className="h-full overflow-hidden">
                  <CodeEditorPanel
                    problemId={content.id}
                    initialCode={starterCode}
                    code={userCode}
                    onCodeChange={handleCodeChange}
                    onRun={handleRunCode}
                    onSubmit={handleSubmitCode}
                    isRunning={isRunning}
                  />
                </Panel>

                {/* Horizontal Resize Separator */}
                <Separator className="h-1.5 bg-[var(--border)] hover:bg-indigo-500 active:bg-indigo-600 transition-colors cursor-row-resize flex items-center justify-center">
                  <div className="h-0.5 w-8 rounded-full bg-[var(--muted)]/40" />
                </Separator>

                {/* Bottom: Testcase & Console Tabs */}
                <Panel defaultSize={33} minSize={18} className="flex flex-col h-full overflow-hidden bg-[var(--surface)]">
                  {/* Console Header Bar */}
                  <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-2 bg-[var(--surface)] text-xs">
                    {/* Console Tabs */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setBottomTab("testcase")}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${
                          bottomTab === "testcase"
                            ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-bold shadow-xs ring-1 ring-[var(--border)]"
                            : "text-[var(--muted)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        <Terminal className="h-3.5 w-3.5" />
                        <span>Testcase</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBottomTab("result")}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all ${
                          bottomTab === "result"
                            ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-bold shadow-xs ring-1 ring-[var(--border)]"
                            : "text-[var(--muted)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Test Result</span>
                        {runResult && (
                          <span
                            className={`h-2 w-2 rounded-full ${
                              runResult.overallStatus === "ACCEPTED" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Console Body */}
                  <div className="flex-1 overflow-hidden">
                    {bottomTab === "testcase" ? (
                      <TestcasePanel casesData={casesData} />
                    ) : (
                      <TestResultPanel result={runResult} isRunning={isRunning} casesData={casesData} />
                    )}
                  </div>
                </Panel>
              </Group>
            </Panel>
          </Group>
        </div>
      ) : (
        /* Classic View (Original 2-column layout) */
        <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(18rem,3fr)] xl:items-start">
          <section aria-label="Study content" className="min-w-0 space-y-4">
            {renderStudyContent()}
          </section>

          {/* Sidebar */}
          <aside aria-label="Problem information" className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <h2 className="text-sm font-bold text-[var(--foreground)]">Study Details</h2>
                <div className="mt-3 space-y-2 text-xs text-[var(--muted)]">
                  <div className="flex justify-between border-b border-[var(--border)] py-1.5">
                    <span>Patterns</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {content.patterns.join(", ") || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span>Topics</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {content.topics.join(", ") || "None"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <nav aria-label="Problem navigation" className="grid gap-2.5">
              {previous ? (
                <Link
                  href={`/problems/${previous.id}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold transition hover:bg-[var(--surface-hover)]"
                >
                  <span className="truncate">← #{previous.id} {previous.title}</span>
                  <span className="text-xs font-mono text-[var(--muted)]">Alt + ←</span>
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/problems/${next.id}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm font-semibold transition hover:bg-[var(--surface-hover)]"
                >
                  <span className="truncate">#{next.id} {next.title} →</span>
                  <span className="text-xs font-mono text-[var(--muted)]">Alt + →</span>
                </Link>
              ) : null}
            </nav>
          </aside>
        </div>
      )}

      <AddApproachModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        problemId={content.id}
        onSuccess={() => window.location.reload()}
      />

      <CodeVersionModal
        isOpen={isCodeModalOpen}
        onClose={() => {
          setIsCodeModalOpen(false);
          setEditingVersion(null);
        }}
        problemId={content.id}
        editingVersion={editingVersion}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}

function ProblemStatement({
  markdown,
  media,
  problemId,
  languageMode = "bilingual",
  badges,
}: {
  markdown: string;
  media: NonNullable<ProblemContent["media"]>;
  problemId: number;
  languageMode?: "bilingual" | "en" | "vi";
  badges?: React.ReactNode;
}) {
  const headingMatch = markdown.match(/^(#\s+[^\n]+(?:\r?\n|$))/);

  if (headingMatch && badges) {
    const titleText = headingMatch[0];
    const restMarkdown = markdown.slice(titleText.length).trimStart();
    const insertion = restMarkdown.search(/^##\s+(?:Constraints|Ràng buộc|Source|Nguồn)\b/im);

    return (
      <div className="space-y-4">
        <MarkdownContent markdown={titleText.trimEnd()} languageMode={languageMode} />
        <div className="flex flex-wrap items-center gap-2 -mt-1 pb-1">
          {badges}
        </div>
        {media.length === 0 ? (
          <MarkdownContent markdown={restMarkdown} languageMode={languageMode} />
        ) : insertion < 0 ? (
          <>
            <MarkdownContent markdown={restMarkdown} languageMode={languageMode} />
            <MediaGallery items={media} problemId={problemId} />
          </>
        ) : (
          <>
            <MarkdownContent markdown={restMarkdown.slice(0, insertion).trimEnd()} languageMode={languageMode} />
            <MediaGallery items={media} problemId={problemId} />
            <MarkdownContent markdown={restMarkdown.slice(insertion).trimStart()} languageMode={languageMode} />
          </>
        )}
      </div>
    );
  }

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
