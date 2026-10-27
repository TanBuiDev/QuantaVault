"use client";
import { PracticeSolution } from "./PracticeSolution";
import { MediaGallery } from "./MediaGallery";

import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import type { ProblemContent } from "@/lib/content";

import { MarkdownContent } from "./MarkdownContent";

import type { PracticeTab } from "./practiceTypes";
import type { usePracticeWorkspace } from "./usePracticeWorkspace";
function difficultyVariant(difficulty: ProblemContent["difficulty"]) {
  if (difficulty === "Easy") return "success" as const;
  if (difficulty === "Medium") return "warning" as const;
  if (difficulty === "Hard") return "danger" as const;
  return "neutral" as const;
}

export function PracticeStudyContent(model: ReturnType<typeof usePracticeWorkspace>) {
  const { content, hints, sectionName, updateProblem, progress, activeTab, wordWrap, langMode, handleSetLangMode, problemMedia, tabs, changeTab } = model;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          items={tabs}
          value={activeTab}
          onValueChange={(val) => changeTab(val as PracticeTab)}
          ariaLabel="Practice content"
        />

        {/* Language Mode Selector: Bilingual | EN | VI */}
        <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-1 shadow-inner text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleSetLangMode("bilingual")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all ${langMode === "bilingual"
              ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            title="Hiển thị song ngữ Anh - Việt"
          >
            <svg className="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span>Song ngữ</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetLangMode("en")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all ${langMode === "en"
              ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            title="Chỉ hiển thị đề Tiếng Anh"
          >
            <span className="rounded bg-indigo-500/10 px-1 py-0.2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">EN</span>
            <span>English</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetLangMode("vi")}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all ${langMode === "vi"
              ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            title="Chỉ hiển thị đề Tiếng Việt"
          >
            <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[10px] font-bold text-rose-600 dark:text-rose-400">VI</span>
            <span>Tiếng Việt</span>
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-6 lg:p-7">
          <div role="tabpanel" aria-label={`${activeTab} content`}>
            {activeTab === "problem" ? (
              <div className="space-y-6">
                {content.problemMarkdown ? (
                  <ProblemStatement
                    markdown={content.problemMarkdown}
                    media={problemMedia}
                    problemId={content.id}
                    languageMode={langMode}
                    wordWrap={wordWrap}
                    badges={
                      <>
                        <Badge variant={difficultyVariant(content.difficulty)}>{content.difficulty}</Badge>
                        <Badge variant="info">{sectionName}</Badge>
                        {content.topics.map((topic) => (
                          <Badge key={topic}>{topic}</Badge>
                        ))}
                        {content.patterns?.map((pattern) => (
                          <Badge key={pattern} variant="primary">{pattern}</Badge>
                        ))}
                      </>
                    }
                  />
                ) : (
                  <EmptyState
                    title="Full problem source is not available yet"
                    description="This canonical package currently has only limited source metadata. The web app will not fabricate a problem statement."
                  />
                )}
              </div>
            ) : null}

            {activeTab === "hints" ? (
              <div className="space-y-5">
                {hints.map((hint, index) => (
                  <section
                    key={`${content.id}-hint-${index + 1}`}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-4 sm:p-5"
                  >
                    <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">
                      Hint {index + 1}
                    </div>
                    <MarkdownContent markdown={hint} languageMode={langMode} wordWrap={wordWrap} />
                  </section>
                ))}
              </div>
            ) : null}

            {activeTab === "solution" ? <PracticeSolution {...model} /> : null}

            {activeTab === "interview" ? (
              <div className="space-y-6">
                {content.interviewMarkdown ? (
                  <MarkdownContent markdown={content.interviewMarkdown} languageMode={langMode} wordWrap={wordWrap} />
                ) : (
                  <EmptyState title="No interview guide available" description="This problem does not have an interview walkthrough yet." />
                )}
              </div>
            ) : null}

            {activeTab === "notes" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor={`notes-${content.id}`} className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Ghi chú cá nhân (Tự động lưu)
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    Đã lưu
                  </span>
                </div>
                <textarea
                  id={`notes-${content.id}`}
                  rows={10}
                  value={progress?.notes ?? ""}
                  onChange={(event) => updateProblem(content.id, { notes: event.target.value })}
                  spellCheck={false}
                  autoCorrect="off"
                  autoCapitalize="off"
                  autoComplete="off"
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  placeholder="Ghi chú lại thuật toán, bẫy testcase, độ phức tạp..."
                  className="w-full resize-y rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-4 text-sm leading-relaxed text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 [contain:content]"
                />
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function ProblemStatement({
  markdown,
  media,
  problemId,
  languageMode = "bilingual",
  badges,
  wordWrap = true,
}: {
  markdown: string;
  media: NonNullable<ProblemContent["media"]>;
  problemId: number;
  languageMode?: "bilingual" | "en" | "vi";
  badges?: React.ReactNode;
  wordWrap?: boolean;
}) {
  const headingMatch = markdown.match(/^(#\s+[^\n]+(?:\r?\n|$))/);

  if (headingMatch && badges) {
    const titleText = headingMatch[0];
    const restMarkdown = markdown.slice(titleText.length).trimStart();
    const insertion = restMarkdown.search(/^##\s+(?:Constraints|Ràng buộc|Source|Nguồn)\b/im);

    return (
      <div className="space-y-4">
        <MarkdownContent markdown={titleText.trimEnd()} languageMode={languageMode} wordWrap={wordWrap} />
        <div className="flex flex-wrap items-center gap-2 -mt-1 pb-1">
          {badges}
        </div>
        {media.length === 0 ? (
          <MarkdownContent markdown={restMarkdown} languageMode={languageMode} wordWrap={wordWrap} />
        ) : insertion < 0 ? (
          <>
            <MarkdownContent markdown={restMarkdown} languageMode={languageMode} wordWrap={wordWrap} />
            <MediaGallery items={media} problemId={problemId} />
          </>
        ) : (
          <>
            <MarkdownContent markdown={restMarkdown.slice(0, insertion).trimEnd()} languageMode={languageMode} wordWrap={wordWrap} />
            <MediaGallery items={media} problemId={problemId} />
            <MarkdownContent markdown={restMarkdown.slice(insertion).trimStart()} languageMode={languageMode} wordWrap={wordWrap} />
          </>
        )}
      </div>
    );
  }

  if (media.length === 0) return <MarkdownContent markdown={markdown} languageMode={languageMode} wordWrap={wordWrap} />;
  const insertion = markdown.search(/^##\s+(?:Constraints|Ràng buộc|Source|Nguồn)\b/im);
  if (insertion < 0) {
    return (
      <>
        <MarkdownContent markdown={markdown} languageMode={languageMode} wordWrap={wordWrap} />
        <MediaGallery items={media} problemId={problemId} />
      </>
    );
  }
  return (
    <>
      <MarkdownContent markdown={markdown.slice(0, insertion).trimEnd()} languageMode={languageMode} wordWrap={wordWrap} />
      <MediaGallery items={media} problemId={problemId} />
      <MarkdownContent markdown={markdown.slice(insertion).trimStart()} languageMode={languageMode} wordWrap={wordWrap} />
    </>
  );
}

