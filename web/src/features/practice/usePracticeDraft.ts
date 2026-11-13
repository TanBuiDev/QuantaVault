"use client";

import { useState, useRef, useEffect } from "react";

/**
 * An unscoped legacy draft has no verifiable owner. Preserve it but never
 * silently load it for a new Google identity (or anonymous user).
 */
export function practiceDraftKey(problemId: number, userId?: string | null): string {
  return `quantavault-user-code-v2:${userId || "guest"}:${problemId}`;
}

export function usePracticeDraft(problemId: number, starterCode: string, userId?: string | null) {
  const scope = practiceDraftKey(problemId, userId);
  const [mounted, setMounted] = useState(false);
  const [loadedScope, setLoadedScope] = useState("");
  const [localLangMode, setLocalLangMode] = useState<"bilingual" | "en" | "vi">("bilingual");
  const [layoutMode, setLayoutMode] = useState<"split" | "classic">("split");
  const [savedCode, setSavedCode] = useState<string>(starterCode);
  const [legacyDraftAvailable, setLegacyDraftAvailable] = useState(false);
  const [draftStorageError, setDraftStorageError] = useState(false);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setIsSettingsOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSettingsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSettingsOpen]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
      try {
        const savedLang = localStorage.getItem("preferred_lang_mode");
        if (savedLang === "bilingual" || savedLang === "en" || savedLang === "vi") setLocalLangMode(savedLang);
        const savedLayout = localStorage.getItem("preferred_layout_mode");
        if (savedLayout === "split" || savedLayout === "classic") setLayoutMode(savedLayout);
        const savedWrap = localStorage.getItem("preferred_word_wrap");
        if (savedWrap !== null) setWordWrap(savedWrap === "true");

        const current = localStorage.getItem(scope);
        setSavedCode(current !== null ? current : starterCode);
        // Show the legacy migration offer only when the target scope has no draft.
        setLegacyDraftAvailable(current === null && localStorage.getItem(`user_code_${problemId}`) !== null);
        setDraftStorageError(false);
      } catch {
        setSavedCode(starterCode);
        setLegacyDraftAvailable(false);
        setDraftStorageError(true);
      } finally {
        setLoadedScope(scope);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [scope, problemId, starterCode]);

  const handleToggleWordWrap = () => {
    const next = !wordWrap;
    setWordWrap(next);
    try { localStorage.setItem("preferred_word_wrap", String(next)); }
    catch { setDraftStorageError(true); }
  };
  const langMode = mounted ? localLangMode : "bilingual";
  function handleSetLangMode(mode: "bilingual" | "en" | "vi") {
    setLocalLangMode(mode);
    try { localStorage.setItem("preferred_lang_mode", mode); }
    catch { setDraftStorageError(true); }
  }
  function handleSetLayoutMode(mode: "split" | "classic") {
    setLayoutMode(mode);
    try { localStorage.setItem("preferred_layout_mode", mode); }
    catch { setDraftStorageError(true); }
  }
  function handleCodeChange(newCode: string) {
    // Never write into the new account until its scoped draft has been loaded.
    if (loadedScope !== scope) return;
    setSavedCode(newCode);
    try {
      localStorage.setItem(scope, newCode);
      setDraftStorageError(false);
      setLegacyDraftAvailable(false);
    } catch {
      setDraftStorageError(true);
    }
  }
  function importLegacyDraft() {
    if (loadedScope !== scope) return;
    try {
      const legacy = localStorage.getItem(`user_code_${problemId}`);
      if (legacy === null) return;
      // Keep the original key as a backup, never delete or overwrite it.
      localStorage.setItem(scope, legacy);
      setSavedCode(legacy);
      setLegacyDraftAvailable(false);
      setDraftStorageError(false);
    } catch {
      setDraftStorageError(true);
    }
  }

  return {
    layoutMode,
    userCode: loadedScope === scope ? savedCode : starterCode,
    wordWrap,
    isSettingsOpen,
    setIsSettingsOpen,
    settingsRef,
    handleToggleWordWrap,
    langMode,
    handleSetLangMode,
    handleSetLayoutMode,
    handleCodeChange,
    legacyDraftAvailable: loadedScope === scope && legacyDraftAvailable,
    importLegacyDraft,
    draftStorageError,
  };
}
