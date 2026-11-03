"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface InterviewSummaryMarkdownProps {
  markdown: string;
  textScale?: number;
}

/** Compact, safe Markdown rendering for active-recall summaries. */
export function InterviewSummaryMarkdown({ markdown, textScale = 100 }: InterviewSummaryMarkdownProps) {
  return (
    <div
      data-testid="interview-summary-markdown"
      style={textScale === 100 ? undefined : { fontSize: `${14 * textScale / 100}px` }}
      className="min-w-0 break-words text-xs leading-relaxed text-[var(--foreground)]/90 sm:text-sm [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-[var(--foreground)] [&_code]:rounded [&_code]:bg-[var(--surface-hover)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_a]:font-medium [&_a]:text-[var(--primary-strong)] [&_a]:underline [&_h1]:my-1 [&_h1]:font-bold [&_h2]:my-1 [&_h2]:font-bold [&_h3]:my-1 [&_h3]:font-bold [&_pre]:my-2 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-[var(--code-surface)] [&_pre]:p-3 [&_pre]:text-[var(--code-foreground)] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
