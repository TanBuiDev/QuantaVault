const INDENT = "    ";
const SAME_LINE_AFTER_BLOCK = new Set(["else", "catch", "finally"]);
const CLOSING_SUFFIXES = new Set([";", ",", ")", "]", "."]);
const CONTROL_KEYWORD = /(?:^|\s)(?:if|for|while|switch|catch|synchronized)$/;

function peekNextToken(source: string, start: number): string {
  let index = start;
  while (index < source.length && /\s/.test(source[index])) index += 1;
  if (index >= source.length) return "";

  const first = source[index];
  if (/[A-Za-z_$]/.test(first)) {
    let end = index + 1;
    while (end < source.length && /[A-Za-z0-9_$]/.test(source[end])) end += 1;
    return source.slice(index, end);
  }

  return first;
}

/**
 * Lightweight client-side formatter for the LeetCode-style Java snippets used by the editor.
 * It is intentionally syntax-aware around strings/comments, braces and for-loop semicolons,
 * while avoiding a heavyweight Java parser or a server round-trip.
 */
export function formatJavaSource(source: string): string {
  const normalized = source.replace(/\r\n?/g, "\n");
  if (!normalized.trim()) return "";

  const lines: string[] = [];
  let current = "";
  let indentLevel = 0;
  let parenDepth = 0;
  let quote: '"' | "'" | null = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  const pushLine = () => {
    const text = current.trim();
    if (text) lines.push(`${INDENT.repeat(indentLevel)}${text}`);
    current = "";
  };

  const appendSpace = () => {
    if (current && !current.endsWith(" ")) current += " ";
  };

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];
    const next = normalized[index + 1];

    if (inLineComment) {
      if (char === "\n") {
        pushLine();
        inLineComment = false;
      } else {
        current += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        current += "*/";
        index += 1;
        inBlockComment = false;
      } else if (char === "\n") {
        pushLine();
      } else {
        current += char;
      }
      continue;
    }

    if (quote) {
      current += char;
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }

    if (char === "/" && next === "/") {
      current = current.trimEnd();
      if (current) current += " ";
      current += "//";
      index += 1;
      inLineComment = true;
      continue;
    }

    if (char === "/" && next === "*") {
      current = current.trimEnd();
      if (current) current += " ";
      current += "/*";
      index += 1;
      inBlockComment = true;
      continue;
    }

    if (char === "\n") {
      pushLine();
      continue;
    }

    if (/\s/.test(char)) {
      appendSpace();
      continue;
    }

    if (char === "(") {
      const trimmed = current.trimEnd();
      current = CONTROL_KEYWORD.test(trimmed) ? `${trimmed} (` : `${trimmed}(`;
      parenDepth += 1;
      continue;
    }

    if (char === ")") {
      current = `${current.trimEnd()})`;
      parenDepth = Math.max(0, parenDepth - 1);
      continue;
    }

    if (char === "{") {
      current = current.trimEnd();
      current += current ? " {" : "{";
      pushLine();
      indentLevel += 1;
      continue;
    }

    if (char === "}") {
      pushLine();
      indentLevel = Math.max(0, indentLevel - 1);
      current = "}";

      const token = peekNextToken(normalized, index + 1);
      if (SAME_LINE_AFTER_BLOCK.has(token)) {
        current += " ";
      } else if (!CLOSING_SUFFIXES.has(token)) {
        pushLine();
      }
      continue;
    }

    if (char === ";") {
      current = `${current.trimEnd()};`;
      if (parenDepth === 0) {
        pushLine();
      } else {
        current += " ";
      }
      continue;
    }

    if (char === ",") {
      current = `${current.trimEnd()}, `;
      continue;
    }

    current += char;
  }

  pushLine();
  return lines.join("\n");
}
