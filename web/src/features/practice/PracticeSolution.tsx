"use client";
import { MediaGallery } from "./MediaGallery";

import { ArrowRightLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

import { MarkdownContent } from "./MarkdownContent";


import type { usePracticeWorkspace } from "./usePracticeWorkspace";
export function PracticeSolution(model: ReturnType<typeof usePracticeWorkspace>) {
  const {
    content,
    codeVersions,
    selectedVersionIdx,
    setSelectedVersionIdx,
    setIsCodeModalOpen,
    setEditingVersion,
    copyState,
    currentCodeItem,
    currentJavaSource,
    wordWrap,
    langMode,
    handleLoadSolutionToEditor,
    copyJavaSource,
    handleDeleteCodeVersion,
    solutionMedia,
    approaches,
    setSelectedApproachId,
    activeApproach,
    currentSolutionMarkdown
  } = model;
  return (
    <div className="space-y-6">
      {approaches.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-1.5 sm:p-2">
          {approaches.map((app) => {
            const isSelected = app.id === (activeApproach?.id ?? "");
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => setSelectedApproachId(app.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all ${isSelected
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm ring-1 ring-[var(--border-strong)]"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface)]/50 hover:text-[var(--foreground)]"
                  }`}
              >
                <span>{app.name}</span>
                {app.tag ? (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${app.tag.toLowerCase() === "optimal"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-[var(--surface-hover)] text-[var(--muted)]"
                      }`}
                  >
                    {app.tag}
                  </span>
                ) : null}
                {app.timeComplexity ? (
                  <span className="text-[11px] text-[var(--muted)]">{app.timeComplexity}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {currentSolutionMarkdown ? (
        <MarkdownContent markdown={currentSolutionMarkdown} languageMode={langMode} wordWrap={wordWrap} />
      ) : (
        <EmptyState title="No solution explanation available" description="This problem does not have a detailed markdown solution guide yet." />
      )}

      <MediaGallery items={solutionMedia} problemId={content.id} />

      {/* Java Reference Solution Card with Versioning & Copy */}
      <section className="space-y-3 pt-2" aria-labelledby="java-solution-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-strong)]">Reference code</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 id="java-solution-heading" className="text-lg font-bold text-[var(--foreground)]">
                Java solution
              </h2>
              {codeVersions.length > 1 && currentCodeItem?.name ? (
                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${currentCodeItem.isDefault
                    ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 ring-1 ring-indigo-500/30"
                    : "bg-[var(--surface-hover)] text-[var(--muted-strong)]"
                    }`}
                >
                  {currentCodeItem.name}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentJavaSource ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleLoadSolutionToEditor}
                className="gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold"
                title="Đưa mã nguồn tham khảo này vào Code Editor"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Đưa vào Editor</span>
              </Button>
            ) : null}

            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setEditingVersion(null);
                setIsCodeModalOpen(true);
              }}
              className="gap-1.5"
              title="Thêm một phiên bản code Java mới"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Thêm code</span>
            </Button>

            {currentCodeItem ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditingVersion(currentCodeItem);
                  setIsCodeModalOpen(true);
                }}
                className="gap-1.5"
                title="Chỉnh sửa phiên bản code này"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                <span>Sửa code</span>
              </Button>
            ) : null}

            {currentCodeItem && !currentCodeItem.isCanonical && codeVersions.length > 1 ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleDeleteCodeVersion(currentCodeItem)}
                className="text-red-500 hover:bg-red-500/10 hover:text-red-600 gap-1.5"
                title="Xóa phiên bản code này"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span>Xóa</span>
              </Button>
            ) : null}

            {currentJavaSource ? (
              <Button size="sm" variant="secondary" onClick={copyJavaSource}>
                {copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy unavailable" : "Copy Java"}
              </Button>
            ) : null}
          </div>
        </div>

        {/* Versions Dots Pagination */}
        {codeVersions.length > 1 ? (
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-4 py-2">
            <button
              type="button"
              onClick={() => setSelectedVersionIdx((prev) => (prev > 0 ? prev - 1 : codeVersions.length - 1))}
              className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Phiên bản trước"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {codeVersions.map((v, idx) => {
                const isSelected = idx === selectedVersionIdx;
                return (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => setSelectedVersionIdx(idx)}
                    title={v.name || `Version ${idx + 1}`}
                    className={`group relative flex items-center justify-center transition-all ${isSelected ? "scale-110" : "hover:scale-105"
                      }`}
                  >
                    <span
                      className={`block rounded-full transition-all ${isSelected
                        ? "h-2.5 w-6 bg-[var(--primary-strong)] ring-2 ring-[var(--primary)]/20"
                        : "h-2 w-2 bg-[var(--muted)]/50 group-hover:bg-[var(--muted-strong)]"
                        }`}
                    />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSelectedVersionIdx((prev) => (prev < codeVersions.length - 1 ? prev + 1 : 0))}
              className="rounded-full p-1 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Phiên bản tiếp theo"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        ) : null}

        {currentJavaSource ? (
          <pre className={`max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--code-surface)] p-4 text-xs font-mono leading-6 text-[var(--code-foreground)] ${wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"}`}>
            <code>{currentJavaSource}</code>
          </pre>
        ) : null}
      </section>
    </div>
  );
}
