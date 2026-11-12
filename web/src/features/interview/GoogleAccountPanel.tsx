"use client";

import { useCallback, useEffect, useState } from "react";
import { Cloud, CloudDownload, CloudUpload, Link2Off, ShieldCheck } from "lucide-react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useAccount } from "@/lib/auth/AccountProvider";
import { readInterviewProgress } from "@/lib/interview/progress";
import { conservativeMerge, fetchGoogleProgress, getLinkedGoogleUser, isGoogleProgressLinkedTo, linkGoogleProgress, unlinkGoogleProgress, type RemoteProgress } from "@/lib/auth/googleSync";
import type { InterviewProgressState } from "@/lib/interview/types";

const empty = (p: InterviewProgressState) => Object.values(p).every(entries => Object.keys(entries).length === 0);
const equal = (a: InterviewProgressState, b: InterviewProgressState) => JSON.stringify(a) === JSON.stringify(b);
function count(p: InterviewProgressState) {
  return `${Object.keys(p.learned).length} nắm vững · ${Object.keys(p.review).length} cần ôn · ${Object.keys(p.bookmarks).length} đã lưu`;
}

export function GoogleAccountPanel() {
  const { user, loading, syncStatus } = useAccount();
  const confirm = useConfirm();
  const [remote, setRemote] = useState<RemoteProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [linked, setLinked] = useState(false);
  const refresh = useCallback(async () => {
    if (!user) return;
    const r = await fetchGoogleProgress();
    setRemote(r);
    setLinked(isGoogleProgressLinkedTo(user.id));
  }, [user]);
  useEffect(() => { if (user) queueMicrotask(() => { void refresh().catch(() => setNotice("Chưa đọc được tiến độ từ Google. Tiến độ trên máy vẫn được giữ.")); }); }, [user, refresh]);
  if (loading) return <p className="text-xs text-[var(--muted)]">Đang kiểm tra tài khoản Google...</p>;
  if (!user) return <a className="inline-flex rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white" href="/api/auth/google/start">Tiếp tục với Google</a>;

  async function choose(mode: "local" | "remote" | "conservative") {
    if (!user || !remote || busy) return;
    const other = getLinkedGoogleUser();
    if (other && other !== user.id) {
      setNotice("Trình duyệt đã liên kết tiến độ với một tài khoản Google khác. Hãy sao lưu và ngắt liên kết cũ trước khi đổi tài khoản.");
      return;
    }
    const original = readInterviewProgress();
    const merged = mode === "conservative" ? conservativeMerge(original, remote.state) : mode === "remote" ? remote.state : original;
    const ok = await confirm({
      title: "Liên kết tiến độ với tài khoản Google?",
      message: `Tiến độ máy: ${count(original)}. Tiến độ Google: ${count(remote.state)}. Kết quả lựa chọn: ${count(merged)}. Hệ thống sao lưu tiến độ trên máy trước khi thay đổi. Sau khi liên kết, Google trở thành nguồn đồng bộ tự động, mã 64 ký tự chỉ còn dùng để phục hồi.`,
      confirmText: "Sao lưu và liên kết",
      cancelText: "Hủy",
      variant: "warning",
    });
    if (!ok) return;
    if (!equal(readInterviewProgress(), original)) {
      setNotice("Tiến độ trên máy vừa thay đổi. Hãy đối chiếu và thử lại.");
      return;
    }
    setBusy(true);
    try {
      await linkGoogleProgress(user.id, mode, remote);
      await refresh();
      setNotice("Đã liên kết an toàn. Những thay đổi tiếp theo sẽ được tự đồng bộ qua Google và Cloudflare D1.");
    } catch (e) {
      setNotice(e instanceof Error && e.message === "VERSION_CONFLICT"
        ? "Dữ liệu Google đã thay đổi ở thiết bị khác. Hãy tải lại để đối chiếu trước khi thử tiếp."
        : "Chưa thể liên kết. Bản tiến độ trên máy vẫn được bảo lưu; hãy kiểm tra bộ nhớ hoặc kết nối mạng.");
    } finally { setBusy(false); }
  }
  async function detach() {
    if (!user || busy) return;
    const ok = await confirm({
      title: "Dừng đồng bộ với tài khoản Google?",
      message: "Chỉ gỡ liên kết trên thiết bị này. Dữ liệu Google, tiến độ localStorage, mã đồng bộ cũ và các bản nháp không bị xóa. Sau đó bạn có thể đối chiếu và liên kết lại.",
      confirmText: "Dừng đồng bộ trên thiết bị",
      cancelText: "Giữ liên kết",
      variant: "warning",
    });
    if (!ok) return;
    unlinkGoogleProgress(user.id);
    setLinked(false);
    await refresh().catch(() => undefined);
  }
  const local = readInterviewProgress();
  const remoteDiffers = remote && !equal(local, remote.state);
  const linkOther = getLinkedGoogleUser() && !linked;
  return (
    <section id="sync" aria-label="Đồng bộ Google" className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-indigo-500" /><h2 className="text-base font-semibold">Đồng bộ với tài khoản Google</h2></div>
      <p className="text-xs text-[var(--muted-strong)]">Tài khoản: {user.email}. Tiến độ học tập được tự lưu lên D1 sau khi bạn xác nhận liên kết lần đầu. Không xóa hoặc ghi đè tiến độ cũ khi đăng nhập.</p>
      <div className="grid gap-2 sm:grid-cols-2 text-xs">
        <div className="rounded-lg border border-[var(--border)] p-3"><p className="font-semibold">Trên thiết bị</p><p className="mt-1 text-[var(--muted-strong)]">{count(local)}</p></div>
        <div className="rounded-lg border border-[var(--border)] p-3"><p className="font-semibold">Trên Google (Cloudflare D1)</p><p className="mt-1 text-[var(--muted-strong)]">{remote ? count(remote.state) : "Chưa tải được"}</p></div>
      </div>
      {linked ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400"><Cloud className="mr-1 inline h-4 w-4" /> {syncStatus === "synced" ? "Đã đồng bộ" : syncStatus === "syncing" ? "Đang đồng bộ" : syncStatus === "offline" ? "Mất mạng — dữ liệu máy vẫn được giữ" : syncStatus === "conflict" ? "Có xung đột — cần đối chiếu" : "Đã liên kết"}</p>
          {syncStatus === "conflict" && <p className="text-xs text-amber-600">Hai thiết bị đã thay đổi dữ liệu khác nhau. Không tự ghi đè. Chọn Dừng đồng bộ trên thiết bị rồi đối chiếu để quyết định.</p>}
          <button type="button" onClick={() => void detach()} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold"><Link2Off className="h-4 w-4" /> Dừng đồng bộ để đối chiếu</button>
        </div>
      ) : (
        <div className="space-y-3">
          {linkOther && <p className="text-xs text-amber-600">Trình duyệt đang giữ liên kết với tài khoản khác; vui lòng đăng nhập lại tài khoản cũ để ngắt liên kết an toàn.</p>}
          {!linkOther && remote && (
            <div className="flex flex-wrap gap-2">
              {(remote.revision === 0 || !remoteDiffers) &&
                <button type="button" onClick={() => void choose("local")} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold"><CloudUpload className="h-4 w-4" /> {remote.revision === 0 ? "Lưu máy lên Google và liên kết" : "Liên kết dữ liệu đang khớp"}</button>}
              {remote.revision > 0 && <button type="button" onClick={() => void choose("remote")} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold"><CloudDownload className="h-4 w-4" /> Dùng bản Google (sao lưu bản máy)</button>}
              {remote.revision > 0 && remoteDiffers && !empty(local) && <button type="button" onClick={() => void choose("conservative")} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-amber-500/50 px-3 py-2 text-xs font-semibold text-amber-600">Hợp nhất thận trọng (ưu tiên Cần ôn)</button>}
            </div>
          )}
          <p className="text-xs text-[var(--muted-strong)]">Liên kết một lần trước khi bật đồng bộ tự động. Nếu chọn hợp nhất, những câu có trạng thái chưa nhất quán sẽ chuyển thành Cần ôn thay vì tự đánh dấu Nắm vững.</p>
        </div>
      )}
      <button type="button" onClick={() => void refresh().catch(() => setNotice("Không thể tải lại tiến độ Google."))} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Tải lại dữ liệu Google</button>
      {notice && <p role="status" className="text-xs text-[var(--muted-strong)]">{notice}</p>}
    </section>
  );
}
