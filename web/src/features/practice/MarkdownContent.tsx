"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { MermaidRenderer } from "@/components/ui/MermaidRenderer";

function CodeBlockWithCopy({ children, className, ...props }: React.ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group relative my-4">
      <button
        type="button"
        onClick={(e) => {
          const pre = e.currentTarget.parentElement?.querySelector("pre");
          const codeText = pre?.textContent || "";
          navigator.clipboard.writeText(codeText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        title={copied ? "Copied!" : "Copy code"}
        aria-label="Copy code block"
        className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface)]/80 text-[var(--foreground)] opacity-0 shadow-sm backdrop-blur-md transition-all duration-150 hover:bg-[var(--surface-hover)] hover:scale-105 active:scale-95 group-hover:opacity-100 focus:opacity-100"
      >
        {copied ? (
          <svg
            className="h-3.5 w-3.5 text-emerald-500 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        ) : (
          <svg
            className="h-3.5 w-3.5 text-[var(--muted-strong)] transition-colors hover:text-[var(--foreground)]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
            />
          </svg>
        )}
      </button>
      <pre
        {...props}
        className={className || "max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--code-surface)] p-4 text-sm leading-6 text-[var(--code-foreground)]"}
      >
        {children}
      </pre>
    </div>
  );

}

export type LanguageMode = "bilingual" | "en" | "vi";

export interface MarkdownContentProps {
  markdown: string;
  languageMode?: LanguageMode;
  wordWrap?: boolean;
  className?: string;
  fullWidth?: boolean;
}

