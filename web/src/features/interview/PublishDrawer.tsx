"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
  GitCommit,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Lock,
} from "lucide-react";
import type { InterviewQuestion } from "@/lib/interview/types";
import { canonicalQuestion, questionVersion } from "@/lib/interview/questionVersion";
import type { PublishConflict } from "@/lib/interview/githubPublish";
import {
  type DraftQuestion,
  downloadQuestionsBackup,
  type PublishedCacheMap,
  rebaseDraft,
} from "@/lib/interview/draftStore";

export interface PublishDrawerProps {
  drafts: Record<string, DraftQuestion>;
  publishedCache?: PublishedCacheMap;
  canonicalQuestions?: InterviewQuestion[];
  onClearAll: () => void;
  onPublishSuccess: (submitted: Record<string, DraftQuestion>) => void;
}

export function PublishDrawer({
  drafts,
  publishedCache,
  canonicalQuestions,
  onClearAll,
  onPublishSuccess,
}: PublishDrawerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [persistenceWarning, setPersistenceWarning] = useState<string | null>(null);
  const [conflictReview, setConflictReview] = useState<{ conflicts: PublishConflict[]; submitted: Record<string, DraftQuestion> } | null>(null);
  const [retryCooldown, setRetryCooldown] = useState<number>(0);
  const [successResult, setSuccessResult] = useState<{
    commitUrl?: string;
    commitSha?: string;
    message?: string;
  } | null>(null);

  const confirm = useConfirm();

  const handleClearAllWithConfirm = async () => {
    const isConfirmed = await confirm({
      title: "Hủy bỏ toàn bộ thay đổi?",
      message: `Bạn đang có ${draftCount} câu hỏi chỉnh sửa chưa xuất bản. Bạn có chắc chắn muốn hủy tất cả và quay về dữ liệu gốc?`,
      confirmText: "Hủy tất cả thay đổi",
      cancelText: "Giữ lại",
      variant: "danger",
    });
    if (isConfirmed) {
      onClearAll();
    }
  };

  const draftList = Object.values(drafts);
  const draftCount = draftList.length;

  useEffect(() => {
    if (retryCooldown <= 0) return;
    const timer = setTimeout(() => setRetryCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [retryCooldown]);

  if (draftCount === 0 && !successResult) return null;

  async function reviewConflict(conflict: PublishConflict) {
    const expected = conflictReview?.submitted[conflict.id];
    if (!expected) return;
    const confirmed = await confirm({ title: "Dùng phiên bản mới làm nền?", message: "Giữ nguyên nội dung bạn đã chỉnh sửa và cập nhật phiên bản nền theo nội dung GitHub vừa đối chiếu. Chỉ xuất bản khi bạn tiếp tục nhập PIN, OTP và xác nhận.", confirmText: "Dùng phiên bản mới làm nền", cancelText: "Tiếp tục đối chiếu", variant: "warning" });
    if (!confirmed) return;
    try {
      rebaseDraft(conflict.id, expected, conflict.current);
      setConflictReview(current => current ? { ...current, conflicts: current.conflicts.filter(item => item.id !== conflict.id) } : null);
      setError(null); setPin(""); setOtp("");
    } catch {
      setError("Không thể cập nhật phiên bản nền: bản nháp có thể đã thay đổi ở tab khác hoặc bộ nhớ không khả dụng. Nội dung vẫn được giữ; hãy đối chiếu lại.");
    }
  }

  async function handlePublish() {
    if (retryCooldown > 0) return;

    if (!pin.trim() || !/^\d{6}$/.test(otp.trim())) {
      setError("Vui lòng nhập mã PIN quản trị và mã Google Authenticator gồm 6 số.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPersistenceWarning(null);
    setConflictReview(null);
    const submitted = structuredClone(drafts);
    const baseVersions = Object.fromEntries(Object.values(submitted).map(q => [q.id,
      q.baseVersion ?? questionVersion(canonicalQuestions?.find(original => original.id === q.id) ?? null),
    ]));

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pin: pin.trim(),
          otp: otp.trim(),
          baseVersions,
          modifiedQuestions: Object.values(submitted).map(q => ({ ...canonicalQuestion(q), ...(q.isDeleted ? { isDeleted: true } : {}) })),
          commitMessage: customMessage.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.status === 429 || data.locked) {
        const waitSec = Number(data.retryAfterSeconds) || 60;
        setRetryCooldown(waitSec);
        throw new Error(data.error || `Bạn đã nhập sai nhiều lần. Vui lòng chờ ${waitSec} giây trước khi thử lại.`);
      }

      if (!response.ok || !data.success) {
        if (response.status === 409 && Array.isArray(data.conflicts)) setConflictReview({ conflicts: data.conflicts, submitted });
        throw new Error(data.error || "Không thể xuất bản câu hỏi lên GitHub.");
      }

      try { onPublishSuccess(submitted); }
      catch { setPersistenceWarning("GitHub đã ghi thành công nhưng không thể cập nhật bộ nhớ trình duyệt. Bản nháp được giữ lại; hãy sao lưu và chờ website cập nhật, không cần xuất bản lại."); }
      setPin("");
      setOtp("");
      setCustomMessage("");
      setSuccessResult({
        commitUrl: data.commitUrl,
        commitSha: data.commitSha,
        message: data.message,
      });

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* 1. Floating Bottom Status Bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl animate-bounce-in">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-[var(--surface)]/95 p-3.5 shadow-2xl backdrop-blur-xl ring-1 ring-amber-500/20 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div className="truncate">
              <span className="font-bold text-[var(--foreground)]">
                {draftCount} câu hỏi
              </span>{" "}
              <span className="text-[var(--muted)]">đã chỉnh sửa chưa xuất bản</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearAllWithConfirm}
              title="Hủy bỏ tất cả thay đổi nháp và quay lại bản gốc"
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 font-semibold text-[var(--muted-strong)] hover:text-rose-500 hover:border-rose-500/30 transition-colors cursor-pointer"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-1.5 font-bold text-white shadow-md shadow-indigo-600/25 hover:from-indigo-500 hover:to-indigo-600 active:scale-95 transition-all"
            >
              <GitCommit className="h-4 w-4" />
              <span>Xuất bản ({draftCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Publish Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isLoading) { setIsModalOpen(false); setSuccessResult(null); setConflictReview(null); setPin(""); setOtp(""); }
        }}
        maxWidth="md"
        title="Xuất Bản"
      >
        <div className="space-y-4 pt-1 text-xs sm:text-sm">
          {/* Success Notification */}
          {successResult ? (
            <div className="space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-emerald-600 dark:text-emerald-400 animate-fade-in">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="font-bold text-base">
                {successResult.message || "Xuất bản thành công!"}
              </p>
              {successResult.commitUrl && (
                <a
                  href={successResult.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-xs underline hover:opacity-80"
                >
                  <span>Xem commit trên GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <p className="text-xs text-[var(--muted)]">
                Nội dung đã ghi lên GitHub. Website sẽ cập nhật sau khi quá trình build và triển khai thành công.
              </p>
              {persistenceWarning && <p role="status" className="rounded-lg bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300">{persistenceWarning}</p>}
              <button type="button" onClick={() => { setSuccessResult(null); setIsModalOpen(false); }} className="rounded-lg border border-[var(--border)] px-4 py-2">Đóng</button>
            </div>
          ) : (
            <>
              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-500">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {conflictReview && (
                <section aria-label="Đối chiếu xung đột" className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="font-semibold text-[var(--foreground)]">Đối chiếu nội dung trước khi xuất bản lại</p>
                  {conflictReview.conflicts.length === 0 && <p>Đã cập nhật phiên bản nền. Nội dung chỉnh sửa vẫn được giữ; hãy kiểm tra và xác thực lại để xuất bản.</p>}
                  {conflictReview.conflicts.map(conflict => {
                    const local = conflictReview.submitted[conflict.id];
                    return <div key={conflict.id} className="space-y-2 border-t border-[var(--border)] pt-2">
                      <p className="font-mono font-bold">{conflict.id}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div><p className="font-semibold">Bản chỉnh sửa đã gửi</p><pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs">{local?.isDeleted ? "Đánh dấu xóa" : JSON.stringify(canonicalQuestion(local), null, 2)}</pre></div>
                        <div><p className="font-semibold">Phiên bản trên GitHub</p>{conflict.current ? <><p>{conflict.current.title}</p><pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs">{conflict.current.answerMarkdown}</pre><details><summary>Xem toàn bộ dữ liệu</summary><pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(conflict.current, null, 2)}</pre></details></> : <p>Câu hỏi đã bị xóa trên GitHub.</p>}</div>
                      </div>
                      <button type="button" onClick={() => { void reviewConflict(conflict); }} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-semibold text-[var(--foreground)]">Đã đối chiếu, dùng nền mới</button>
                    </div>;
                  })}
                </section>
              )}

              {/* List of Modified Questions with Status Badges */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[var(--muted)] text-[11px]">
                    Danh sách câu hỏi sẽ cập nhật ({draftCount})
                  </span>
                  {canonicalQuestions && (
                    <button
                      type="button"
                      onClick={() => downloadQuestionsBackup(canonicalQuestions, drafts, publishedCache)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      title="Tải toàn bộ câu hỏi (kèm bản sửa) về máy tính dự phòng"
                    >
                      <Download className="h-3 w-3" />
                      <span>Tải file JSON dự phòng</span>
                    </button>
                  )}
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] p-2">
                  {draftList.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between gap-2 text-xs py-1 px-1.5 rounded hover:bg-[var(--surface)] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-bold text-indigo-500 shrink-0">
                          {q.id}
                        </span>
                        <span
                          className={`truncate ${
                            q.isDeleted
                              ? "line-through text-rose-500"
                              : "text-[var(--foreground)]"
                          }`}
                        >
                          {q.title}
                        </span>
                      </div>
                      {q.isDeleted ? (
                        <span className="shrink-0 rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-500">
                          Xóa
                        </span>
                      ) : (
                        <span className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                          Sửa
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="publish-pin" className="font-bold text-[var(--muted)]">Mã PIN quản trị</label>
                <input id="publish-pin" type="password" autoComplete="off" maxLength={256} value={pin} disabled={isLoading || retryCooldown > 0} onChange={e => setPin(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)]" />
              </div>

              {/* Independent second authentication factor */}
              <div className="space-y-2">
                <label htmlFor="publish-otp" className="font-bold uppercase tracking-wider text-[var(--muted)] text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Mã Google Authenticator</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Bảo mật 2 lớp
                  </span>
                </label>

                {retryCooldown > 0 ? (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <Lock className="h-4 w-4" />
                      <span>Hệ thống đang tạm khóa để bảo vệ an toàn</span>
                    </div>
                    <p className="text-[11px] text-rose-500/90 font-mono">
                      Vui lòng chờ thử lại sau: <strong>{retryCooldown}s</strong>
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="text"
                      id="publish-otp"
                      aria-label="Mã Google Authenticator"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      disabled={isLoading || retryCooldown > 0}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Nhập 6 số từ app Google Authenticator trên điện thoại..."
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-9 pr-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] transition-all font-mono tracking-wider disabled:opacity-50"
                    />
                  </div>
                )}
              </div>

              {/* Optional Custom Commit Message */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-[var(--muted)] text-[11px]">
                  Ghi chú Commit (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={`feat(interview): update ${draftCount} interview questions`}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs sm:text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => { setIsModalOpen(false); setConflictReview(null); setPin(""); setOtp(""); }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-bold text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Hủy
                </button>

                <button
                  type="button"
                  disabled={isLoading || retryCooldown > 0}
                  onClick={handlePublish}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang commit Git...</span>
                    </>
                  ) : (
                    <>
                      <GitCommit className="h-4 w-4" />
                      <span>Xác nhận & Xuất bản</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
