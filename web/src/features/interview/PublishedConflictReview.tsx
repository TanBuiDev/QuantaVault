"use client";

import { useState } from "react";
import { AlertTriangle, Download, GitCompareArrows, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import type { InterviewQuestion } from "@/lib/interview/types";
import { canonicalQuestion } from "@/lib/interview/questionVersion";
import {
  acceptWebsitePublishedVersion,
  downloadPublishedConflictBackup,
  keepPublishedVersionAsDraft,
  type DraftMap,
  type PublishedCacheMap,
} from "@/lib/interview/draftStore";

interface PublishedConflictReviewProps {
  canonicalQuestions: InterviewQuestion[];
  drafts: DraftMap;
  publishedCache: PublishedCacheMap;
  conflictingIds: string[];
}

const fields: { key: keyof InterviewQuestion; label: string }[] = [
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

function changedFields(local: InterviewQuestion, website: InterviewQuestion | null): string[] {
  if (!website) return ["Câu hỏi không tồn tại trên website"];
  return fields
    .filter(({ key }) => JSON.stringify(local[key] ?? null) !== JSON.stringify(website[key] ?? null))
    .map(({ label }) => label);
}

function VersionContent({ question, missing }: { question: InterviewQuestion | null; missing: string }) {
  if (!question) return <p className="text-sm italic text-[var(--muted)]">{missing}</p>;
  return (
    <div className="min-w-0 space-y-2 text-sm">
      <p className="font-bold break-words text-[var(--foreground)]">{question.title}</p>
      <p className="whitespace-pre-wrap break-words text-[var(--muted-strong)]">{question.summary || "Không có tóm tắt"}</p>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-xs text-[var(--foreground)]">{question.answerMarkdown || "Không có nội dung"}</pre>
      <details className="text-xs text-[var(--muted)]">
        <summary className="cursor-pointer py-1 font-semibold">Xem toàn bộ trường dữ liệu (JSON)</summary>
        <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-[var(--surface-hover)] p-3">{JSON.stringify(canonicalQuestion(question), null, 2)}</pre>
      </details>
    </div>
  );
}

export function PublishedConflictReview({
  canonicalQuestions,
  drafts,
  publishedCache,
  conflictingIds,
}: PublishedConflictReviewProps) {
  const [open, setOpen] = useState(false);
  const [backupRequested, setBackupRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirm = useConfirm();

  if (conflictingIds.length === 0) return null;

  const conflicts = conflictingIds.flatMap(id => {
    const item = publishedCache[id];
    if (!item) return [];
    return [{ id, item, website: canonicalQuestions.find(question => question.id === id) ?? null }];
  });

  function openReview() {
    setError(null);
    setBackupRequested(false);
    setOpen(true);
  }

  function backup() {
    try {
      downloadPublishedConflictBackup(canonicalQuestions, drafts, publishedCache);
      setBackupRequested(true);
      setError(null);
    } catch {
      setError("Không thể khởi tạo tải bản sao lưu JSON. Chưa có dữ liệu nào bị thay đổi.");
    }
  }

  async function resolve(id: string, strategy: "website" | "draft") {
    if (!backupRequested) {
      setError("Hãy tải bản sao lưu JSON trước khi xử lý xung đột.");
      return;
    }
    const entry = conflicts.find(item => item.id === id);
    if (!entry) return;
    if (strategy === "draft" && drafts[id]) {
      setError("Câu hỏi đã có bản nháp chưa xuất bản. Không ghi đè bản nháp; hãy kiểm tra phần chỉnh sửa hiện có.");
      return;
    }
    const useWebsite = strategy === "website";
    const approved = await confirm({
      title: useWebsite ? "Dùng phiên bản website?" : "Giữ bản cục bộ thành bản nháp?",
      message: useWebsite
        ? "Chỉ bỏ bản Published Cache của câu hỏi " + id + " trên thiết bị này. Bản nháp khác và dữ liệu GitHub/D1 không thay đổi. Bạn đã sao lưu trước khi tiếp tục?"
        : "Chuyển bản cục bộ của câu hỏi " + id + " thành bản nháp chưa xuất bản, dựa trên phiên bản website hiện tại. Không ghi dữ liệu lên GitHub; bạn cần xuất bản riêng nếu muốn cập nhật.",
      confirmText: useWebsite ? "Dùng bản website" : "Giữ thành bản nháp",
      cancelText: "Tiếp tục đối chiếu",
      variant: "warning",
    });
    if (!approved) return;
    try {
      if (useWebsite) {
        acceptWebsitePublishedVersion(id, entry.item);
      } else {
        keepPublishedVersionAsDraft(id, entry.item, entry.website);
      }
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Không thể cập nhật dữ liệu. Các bản hiện có vẫn được giữ.");
    }
  }

  return (
    <>
      <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-[var(--foreground)]">
        <div className="flex min-w-0 items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>Website khác với bản đã xuất bản được giữ trên máy ở <strong>{conflictingIds.length} câu hỏi</strong>. Không có dữ liệu nào bị tự động xóa.</p>
        </div>
        <button type="button" onClick={openReview} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-500/40 bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)]">
          <GitCompareArrows className="h-4 w-4" /> Xem &amp; đối chiếu
        </button>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} maxWidth="3xl" title="Đối chiếu phiên bản đã xuất bản" contentClassName="overflow-y-auto px-4 py-4 sm:px-6">
        <div className="space-y-4 text-sm text-[var(--foreground)]">
          <p className="text-[var(--muted)]">Danh sách dưới đây so sánh dữ liệu website đang mở với bản Published Cache trong trình duyệt. Website có thể cập nhật sau GitHub nếu quá trình triển khai chưa hoàn tất.</p>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-3">
            <button type="button" onClick={backup} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700">
              <Download className="h-4 w-4" /> Tải JSON sao lưu đầy đủ
            </button>
            <span className="text-xs text-[var(--muted)]">
              {backupRequested ? "Đã yêu cầu tải sao lưu; kiểm tra thư mục Downloads trước khi xử lý." : "Bắt buộc sao lưu trước khi chọn một phiên bản."}
            </span>
          </div>
          {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600">{error}</p>}
          {conflicts.map(({ id, item, website }) => {
            const changed = item.question.isDeleted ? ["Bản cục bộ đánh dấu xóa"] : changedFields(item.question, website);
            const alreadyDraft = Boolean(drafts[id]);
            return (
              <section key={id} aria-label={"Xung đột " + id} className="space-y-3 rounded-xl border border-[var(--border)] p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{id}</p>
                  {alreadyDraft && <span className="text-xs font-semibold text-amber-600">Đã có bản nháp riêng</span>}
                </div>
                <p className="text-xs text-[var(--muted)]">Khác biệt: {changed.length > 0 ? changed.join(", ") : "Khác biệt phiên bản nền / trạng thái xóa"}</p>
                <div className="grid min-w-0 gap-3 md:grid-cols-2">
                  <div className="min-w-0 space-y-2 rounded-xl border border-[var(--border)] p-3">
                    <p className="text-xs font-bold uppercase text-[var(--muted)]">Đã xuất bản · Lưu trên máy</p>
                    {item.question.isDeleted ? <p className="italic text-rose-600">Đã đánh dấu xóa câu hỏi</p> :
                      <VersionContent question={item.question} missing="Không có bản cục bộ" />}
                  </div>
                  <div className="min-w-0 space-y-2 rounded-xl border border-[var(--border)] p-3">
                    <p className="text-xs font-bold uppercase text-[var(--muted)]">Dữ liệu website hiện tại</p>
                    <VersionContent question={website} missing="Câu hỏi này không còn trên website." />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={!backupRequested} onClick={() => { void resolve(id, "website"); }}
                    className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:opacity-50">
                    Dùng bản website
                  </button>
                  <button type="button" disabled={!backupRequested || alreadyDraft} onClick={() => { void resolve(id, "draft"); }}
                    className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50">
                    Giữ bản cục bộ thành nháp
                  </button>
                </div>
                {alreadyDraft && <p className="text-xs text-[var(--muted)]">Bản nháp chưa xuất bản được giữ nguyên; hệ thống không ghi đè bản nháp này.</p>}
              </section>
            );
          })}
          <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
            <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]"><ShieldCheck className="h-4 w-4" /> Không tự động ghi lên GitHub hay D1</span>
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--foreground)] hover:bg-[var(--surface-hover)]">Đóng</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