function filterMarkdownByLanguage(text: string, mode: LanguageMode): string {
  if (mode === "bilingual" || !text) return text;

  // Chuẩn hóa dòng trước khi xử lý
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const resultLines: string[] = [];

  let inBlockQuote = false;
  let blockEnLines: string[] = [];
  let blockViLines: string[] = [];

  function flushBlockQuote() {
    if (!inBlockQuote) return;
    if (mode === "en") {
      if (blockEnLines.length > 0) {
        resultLines.push(...blockEnLines.map((line) => `> ${line}`));
      }
    } else if (mode === "vi") {
      if (blockViLines.length > 0) {
        resultLines.push(...blockViLines.map((line) => `> ${line}`));
      }
    }
    blockEnLines = [];
    blockViLines = [];
    inBlockQuote = false;
  }

  let currentBlockType: "none" | "en" | "vi" = "none";

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Xử lý Blockquote (> ...)
    if (trimmed.startsWith(">")) {
      inBlockQuote = true;
      const quoteContent = trimmed.replace(/^>\s?/, "");

      if (quoteContent.startsWith("**EN:**")) {
        currentBlockType = "en";
        const content = quoteContent.replace(/^\*\*EN:\*\*\s*/, "");
        if (content) blockEnLines.push(content);
      } else if (quoteContent.startsWith("**VI:**")) {
        currentBlockType = "vi";
        const content = quoteContent.replace(/^\*\*VI:\*\*\s*/, "");
        if (content) blockViLines.push(content);
      } else if (quoteContent === "") {
        // Dòng ngăn cách `>`
        currentBlockType = "none";
      } else {
        if (currentBlockType === "en") blockEnLines.push(quoteContent);
        else if (currentBlockType === "vi") blockViLines.push(quoteContent);
      }
      continue;
    } else {
      flushBlockQuote();
      currentBlockType = "none";
    }

    // 2. Xử lý Heading song ngữ (# Title / Tiêu đề)
    const headingMatch = rawLine.match(/^(#+\s+)(.*?)\s+\/\s+(.*)$/);
    if (headingMatch) {
      const prefix = headingMatch[1];
      const enTitle = headingMatch[2];
      const viTitle = headingMatch[3];
      resultLines.push(mode === "en" ? `${prefix}${enTitle}` : `${prefix}${viTitle}`);
      continue;
    }

    // 3. Xử lý độ khó / inline (**Medium / Trung bình**)
    const inlineSlashMatch = rawLine.match(/^\*\*(.*?)\s+\/\s+(.*?)\*\*$/);
    if (inlineSlashMatch) {
      resultLines.push(mode === "en" ? `**${inlineSlashMatch[1]}**` : `**${inlineSlashMatch[2]}**`);
      continue;
    }

    // 4. Xử lý đoạn văn thường **EN:** và **VI:**
    if (rawLine.startsWith("**EN:**")) {
      if (mode === "en") {
        resultLines.push(rawLine.replace(/^\*\*EN:\*\*\s*/, ""));
      }
      continue;
    }
    if (rawLine.startsWith("**VI:**")) {
      if (mode === "vi") {
        resultLines.push(rawLine.replace(/^\*\*VI:\*\*\s*/, ""));
      }
      continue;
    }

    // 5. Xử lý Q (EN) / Q (VI)
    if (rawLine.startsWith("**Q (EN):**")) {
      if (mode === "en") {
        resultLines.push(`**Question:** ${rawLine.replace(/^\*\*Q \(EN\):\*\*\s*/, "")}`);
      }
      continue;
    }
    if (rawLine.startsWith("**Q (VI):**")) {
      if (mode === "vi") {
        resultLines.push(`**Câu hỏi:** ${rawLine.replace(/^\*\*Q \(VI\):\*\*\s*/, "")}`);
      }
      continue;
    }

    // 6. Xử lý các section answer EN/VI
    if (rawLine.startsWith("### Short answer (EN)")) {
      if (mode === "en") resultLines.push("### Short answer");
      continue;
    }
    if (rawLine.startsWith("### Trả lời ngắn (VI)")) {
      if (mode === "vi") resultLines.push("### Trả lời ngắn");
      continue;
    }
    if (rawLine.startsWith("### Standard answer (EN)")) {
      if (mode === "en") resultLines.push("### Standard answer");
      continue;
    }
    if (rawLine.startsWith("### Trả lời chuẩn (VI)")) {
      if (mode === "vi") resultLines.push("### Trả lời chuẩn");
      continue;
    }
    if (rawLine.startsWith("### Deep answer (EN)")) {
      if (mode === "en") resultLines.push("### Deep answer");
      continue;
    }
    if (rawLine.startsWith("### Trả lời sâu (VI)")) {
      if (mode === "vi") resultLines.push("### Trả lời sâu");
      continue;
    }

    resultLines.push(rawLine);
  }

  flushBlockQuote();

  return resultLines.join("\n");
}




export function MarkdownContent({
  markdown,
  languageMode = "bilingual",
  wordWrap = true,
  className = "",
  fullWidth = false,
}: MarkdownContentProps) {
  const processedMarkdown = filterMarkdownByLanguage(markdown, languageMode);

  return (
    <div
      className={`max-w-none space-y-4 text-sm leading-7 text-[var(--muted-strong)] sm:text-[15.5px] sm:leading-7 [&_a]:font-semibold [&_a]:text-[var(--primary-strong)] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--border-strong)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--muted)] [&_code]:rounded-md [&_code]:bg-[var(--surface-hover)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[var(--foreground)] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_h1]:mt-2 [&_h1]:text-2xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-[var(--foreground)] [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[var(--foreground)] [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal ${
        fullWidth ? "[&_p]:max-w-none" : "[&_p]:max-w-[78ch]"
      } [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[var(--border)] [&_td]:p-2 [&_th]:border [&_th]:border-[var(--border)] [&_th]:bg-[var(--surface-hover)] [&_th]:p-2 [&_th]:text-[var(--foreground)] [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1 [&_.katex]:text-[1.05em] ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) {
            const match = /language-(\w+)/.exec(className || "");
            const isMermaid = match && match[1] === "mermaid";
            if (isMermaid) {
              return <MermaidRenderer chart={String(children).replace(/\n$/, "")} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
            const child = props.children;
            const childProps =
              child && typeof child === "object" && "props" in child
                ? (child as { props?: { className?: string } }).props
                : undefined;
            if (
              childProps &&
              typeof childProps.className === "string" &&
              childProps.className.includes("language-mermaid")
            ) {
              return <>{props.children}</>;
            }
            return (
              <CodeBlockWithCopy
                {...props}
                className={`max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--code-surface)] p-4 text-sm leading-6 text-[var(--code-foreground)] ${
                  wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
                }`}
              />
            );
          },
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
}




