"use client";

import React, { useMemo } from "react";

export interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

interface Token {
  type:
    | "keyword"
    | "type"
    | "string"
    | "comment"
    | "annotation"
    | "number"
    | "function"
    | "operator"
    | "text";
  value: string;
}

// Tokenizer for Java and popular backend languages
function tokenize(code: string): Token[] {
  // Regex token definitions
  const patterns = [
    { type: "comment", regex: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/m },
    { type: "string", regex: /("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/ },
    { type: "annotation", regex: /@[A-Za-z0-9_]+/ },
    { type: "number", regex: /\b\d+(\.\d+)?([fFdDlL])?\b/ },
    {
      type: "keyword",
      regex: /\b(public|private|protected|class|interface|enum|record|extends|implements|static|final|abstract|native|transient|volatile|synchronized|void|boolean|char|byte|short|int|long|float|double|return|if|else|switch|case|default|break|continue|for|while|do|try|catch|finally|throw|throws|new|this|super|instanceof|import|package|null|true|false|const|var|let|function|def|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|GROUP|BY|ORDER|HAVING|LIMIT|CREATE|TABLE|ALTER|DROP)\b/,
    },
    { type: "type", regex: /\b[A-Z][a-zA-Z0-9_]*\b/ },
    { type: "function", regex: /\b[a-z_][a-zA-Z0-9_]*(?=\s*\()/ },
    { type: "operator", regex: /(=>|===|==|!=|<=|>=|&&|\|\||[+\-*/%<>=!&|^~?:])/ },
  ];

  const combined = new RegExp(
    patterns.map((p) => `(${p.regex.source})`).join("|"),
    "gm"
  );

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  const tokens: Token[] = [];

  while ((match = combined.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: code.slice(lastIndex, match.index) });
    }

    const value = match[0];
    let tokenType: Token["type"] = "text";

    if (/^(\/\/|\/\*|#)/.test(value)) {
      tokenType = "comment";
    } else if (/^["'`]/.test(value)) {
      tokenType = "string";
    } else if (/^@/.test(value)) {
      tokenType = "annotation";
    } else if (/^\d/.test(value)) {
      tokenType = "number";
    } else if (
      /\b(public|private|protected|class|interface|enum|record|extends|implements|static|final|abstract|native|transient|volatile|synchronized|void|boolean|char|byte|short|int|long|float|double|return|if|else|switch|case|default|break|continue|for|while|do|try|catch|finally|throw|throws|new|this|super|instanceof|import|package|null|true|false|const|var|let|function|def|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|GROUP|BY|ORDER|HAVING|LIMIT|CREATE|TABLE|ALTER|DROP)\b/.test(
        value
      )
    ) {
      tokenType = "keyword";
    } else if (/^[A-Z]/.test(value)) {
      tokenType = "type";
    } else if (/(=>|===|==|!=|<=|>=|&&|\|\||[+\-*/%<>=!&|^~?:])/.test(value)) {
      tokenType = "operator";
    } else {
      tokenType = "function";
    }

    tokens.push({ type: tokenType, value });
    lastIndex = combined.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "text", value: code.slice(lastIndex) });
  }

  return tokens;
}

// Token styling matching VS Code / IntelliJ modern dark palette
const tokenClasses: Record<Token["type"], string> = {
  keyword: "text-purple-400 dark:text-purple-300 font-semibold",
  type: "text-cyan-400 dark:text-cyan-300 font-medium",
  string: "text-emerald-400 dark:text-emerald-300",
  comment: "text-slate-400 dark:text-slate-500 italic",
  annotation: "text-amber-400 dark:text-amber-300 font-semibold",
  number: "text-orange-400 dark:text-orange-300",
  function: "text-sky-300 dark:text-sky-300 font-normal",
  operator: "text-rose-400/90 dark:text-rose-300/90",
  text: "text-[var(--code-foreground)]",
};

export function SyntaxHighlighter({
  code,
  className = "",
}: SyntaxHighlighterProps) {
  const tokens = useMemo(() => tokenize(code), [code]);

  return (
    <code className={`font-mono text-xs sm:text-[13px] leading-relaxed ${className}`}>
      {tokens.map((token, index) => {
        const cls = tokenClasses[token.type] || tokenClasses.text;
        return (
          <span key={index} className={cls}>
            {token.value}
          </span>
        );
      })}
    </code>
  );
}
