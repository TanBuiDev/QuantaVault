/**
 * Pure Markdown formatting operations used by both the editor toolbar and keyboard shortcuts.
 * This file deliberately never touches stored interview questions or user drafts.
 */
export interface MarkdownEdit {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export type InlineStyle = "bold" | "italic";

type Formatting =
  | { kind: InlineStyle; defaultText: string }
  | { prefix: string; suffix: string; defaultText: string };

function unchanged(value: string, start: number, end: number): MarkdownEdit {
  return { value, selectionStart: start, selectionEnd: end };
}

function withinCodeFence(value: string, start: number, end: number): boolean {
  const fence = String.fromCharCode(96).repeat(3);
  const before = value.slice(0, start).split("\n");
  const opened = before.filter((line) => line.trimStart().startsWith(fence)).length % 2 === 1;
  const includesFence = value.slice(start, end).split("\n").some((line) => line.trimStart().startsWith(fence));
  return opened || includesFence;
}

/**
 * Return an existing, single-line, delimited span that contains the current selection.
 * Triple-asterisk spans are considered first so toggling bold inside ***text***
 * preserves italic (and vice versa).
 */
function containingStyle(
  value: string,
  start: number,
  end: number,
  kind: InlineStyle
): { from: number; to: number; count: number } | null {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineBreak = value.indexOf("\n", end);
  const lineEnd = lineBreak === -1 ? value.length : lineBreak;
  const line = value.slice(lineStart, lineEnd);
  const patterns = kind === "bold"
    ? [
        { pattern: /(?<![\\*])\*{3}([^*\n]+)\*{3}(?!\*)/g, width: 3, count: 2 },
        { pattern: /(?<![\\*])\*{2}(?!\*)([^\n]+?)\*{2}(?!\*)/g, width: 2, count: 2 }
      ]
    : [
        { pattern: /(?<![\\*])\*{3}([^*\n]+)\*{3}(?!\*)/g, width: 3, count: 1 },
        { pattern: /(?<![\\*])\*(?!\*)([^*\n]+?)\*(?!\*)/g, width: 1, count: 1 }
      ];

  for (const { pattern, width, count } of patterns) {
    for (const match of line.matchAll(pattern)) {
      const from = lineStart + match.index;
      const to = from + match[0].length;
      // Do not interpret the delimiters themselves as selected content.
      if (start >= from + width && end <= to - width) {
        return { from, to, count };
      }
    }
  }
  return null;
}

/**
 * Bold / italic are toggle actions, not unconditional wrapping.
 * Exact surrounding delimiters are removed first. A cursor anywhere inside
 * a simple formatted span can also toggle the whole span off.
 */
export function toggleMarkdownInline(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  kind: InlineStyle,
  defaultText: string
): MarkdownEdit {
  const start = Math.max(0, Math.min(value.length, selectionStart));
  const end = Math.max(start, Math.min(value.length, selectionEnd));
  if (withinCodeFence(value, start, end)) return unchanged(value, start, end);

  const marker = kind === "bold" ? "**" : "*";
  const size = marker.length;
  const selected = value.slice(start, end);

  // The selected range includes its delimiters (e.g. select "**text**").
  // Italic is present only when the surrounding asterisk run is odd:
  // **text** is bold (not italic), while ***text*** is both styles.
  const selectedLeftStars = selected.match(/^\*+/)?.[0].length ?? 0;
  const selectedRightStars = selected.match(/\*+$/)?.[0].length ?? 0;
  const insideStyle = kind === "bold"
    ? selectedLeftStars >= 2 && selectedRightStars >= 2
    : selectedLeftStars % 2 === 1 && selectedRightStars % 2 === 1;
  if (selected.length >= size * 2 && insideStyle) {
    const inner = selected.slice(size, -size);
    return {
      value: value.slice(0, start) + inner + value.slice(end),
      selectionStart: start,
      selectionEnd: start + inner.length
    };
  }

  // Most common after the first Ctrl+B: the selection covers only the text,
  // while the surrounding ** delimiters are immediately outside the selection.
  let leftStars = 0;
  for (let i = start - 1; i >= 0 && value[i] === "*"; i--) leftStars++;
  let rightStars = 0;
  for (let i = end; i < value.length && value[i] === "*"; i++) rightStars++;
  const surrounded = kind === "bold"
    ? leftStars >= 2 && rightStars >= 2
    : leftStars % 2 === 1 && rightStars % 2 === 1;
  if (surrounded) {
    return {
      value: value.slice(0, start - size) + selected + value.slice(end + size),
      selectionStart: start - size,
      selectionEnd: end - size
    };
  }

  // When the user only has a caret (or selects part of the contents), find
  // the simple styled span and remove its delimiters without corrupting Markdown.
  const span = containingStyle(value, start, end, kind);
  if (span) {
    return {
      value: value.slice(0, span.from)
        + value.slice(span.from + span.count, span.to - span.count)
        + value.slice(span.to),
      selectionStart: start - span.count,
      selectionEnd: end - span.count
    };
  }

  const text = selected || defaultText;
  return {
    value: value.slice(0, start) + marker + text + marker + value.slice(end),
    selectionStart: start + size,
    selectionEnd: start + size + text.length
  };
}

export function wrapMarkdown(
  value: string,
  start: number,
  end: number,
  prefix: string,
  suffix: string,
  defaultText: string
): MarkdownEdit {
  const selected = value.slice(start, end);
  const text = selected || defaultText;
  return {
    value: value.slice(0, start) + prefix + text + suffix + value.slice(end),
    selectionStart: start + prefix.length,
    selectionEnd: start + prefix.length + text.length
  };
}

/** Shared editor adapter; keeps focus, selection and both scroll offsets. */
export function formatMarkdownTextarea(
  element: HTMLTextAreaElement | null,
  value: string,
  onChange: (value: string) => void,
  format: Formatting
): void {
  if (!element) return;
  const start = element.selectionStart ?? 0;
  const end = element.selectionEnd ?? 0;
  const scrollTop = element.scrollTop;
  const scrollLeft = element.scrollLeft;
  const result = "kind" in format
    ? toggleMarkdownInline(value, start, end, format.kind, format.defaultText)
    : wrapMarkdown(value, start, end, format.prefix, format.suffix, format.defaultText);
  if (result.value === value) return;

  onChange(result.value);
  requestAnimationFrame(() => {
    if (!element.isConnected) return;
    element.focus({ preventScroll: true });
    element.setSelectionRange(result.selectionStart, result.selectionEnd);
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  });
}
