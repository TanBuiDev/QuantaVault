/**
 * Read-only UTF-16 source coordinates for Markdown preview navigation.
 * Index original input once; do not normalize CRLF or alter persisted Markdown.
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

function positiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 1;
}

/**
 * O(n) index construction, then O(log lines) lookup per Markdown AST block.
 * CRLF is one logical line ending; offsets remain JavaScript UTF-16 indices.
 */
export function createMarkdownSourceResolver(source: string) {
  const lineStarts: number[] = [0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === "\r") {
      if (source[i + 1] === "\n") i++;
      lineStarts.push(i + 1);
    } else if (source[i] === "\n") {
      lineStarts.push(i + 1);
    }
  }

  function locateOffset(offset: number): MarkdownSourceLocation | null {
    if (!Number.isSafeInteger(offset) || offset < 0 || offset > source.length) return null;
    let low = 0;
    let high = lineStarts.length;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (lineStarts[middle] <= offset) low = middle + 1;
      else high = middle;
    }
    const lineIndex = low - 1;
    // The index is in original UTF-16 units, including emoji surrogate pairs.
    return { offset, line: lineIndex + 1, column: offset - lineStarts[lineIndex] + 1 };
  }

  return (start?: MarkdownAstPoint | null): MarkdownSourceLocation | null => {
    if (!start) return null;
    let offset = start.offset;
    if (offset === undefined) {
      if (!positiveInteger(start.line) || !positiveInteger(start.column)) return null;
      const lineStart = lineStarts[start.line - 1];
      if (lineStart === undefined) return null;
      const lineEnd = start.line < lineStarts.length
        ? lineStarts[start.line] - (source[lineStarts[start.line] - 2] === "\r" ? 2 : 1)
        : source.length;
      offset = lineStart + start.column - 1;
      if (offset > lineEnd) return null;
    }
    const location = locateOffset(offset);
    if (!location) return null;
    if (start.line !== undefined && (!positiveInteger(start.line) || start.line !== location.line)) return null;
    if (start.column !== undefined && (!positiveInteger(start.column) || start.column !== location.column)) return null;
    return location;
  };
}

export function markdownLocationAtOffset(source: string, offset: number): MarkdownSourceLocation | null {
  return createMarkdownSourceResolver(source)({ offset });
}

export function resolveMarkdownSourceLocation(
  source: string,
  start?: MarkdownAstPoint | null,
): MarkdownSourceLocation | null {
  return createMarkdownSourceResolver(source)(start);
}
