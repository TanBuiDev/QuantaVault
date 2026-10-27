"use client";
import { useState, useRef, useEffect } from "react";
export function usePracticeDraft(problemId: number, starterCode: string) {
  const [mounted, setMounted] = useState(false);
  const [localLangMode, setLocalLangMode] = useState<"bilingual" | "en" | "vi">("bilingual");
  const [layoutMode, setLayoutMode] = useState<"split" | "classic">("split");

  // User Code in Editor (default to starterCode template)
  const [userCode, setUserCode] = useState<string>(starterCode);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const settingsRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
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
        if (savedLang === "bilingual" || savedLang === "en" || savedLang === "vi") {
          setLocalLangMode(savedLang);
        }
        const savedLayout = localStorage.getItem("preferred_layout_mode");
        if (savedLayout === "split" || savedLayout === "classic") {
          setLayoutMode(savedLayout);
        }
        const savedWrap = localStorage.getItem("preferred_word_wrap");
        if (savedWrap !== null) {
          setWordWrap(savedWrap === "true");
        }
        const savedCode = localStorage.getItem(`user_code_${problemId}`);
        if (savedCode !== null) {
          setUserCode(savedCode);
        } else {
          setUserCode(starterCode);
        }
      } catch {
        // ignore
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [problemId, starterCode]);

  const handleToggleWordWrap = () => {
    setWordWrap((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("preferred_word_wrap", String(next));
      } catch { }
      return next;
    });
  };

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
      localStorage.setItem(`user_code_${problemId}`, newCode);
    } catch {
      // ignore
    }
  }

  return {
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
  };
}
