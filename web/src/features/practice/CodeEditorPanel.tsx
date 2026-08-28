"use client";

import React, { useEffect, useState, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { RotateCcw, Copy, Check, Code2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

interface CodeEditorPanelProps {
  problemId: number;
  initialCode: string;
  code: string;
  onCodeChange: (newCode: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
}

export function CodeEditorPanel({
  problemId,
  initialCode,
  code,
  onCodeChange,
  onRun,
  onSubmit,
  isRunning,
}: CodeEditorPanelProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const editorRef = useRef<any>(null);
  const { success, error, info } = useToast();
  const confirm = useConfirm();

  // Detect dark mode from document root
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark") || true;
    setTheme(isDark ? "vs-dark" : "light");

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

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register shortcut: Ctrl+' to Run, Ctrl+Enter to Submit
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Quote, () => {
      onRun();
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onSubmit();
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
      success("Đã sao chép mã nguồn vào bộ nhớ tạm");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      error("Không thể sao chép mã nguồn");
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[var(--surface)]">
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

        {/* Action Tools */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            title="Sao chép code"
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] transition hover:bg-[var(--border)]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-[var(--muted)]" />}
            <span>{copied ? "Đã chép" : "Copy"}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Khôi phục code mẫu"
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] transition hover:bg-[var(--border)]"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[var(--muted)]" />
            <span>Reset</span>
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
