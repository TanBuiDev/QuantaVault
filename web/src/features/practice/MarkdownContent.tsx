"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function CodeBlockWithCopy({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    // Trích xuất toàn bộ text content từ children
    const textToCopy = typeof children === "string" 
      ? children 
      : (document.getElementById(props.id || "")?.innerText || "");

    // Fallback lấy trực tiếp nếu qua element target hoặc ref
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback nếu không có element text
    });
  }

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
        className="max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--code-surface)] p-4 text-sm leading-6 text-[var(--code-foreground)]"
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
}

function filterMarkdownByLanguage(text: string, mode: LanguageMode): string {
  if (mode === "bilingual") return text;

  if (mode === "en") {
    // Chỉ giữ EN, bỏ dòng > **VI:** ...
    return text
      .replace(/> \*\*EN:\*\* ([\s\S]*?)\n>\n> \*\*VI:\*\* [\s\S]*?(?=\n\n|\Z)/g, "> **EN:** $1")
      .replace(/> \*\*VI:\*\* [\s\S]*?(?=\n\n|\Z)/g, "");
  }

  if (mode === "vi") {
    // Chỉ giữ VI, bỏ dòng > **EN:** ...
    return text
      .replace(/> \*\*EN:\*\* [\s\S]*?\n>\n> \*\*VI:\*\* ([\s\S]*?)(?=\n\n|\Z)/g, "> **VI:** $1")
      .replace(/> \*\*EN:\*\* [\s\S]*?(?=\n\n|\Z)/g, "");
  }

  return text;
}


export function MarkdownContent({ markdown, languageMode = "bilingual" }: MarkdownContentProps) {
  const processedMarkdown = filterMarkdownByLanguage(markdown, languageMode);

  return (
    <div className="max-w-none space-y-4 text-sm leading-7 text-[var(--muted-strong)] sm:text-[15.5px] sm:leading-7 [&_a]:font-semibold [&_a]:text-[var(--primary-strong)] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--border-strong)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--muted)] [&_code]:rounded-md [&_code]:bg-[var(--surface-hover)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[var(--foreground)] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_h1]:mt-2 [&_h1]:text-2xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-[var(--foreground)] [&_h2]:mt-7 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--foreground)] [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[var(--foreground)] [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:max-w-[78ch] [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[var(--border)] [&_td]:p-2 [&_th]:border [&_th]:border-[var(--border)] [&_th]:bg-[var(--surface-hover)] [&_th]:p-2 [&_th]:text-[var(--foreground)] [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1 [&_.katex]:text-[1.05em]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          pre: CodeBlockWithCopy,
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
}




