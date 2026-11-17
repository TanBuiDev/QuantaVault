"use client";

import { useMemo, useState } from "react";
import type { InterviewQuestion } from "@/lib/interview/types";
import { buildLineDiff, compactDiffRows, type DiffCell, type DiffRow } from "./publishedConflictDiff";

type ComparedField = "title" | "summary" | "answerMarkdown" | "category" | "difficulty" |
  "tags" | "companies" | "keyTakeaways" | "relatedProblems";

const comparedFields: { key: ComparedField; label: string }[] = [
  { key: "title", label: "Tiêu đề" },
  { key: "summary", label: "Trọng tâm cốt lõi" },
  { key: "answerMarkdown", label: "Nội dung trả lời" },
  { key: "category", label: "Chủ đề" },
  { key: "difficulty", label: "Cấp độ" },
  { key: "tags", label: "Tags" },
  { key: "companies", label: "Công ty" },
  { key: "keyTakeaways", label: "Ý chính" },
  { key: "relatedProblems", label: "Bài tập liên quan" },
];

function fieldText(question: InterviewQuestion | null, key: ComparedField): string {
  const value = question?.[key];
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.map(String).join("\n");
  return value;
}

/** Highlight characters changed within a paired line, in addition to Git-style line colors. */
function highlightedText(text: string, other?: string) {
  if (other === undefined) return text || " ";
  let start = 0;
  while (start < text.length && start < other.length && text[start] === other[start]) start++;
  let end = 0;
  while (end < text.length - start && end < other.length - start &&
    text[text.length - end - 1] === other[other.length - end - 1]) end++;
  const changed = text.slice(start, text.length - end);
  if (!changed) return text || " ";
  return <>
    {text.slice(0, start)}
    <mark className="rounded-sm bg-current/15 text-inherit underline decoration-current/50 decoration-2 underline-offset-2">{changed}</mark>
    {end > 0 ? text.slice(text.length - end) : ""}
  </>;
}

function Cell({ cell, paired, side }: { cell: DiffCell | null; paired: DiffCell | null; side: "left" | "right" }) {
  const style = cell?.kind === "removed"
    ? "bg-rose-500/10 text-rose-800 dark:text-rose-200"
    : cell?.kind === "added"
      ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
      : "bg-[var(--surface)] text-[var(--foreground)]";
  const marker = cell?.kind === "removed" ? "−" : cell?.kind === "added" ? "+" : " ";
  return (
    <div role="cell" data-diff-kind={cell?.kind ?? "empty"} data-diff-side={side}
      className={"grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] border-b border-[var(--border)] " + style}>
      <span aria-hidden="true" className="select-none border-r border-[var(--border)] px-1 py-1 text-right font-mono text-[10px] opacity-60">
        {cell?.line ?? ""}
      </span>
      <pre className="min-w-0 whitespace-pre-wrap break-words px-2 py-1 font-mono text-[11px] leading-[1.55]">
        <span aria-hidden="true" className="mr-1 select-none font-bold">{cell ? marker : " "}</span>
        {cell ? highlightedText(cell.text,
          cell.kind !== "same" && paired?.kind !== "same" ? paired?.text : undefined) : " "}
      </pre>
    </div>
  );
}

function DiffGrid({ rows, showAll }: { rows: DiffRow[]; showAll: boolean }) {
  const visible = showAll ? rows : compactDiffRows(rows);
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <div role="table" aria-label="So sánh từng dòng" className="min-w-[560px]">
        <div role="row" className="sticky top-0 z-10 grid grid-cols-2 bg-[var(--surface-hover)]">
          <div role="columnheader" className="border-r border-[var(--border)] px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-300">
            − Bản cục bộ đã xuất bản
          </div>
          <div role="columnheader" className="px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            + Dữ liệu website hiện tại
          </div>
        </div>
        {visible.map((row, i) => "collapsed" in row
          ? <div key={"hidden-" + i} className="border-b border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-center text-[11px] text-[var(--muted)]">
              … {row.collapsed} dòng không đổi được thu gọn …
            </div>
          : <div role="row" key={"line-" + i} className="grid grid-cols-2">
              <Cell cell={row.left} paired={row.right} side="left" />
              <Cell cell={row.right} paired={row.left} side="right" />
            </div>
        )}
      </div>
    </div>
  );
}

export function PublishedConflictLineDiff({
  local,
  website,
  localDeleted = false,
}: {
  local: InterviewQuestion;
  website: InterviewQuestion | null;
  localDeleted?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const changed = useMemo(() => comparedFields.flatMap(({ key, label }) => {
    const left = localDeleted ? "" : fieldText(local, key);
    const right = fieldText(website, key);
    if (left === right) return [];
    return [{ key, label, result: buildLineDiff(left, right) }];
  }), [local, website, localDeleted]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[var(--surface-hover)] px-3 py-2 text-xs">
        <span className="font-bold text-[var(--foreground)]">Khác biệt theo dòng (Git diff) · {changed.length} trường</span>
        <label className="inline-flex cursor-pointer items-center gap-2 text-[var(--muted-strong)]">
          <input type="checkbox" checked={showAll} onChange={event => setShowAll(event.target.checked)}
            className="accent-indigo-600" />
          Hiển thị cả dòng không đổi
        </label>
      </div>
      {localDeleted && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600">
        Bản cục bộ đã đánh dấu xóa câu hỏi. Phần bên phải là nội dung đang có trên website.
      </p>}
      {changed.length === 0 && !localDeleted && (
        <p className="rounded-lg border border-[var(--border)] p-3 text-xs text-[var(--muted)]">
          Không thấy dòng nội dung khác biệt sau khi chuẩn hóa xuống dòng. Có thể phiên bản nền hoặc metadata không hiển thị đã thay đổi. Hãy kiểm tra JSON đầy đủ bên dưới.
        </p>
      )}
      {changed.map(({ key, label, result }) => (
        <section key={key} aria-label={"Thay đổi trường " + label} className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-[var(--foreground)]">{label}</h4>
            <span className="font-mono text-[11px]">
              <span className="text-rose-600 dark:text-rose-300">−{result.removed}</span>
              <span className="ml-2 text-emerald-700 dark:text-emerald-300">+{result.added}</span>
            </span>
          </div>
          {result.coarse && <p className="text-xs text-amber-600">Đoạn quá lớn để ghép từng dòng chính xác; đang hiển thị vùng bị thay thế để bảo vệ hiệu năng.</p>}
          <DiffGrid rows={result.rows} showAll={showAll} />
        </section>
      ))}
    </div>
  );
}
