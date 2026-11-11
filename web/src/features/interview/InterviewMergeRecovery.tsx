"use client";

import { useMemo, useState } from "react";
import { Download, ShieldAlert } from "lucide-react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import type { InterviewProgressState } from "@/lib/interview/types";
import type { DraftMap, PublishedCacheMap } from "@/lib/interview/draftStore";
import { downloadRetiredInterviewBackup } from "@/lib/interview/draftStore";
import {
  inspectRetiredProgress, isRetiredInterviewId, retiredInterviewIds,
  archiveProgressBeforeMerge, mergeApprovedRetiredProgress,
} from "@/lib/interview/questionIdMerge";
import { readInterviewProgress, replaceInterviewProgress } from "@/lib/interview/progress";
import { queueCloudProgress } from "@/lib/interview/cloudSync";

interface Props {
  progress: InterviewProgressState;
  drafts: DraftMap;
  publishedCache: PublishedCacheMap;
}

export function InterviewMergeRecovery({ progress, drafts, publishedCache }: Props) {
  const confirm = useConfirm();
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const pending = useMemo(() => inspectRetiredProgress(progress), [progress]);
  const archivedDraftIds = Object.keys(drafts).filter(isRetiredInterviewId);
  const archivedCacheIds = Object.keys(publishedCache).filter(isRetiredInterviewId);
  const archivedIds = new Set([...archivedDraftIds, ...archivedCacheIds]);
  const uncertainLearned = useMemo(() => {
    const byTarget = new Map<string, string[]>();
    for (const [oldId, target] of Object.entries(retiredInterviewIds)) {
      byTarget.set(target, [...(byTarget.get(target) ?? []), oldId]);
    }
    return [...byTarget.entries()].filter(([target, sources]) =>
      Boolean(progress.learned[target]) && sources.some(id => !progress.learned[id])
    ).map(([target]) => target);
  }, [progress]);

  function exportProgressBackup() {
    try {
      const data = {
        format: "quantavault-interview-merge-full-local-backup-v1",
        createdAt: new Date().toISOString(),
        progress: readInterviewProgress(),
        retiredDrafts: Object.fromEntries(Object.entries(drafts).filter(([id]) => isRetiredInterviewId(id))),
        retiredPublishedCache: Object.fromEntries(Object.entries(publishedCache).filter(([id]) => isRetiredInterviewId(id))),
        // No sync code, no bearer tokens are included.
      };
      const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quantavault-interview-premerge-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(link);
      try { link.click(); } finally { document.body.removeChild(link); URL.revokeObjectURL(url); }
    } catch {
      setMessage("Không thể xuất bản sao lưu. Tiến độ và bản nháp chưa bị thay đổi.");
    }
  }

  async function applySelected() {
    if (selected.length === 0) return;
    const before = readInterviewProgress();
    if (JSON.stringify(before) !== JSON.stringify(progress)) {
      setMessage("Tiến độ vừa thay đổi ở tab khác hoặc khi đồng bộ. Hãy chọn lại sau khi kiểm tra.");
      setSelected([]);
      return;
    }
    const currentIds = new Set(inspectRetiredProgress(before).map(entry => entry.oldId));
    const approved = selected.filter(id => currentIds.has(id));
    if (!approved.length) return;
    const ambiguous = pending.filter(e => approved.includes(e.oldId) && e.historicalTarget);
    const ok = await confirm({
      title: "Xác nhận hợp nhất tiến độ câu hỏi?",
      message: `Sẽ chuyển trạng thái của ${approved.length} ID bạn đã chọn sang câu chính, ưu tiên Cần ôn khi chưa chắc đã nắm vững toàn bộ. ${ambiguous.length} ID có tên trùng ánh xạ lịch sử (ví dụ ${ambiguous[0]?.oldId ?? "không có"}): chỉ tiếp tục nếu bạn xác nhận chúng là ID câu hiện hành. Bản gốc được lưu trước, D1 không bị sửa nếu phiên đồng bộ xung đột.`,
      confirmText: "Lưu bản gốc và hợp nhất",
      cancelText: "Giữ nguyên",
      variant: "warning",
    });
    if (!ok) return;
    if (JSON.stringify(readInterviewProgress()) !== JSON.stringify(before)) {
      setMessage("Dữ liệu đã thay đổi trong khi xác nhận. Chưa hợp nhất để tránh ghi đè.");
      return;
    }
    try {
      const next = mergeApprovedRetiredProgress(before, approved);
      archiveProgressBeforeMerge(before);
      replaceInterviewProgress(next);
      queueCloudProgress(next); // Uses current revision; a 409 never overwrites the remote account.
      setSelected([]);
      setMessage("Đã chuyển các ID đã xác nhận. Bản tiến độ trước gộp được lưu trên thiết bị; hãy lưu thêm file sao lưu để dự phòng.");
    } catch {
      setMessage("Không thể lưu bản gốc hoặc dữ liệu mới. Thao tác đã dừng; hãy kiểm tra bộ nhớ trình duyệt.");
    }
  }

  if (pending.length === 0 && archivedIds.size === 0 && uncertainLearned.length === 0) return null;
  return (
    <section aria-label="Khôi phục và hợp nhất câu hỏi cũ" className="rounded-2xl border border-amber-500/40 bg-[var(--surface)] p-4 space-y-3">
      <div className="flex items-start gap-2">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div>
          <p className="font-semibold text-sm text-[var(--foreground)]">Đối chiếu sau hợp nhất câu hỏi</p>
          <p className="text-xs text-[var(--muted-strong)]">
            Hệ thống giữ nguyên bản nháp và tiến độ cũ. Không tự chuyển những ID có thể trùng lịch sử.
          </p>
        </div>
      </div>
      {pending.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold">Có {pending.length} ID tiến độ cũ cần bạn đối chiếu:</p>
          <div className="max-h-52 overflow-auto space-y-1">
            {pending.map(entry => (
              <label key={entry.oldId} className="flex items-start gap-2 rounded-lg border border-[var(--border)] px-2 py-2 text-xs">
                <input
                  type="checkbox"
                  aria-label={`Gộp tiến độ ${entry.oldId} vào ${entry.newId}`}
                  checked={selected.includes(entry.oldId)}
                  onChange={e => setSelected(current => e.target.checked ? [...current, entry.oldId] : current.filter(id => id !== entry.oldId))}
                  className="mt-0.5"
                />
                <span>
                  <strong>{entry.oldId} → {entry.newId}</strong>
                  {" · "}
                  {entry.learned ? "Nắm vững" : entry.review ? "Cần ôn" : "Đã lưu"}
                  {entry.bookmarked && (entry.learned || entry.review) ? " · Đã lưu" : ""}
                  {entry.historicalTarget && (
                    <span className="block text-amber-600 dark:text-amber-400">
                      ID này từng được ánh xạ sang {entry.historicalTarget}. Chỉ chọn nếu đúng là câu hiện hành.
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
          <button type="button" onClick={() => void applySelected()} disabled={selected.length === 0} className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">Hợp nhất {selected.length} ID đã chọn</button>
        </div>
      )}
      {uncertainLearned.length > 0 && (
        <p className="text-xs text-[var(--muted-strong)]">
          Có {uncertainLearned.length} câu chính đang được đánh dấu Nắm vững trong khi ít nhất một câu nguồn chưa có trạng thái Nắm vững.
          Nếu chưa học đủ nội dung sau hợp nhất, hãy mở câu đó và chọn Cần ôn. Website không tự sửa đánh giá của bạn.
        </p>
      )}
      {archivedIds.size > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--muted-strong)]">
            Có {archivedIds.size} câu đã hợp nhất còn bản nháp hoặc bản xuất bản trên máy. Những bản này không được tự xuất bản lại hay xóa.
          </p>
          <button type="button" onClick={() => downloadRetiredInterviewBackup(drafts, publishedCache)} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold"><Download className="h-3.5 w-3.5" /> Sao lưu nội dung cũ</button>
        </div>
      )}
      <button type="button" onClick={exportProgressBackup} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold"><Download className="h-3.5 w-3.5" /> Sao lưu tiến độ và bản nháp</button>
      {message && <p role="status" className="text-xs text-[var(--foreground)]">{message}</p>}
    </section>
  );
}
