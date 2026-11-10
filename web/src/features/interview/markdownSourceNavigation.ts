/**
 * Read-only source coordinates for navigating from a rendered Markdown block
 * to the original Markdown textarea. Offsets are UTF-16 indices (String indices).
 */
export type MarkdownAstPoint = {
  offset?: number;
  line?: number;
  column?: number;
};

export type MarkdownSourceLocation = {
  offset: number;
  line: number;
  column: number;
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 1;
}

/** Compute the original source line/column without normalizing CRLF or Unicode. */
export function markdownLocationAtOffset(source: string, offset: number): MarkdownSourceLocation | null {
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > source.length) return null;
  let line = 1;
  let column = 1;
  for (let i = 0; i < offset; i++) {
    if (source[i] === "\r") {
      line++;
      column = 1;
      if (source[i + 1] === "\n" && i + 1 < offset) i++;
    } else if (source[i] === "\n") {
      // A CRLF pair is one line break, including when the offset falls between them.
      if (i === 0 || source[i - 1] !== "\r") line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { offset, line, column };
}

/** Convert a 1-based AST line/column to a UTF-16 offset in the unmodified input. */
function sourceOffsetAtLineColumn(source: string, line: number, column: number): number | null {
  if (!isPositiveInteger(line) || !isPositiveInteger(column)) return null;
  let currentLine = 1;
  let start = 0;
  for (let i = 0; i < source.length && currentLine < line; i++) {
    if (source[i] === "\r" || source[i] === "\n") {
      if (source[i] === "\r" && source[i + 1] === "\n") i++;
      currentLine++;
      start = i + 1;
    }
  }
  if (currentLine !== line) return null;
  let end = start;
  while (end < source.length && source[end] !== "\r" && source[end] !== "\n") end++;
  const index = start + column - 1;
  return index <= end ? index : null;
}

/**
 * Prefer the parser's original offset. If it is absent, use its original
 * line/column. Reject inconsistent coordinates rather than jumping somewhere
 * else. Never search for text: duplicate paragraphs must remain distinct.
 */
export function resolveMarkdownSourceLocation(
  source: string,
  start?: MarkdownAstPoint | null,
): MarkdownSourceLocation | null {
  if (!start) return null;
  let offset = start.offset;
  if (offset === undefined) {
    if (!isPositiveInteger(start.line) || !isPositiveInteger(start.column)) return null;
    const inferred = sourceOffsetAtLineColumn(source, start.line, start.column);
    if (inferred === null) return null;
    offset = inferred;
  }
  const resolved = markdownLocationAtOffset(source, offset);
  if (!resolved) return null;
  if (start.line !== undefined && (!isPositiveInteger(start.line) || start.line !== resolved.line)) return null;
  return resolved;
}
