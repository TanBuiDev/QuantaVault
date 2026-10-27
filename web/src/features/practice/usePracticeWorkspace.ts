"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePracticeDraft } from "./usePracticeDraft";
import { usePracticeVersions } from "./usePracticeVersions";
import { usePracticeExecution } from "./usePracticeExecution";

import { generateStarterCode, parseCasesYaml, type CasesData } from "@/lib/cases";
import { useProgress } from "@/lib/progress/provider";


import type { PracticeTab, PracticeViewProps } from "./practiceTypes";
export function usePracticeWorkspace({ content, hints, previous, next, sectionName }: PracticeViewProps) {
  const router = useRouter();
  const { getProgress, updateProblem } = useProgress();
  const progress = getProgress(content.id);
  const [activeTab, setActiveTab] = useState<PracticeTab>(() => {
    if (typeof window === "undefined" || !window.sessionStorage) return "problem";
    const saved = window.sessionStorage.getItem(`active_tab_${content.id}`) as PracticeTab | null;
    if (saved && ["problem", "hints", "solution", "interview", "notes"].includes(saved)) {
      return saved;
    }
    return "problem";
  });
  // Bottom console state
  const [bottomTab, setBottomTab] = useState<"testcase" | "result">(() => {
    if (typeof window === "undefined" || !window.sessionStorage) return "testcase";
    const saved = window.sessionStorage.getItem(`bottom_tab_${content.id}`);
    if (saved === "result" || saved === "testcase") return saved;
    return "testcase";
  });
  const handleSetBottomTab = (tab: "testcase" | "result") => {
    setBottomTab(tab);
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(`bottom_tab_${content.id}`, tab);
    }
  };
  // Parse Cases YAML
  const casesData = useMemo<CasesData | null>(() => {
    return parseCasesYaml(content.casesYaml);
  }, [content.casesYaml]);

  // Starter skeleton code (LeetCode style empty template)
  const starterCode = useMemo<string>(() => {
    return generateStarterCode(casesData, content.javaSource);
  }, [casesData, content.javaSource]);

  const {
    layoutMode,
    userCode,
    wordWrap,
    isSettingsOpen,
    setIsSettingsOpen,
    settingsRef,
    handleToggleWordWrap,
    langMode,
    handleSetLangMode,
    handleSetLayoutMode,
    handleCodeChange
  } = usePracticeDraft(content.id, starterCode);
  const versions = usePracticeVersions(content, handleCodeChange);
  const {
    codeVersions,
    selectedVersionIdx,
    setSelectedVersionIdx,
    isCodeModalOpen,
    setIsCodeModalOpen,
    editingVersion,
    setEditingVersion,
    copyState,
    currentCodeItem,
    currentJavaSource,
    handleLoadSolutionToEditor,
    copyJavaSource,
    handleDeleteCodeVersion
  } = versions;
  const { isRunning, runResult, execute } = usePracticeExecution(content.id, userCode, updateProblem);
  const handleRunCode = () => {
    setBottomTab("result");
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(`bottom_tab_${content.id}`, "result");
    }
    return execute("run");
  };
  const handleSubmitCode = () => {
    setBottomTab("result");
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(`bottom_tab_${content.id}`, "result");
    }
    return execute("submit");
  };

  // Shortcut key: Alt+Left / Alt+Right for navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.altKey && e.key === "ArrowLeft" && previous) {
        e.preventDefault(); router.push(`/problems/${previous.id}`);
      } else if (e.altKey && e.key === "ArrowRight" && next) {
        e.preventDefault(); router.push(`/problems/${next.id}`);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previous, next, router]);

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


  return {
    content,
    hints,
    previous,
    next,
    sectionName,
    router,
    updateProblem,
    progress,
    activeTab,
    layoutMode,
    bottomTab,
    setBottomTab: handleSetBottomTab,
    casesData,
    starterCode,
    codeVersions,
    selectedVersionIdx,
    setSelectedVersionIdx,
    isCodeModalOpen,
    setIsCodeModalOpen,
    editingVersion,
    setEditingVersion,
    copyState,
    currentCodeItem,
    currentJavaSource,
    userCode,
    wordWrap,
    isSettingsOpen,
    setIsSettingsOpen,
    settingsRef,
    handleToggleWordWrap,
    langMode,
    handleSetLangMode,
    handleSetLayoutMode,
    handleCodeChange,
    handleLoadSolutionToEditor,
    copyJavaSource,
    handleDeleteCodeVersion,
    isRunning,
    runResult,
    handleRunCode,
    handleSubmitCode,
    isAddModalOpen,
    setIsAddModalOpen,
    media,
    problemMedia,
    solutionMedia,
    tabs,
    changeTab,
    approaches,
    setSelectedApproachId,
    activeApproach,
    currentSolutionMarkdown
  };
}
