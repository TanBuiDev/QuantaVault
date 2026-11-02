"use client";

import type { RefObject } from "react";
import {
  Bold,
  Italic,
  Code,
  FileCode,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table,
} from "lucide-react";

export interface MarkdownEditorToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (val: string) => void;
  fontMode?: "sans" | "mono";
  onToggleFontMode?: () => void;
}

export function MarkdownEditorToolbar({
  textareaRef,
  value,
  onChange,
  fontMode = "sans",
  onToggleFontMode,
}: MarkdownEditorToolbarProps) {
  function insertFormatting(prefix: string, suffix = "", defaultText = "") {
    const el = textareaRef.current;
    if (!el) return;

    // Preserve exact scroll position so the editor never jumps to bottom
    const savedScrollTop = el.scrollTop;
    const savedScrollLeft = el.scrollLeft;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = value.slice(start, end);
    const contentToWrap = selected.length > 0 ? selected : defaultText;

    const before = value.slice(0, start);
    const after = value.slice(end);
    const newValue = `${before}${prefix}${contentToWrap}${suffix}${after}`;

    onChange(newValue);

    // Calculate updated cursor selection
    const cursorStart = start + prefix.length;
    const cursorEnd = cursorStart + contentToWrap.length;

    // Reposition cursor and restore exact scroll position without triggering parent scroll
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      const target = textareaRef.current;
      target.focus({ preventScroll: true });
      target.setSelectionRange(cursorStart, cursorEnd);
      target.scrollTop = savedScrollTop;
      target.scrollLeft = savedScrollLeft;
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border)] bg-[var(--surface-hover)]/60 px-3 py-1.5 text-xs">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => insertFormatting("**", "**", "in đậm")}
        title="In đậm (Ctrl+B)"
        className="rounded-lg p-1.5 text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      >
        <Bold className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => insertFormatting("*", "*", "in nghiêng")}
        title="In nghiêng (Ctrl+I)"
        className="rounded-lg p-1.5 text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      >
        <Italic className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => insertFormatting("`", "`", "code")}
        title="Code inline"
        className="rounded-lg p-1.5 text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      >
        <Code className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          insertFormatting(
            "\n```java\n",
            "\n```\n",
            "// Mã nguồn Java minh họa\npublic void example() {\n    // Implementation\n}"
          )
        }
        title="Khối code Java (Code block)"
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-[var(--surface)] transition-colors cursor-pointer"
      >
        <FileCode className="h-3.5 w-3.5" />
        <span>Java</span>
      </button>

      <div className="mx-1 h-3.5 w-px bg-[var(--border)]" />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => insertFormatting("\n### ", "\n", "Tiêu đề mục")}
        title="Tiêu đề mục (Heading 3)"
        className="rounded-lg p-1.5 text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => insertFormatting("\n- ", "\n", "Gạch đầu dòng")}
        title="Danh sách không thứ tự"
        className="rounded-lg p-1.5 text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => insertFormatting("\n1. ", "\n", "Bước thứ nhất")}
        title="Danh sách có đánh số"
        className="rounded-lg p-1.5 text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => insertFormatting("\n> ", "\n", "Ghi chú quan trọng khi phỏng vấn")}
        title="Trích dẫn / Ghi chú (Quote)"
        className="rounded-lg p-1.5 text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      >
        <Quote className="h-4 w-4" />
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() =>
          insertFormatting(
            "\n| Tiêu chí | Tiếp cận A | Tiếp cận B |\n|---|---|---|\n| Hiệu năng | Nhanh | Trung bình |\n| Bộ nhớ | O(1) | O(N) |\n",
            ""
          )
        }
        title="Chèn bảng so sánh"
        className="rounded-lg p-1.5 text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
      >
        <Table className="h-4 w-4" />
      </button>

      {onToggleFontMode && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggleFontMode}
          title={fontMode === "mono" ? "Đổi sang phông Sans (chữ chuẩn dễ đọc)" : "Đổi sang phông Mono (lập trình JetBrains Mono)"}
          className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-[var(--muted-strong)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors border border-[var(--border)] cursor-pointer"
        >
          <span>{fontMode === "mono" ? "Phông: Mono" : "Phông: Sans"}</span>
        </button>
      )}
    </div>
  );
}
