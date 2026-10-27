"use client";

import React, { useEffect, useState, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  RotateCcw,
  Copy,
  Check,
  Code2,
  Play,
  Send,
  Loader2,
  Braces,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { formatJavaSource } from "@/lib/javaFormatter";

interface CodeEditorPanelProps {
  problemId: number;
  initialCode: string;
  code: string;
  onCodeChange: (newCode: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  wordWrap?: boolean;
}

export function CodeEditorPanel({
  initialCode,
  code,
  onCodeChange,
  onRun,
  onSubmit,
  isRunning,
  wordWrap = true,
}: CodeEditorPanelProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [isMaximized, setIsMaximized] = useState(false);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const onCodeChangeRef = useRef(onCodeChange);
  const { success, error, info } = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange;
  }, [onCodeChange]);

  // Detect dark mode from document root
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      setTheme(darkNow ? "vs-dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Update Monaco Editor options when wordWrap prop changes dynamically
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        wordWrap: wordWrap ? "on" : "off",
        wrappingIndent: "indent",
        wrappingStrategy: "advanced",
      });
    }
  }, [wordWrap]);

  // Maximize is a pure client-side workspace mode. Escape restores the normal split layout.
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => editorRef.current?.layout());
    if (!isMaximized) return () => window.cancelAnimationFrame(frame);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMaximized(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMaximized]);

  const handleFormatAndSave = () => {
    const currentCode = editorRef.current?.getValue() ?? code;
    const formattedCode = formatJavaSource(currentCode);
    onCodeChangeRef.current(formattedCode);
    success("Đã định dạng và lưu code");
    window.requestAnimationFrame(() => editorRef.current?.focus());
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.updateOptions({
      wordWrap: wordWrap ? "on" : "off",
      wrappingIndent: "indent",
      wrappingStrategy: "advanced",
    });

    // Register shortcuts: Ctrl+' Run, Ctrl+Enter Submit, Ctrl+S Format + Save.
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Quote, () => {
      onRun();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onSubmit();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const formattedCode = formatJavaSource(editor.getValue());
      onCodeChangeRef.current(formattedCode);
      success("Đã định dạng và lưu code");
    });
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: "Khôi phục mã nguồn ban đầu?",
      message: "Toàn bộ mã nguồn bạn đã chỉnh sửa trong Editor sẽ được hoàn tác về bản mẫu ban đầu.",
      confirmText: "Khôi phục",
      cancelText: "Hủy",
      variant: "warning",
    });

    if (ok) {
      onCodeChange(initialCode);
      info("Đã khôi phục mã nguồn ban đầu");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      success("Đã sao chép mã nguồn");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      error("Không thể sao chép");
    }
  };

  return (
    <div
      className={
        isMaximized
          ? "fixed inset-0 z-[100] flex h-dvh w-screen flex-col overflow-hidden bg-[var(--surface)]"
          : "flex h-full flex-col overflow-hidden bg-[var(--surface)]"
      }
      data-editor-maximized={isMaximized ? "true" : "false"}
    >
      {/* Editor Header Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-2 bg-[var(--surface)] text-xs">
        {/* Language selector & info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-[var(--foreground)]">
            <Code2 className="h-4 w-4 text-indigo-500" />
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-600 dark:text-indigo-400">Java</span>
          </div>
          <span className="text-[11px] text-[var(--muted)]">OpenJDK 15</span>
        </div>

        {/* Action Tools: Run, Submit, Format, Copy, Reset, Maximize */}
        <div className="flex items-center gap-1.5">
          {/* Run button (Icon only) */}
          <button
            type="button"
            onClick={onRun}
            disabled={isRunning}
            title="Chạy thử code (Ctrl + ')"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] transition hover:bg-[var(--border)] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
            ) : (
              <Play className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" />
            )}
          </button>

          {/* Submit button (Icon only) */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isRunning}
            title="Nộp bài chấm điểm (Ctrl + Enter)"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs transition hover:bg-emerald-500 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </button>

          <div className="mx-0.5 h-3.5 w-px bg-[var(--border)]" />

          {/* Format + Save button */}
          <button
            type="button"
            onClick={handleFormatAndSave}
            title="Định dạng và lưu code (Ctrl + S)"
            aria-label="Format and save code"
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] transition hover:bg-[var(--border)] active:scale-95 cursor-pointer"
          >
            <Braces className="h-3.5 w-3.5 text-indigo-500" />
            <span>Format</span>
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            title="Sao chép code"
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] transition hover:bg-[var(--border)] active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-[var(--muted)]" />}
            <span>{copied ? "Đã chép" : "Copy"}</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            title="Khôi phục code mẫu"
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] transition hover:bg-[var(--border)] active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[var(--muted)]" />
            <span>Reset</span>
          </button>

          <div className="mx-0.5 h-3.5 w-px bg-[var(--border)]" />

          {/* Maximize / restore button */}
          <button
            type="button"
            onClick={() => setIsMaximized((value) => !value)}
            title={isMaximized ? "Thu nhỏ Editor (Esc)" : "Phóng to Editor"}
            aria-label={isMaximized ? "Restore editor" : "Maximize editor"}
            aria-pressed={isMaximized}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)] active:scale-95 cursor-pointer"
          >
            {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language="java"
          theme={theme}
          value={code}
          onChange={(val) => onCodeChange(val || "")}
          onMount={handleEditorMount}
          options={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            padding: { top: 12, bottom: 12 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            renderLineHighlight: "all",
            smoothScrolling: true,
            wordWrap: wordWrap ? "on" : "off",
            wrappingIndent: "indent",
            wrappingStrategy: "advanced",
          }}
          loading={
            <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
              Đang khởi tạo Monaco Editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
