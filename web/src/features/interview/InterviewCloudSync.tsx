"use client";

import { useEffect, useState } from "react";
import { Cloud, Copy, Download, Upload, Link2Off, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { isGoogleProgressLinked } from "@/lib/auth/googleSync";
import { readInterviewProgress, replaceInterviewProgress } from "@/lib/interview/progress";
import {
  CLOUD_SYNC_EVENT, downloadCloudProgress, generateSyncCode, getSyncCode,
  getSyncedBaseline, rememberCloudState, resetCloudWriteQueue, setSyncCode,
  uploadCloudProgress, type SyncStatus,
} from "@/lib/interview/cloudSync";

export function InterviewCloudSync() {
  const confirm = useConfirm();
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState("");
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onStatus = (event: Event) => {
      const status = (event as CustomEvent<SyncStatus>).detail;
      if (status === "saved") setMessage("Đã lưu thay đổi lên Cloudflare D1.");
      if (status === "conflict") setMessage("Xung đột phiên bản: dữ liệu trên thiết bị vẫn còn. Hãy tải từ cloud hoặc chủ động ghi đè.");
      if (status === "offline") setMessage("Chưa thể đồng bộ. Tiến độ vẫn an toàn trong trình duyệt; hãy thử đẩy lên lại.");
    };
    window.addEventListener(CLOUD_SYNC_EVENT, onStatus);

    // Returning to the page with no local edits: safely refresh from the cloud.
    // Unsynced local changes are NEVER replaced automatically.
    if (isGoogleProgressLinked()) return () => window.removeEventListener(CLOUD_SYNC_EVENT, onStatus);
    const connected = getSyncCode();
    const baseline = getSyncedBaseline();
    if (connected && baseline && JSON.stringify(readInterviewProgress()) === baseline) {
      void downloadCloudProgress(connected).then(remote => {
        if (getSyncCode() !== connected || JSON.stringify(readInterviewProgress()) !== baseline) return;
        replaceInterviewProgress(remote.state);
        rememberCloudState(remote.state, remote.revision);
        resetCloudWriteQueue();
      }).catch(() => {
        setMessage("Không thể làm mới tiến độ từ cloud; vẫn dùng bản lưu trên máy.");
      });
    }
    return () => window.removeEventListener(CLOUD_SYNC_EVENT, onStatus);
  }, []);

  const open = () => {
    if (!expanded) {
      const current = getSyncCode();
      setCode(current ?? "");
      setActiveCode(current);
    }
    setExpanded(!expanded);
  };

  const generate = () => {
    const next = generateSyncCode();
    if (!setSyncCode(next)) { setMessage("Trình duyệt không cho phép lưu mã. Hãy bật lưu trữ website."); return; }
    resetCloudWriteQueue();
    setCode(next);
    setActiveCode(next);
    setMessage("Đã tạo mã riêng. Hãy sao chép và cất giữ mã, sau đó chọn “Đẩy từ máy lên”.");
  };

  const connect = () => {
    const next = code.trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(next)) { setMessage("Mã đồng bộ phải gồm đúng 64 ký tự hex."); return; }
    if (!setSyncCode(next)) { setMessage("Không thể lưu mã trong trình duyệt."); return; }
    resetCloudWriteQueue();
    setActiveCode(next);
    setCode(next);
    setMessage("Đã nhận mã. Chọn “Tải cloud về” để lấy tiến độ từ thiết bị khác; dữ liệu trên máy chưa bị thay đổi.");
  };

  const copyCode = async () => {
    if (!activeCode) return;
    try { await navigator.clipboard.writeText(activeCode); setMessage("Đã sao chép mã. Hãy giữ kín như mật khẩu."); }
    catch { setMessage("Không sao chép tự động được; hãy chọn và sao chép mã ở ô phía trên."); }
  };

  const upload = async () => {
    if (!activeCode || busy) return;
    const accepted = await confirm({
      title: "Đẩy tiến độ từ máy lên cloud?",
      message: "Thao tác này THAY THẾ bản tiến độ đang lưu trên Cloudflare bằng bản hiện tại trong trình duyệt. Hãy chọn “Tải cloud về” nếu thiết bị khác có bản mới hơn.",
      confirmText: "Đẩy từ máy lên",
      cancelText: "Hủy",
      variant: "warning",
    });
    if (!accepted) return;
    setBusy(true);
    try {
      const state = readInterviewProgress();
      const revision = await uploadCloudProgress(activeCode, state, 0, true);
      rememberCloudState(state, revision);
      resetCloudWriteQueue();
      setMessage("Đã đẩy tiến độ lên Cloudflare D1. Các thay đổi tiếp theo sẽ được tự lưu khi có mạng.");
    } catch {
      setMessage("Không thể lưu lên cloud. Bản trên máy vẫn còn nguyên.");
    } finally { setBusy(false); }
  };

  const download = async () => {
    if (!activeCode || busy) return;
    setBusy(true);
    try {
      const remote = await downloadCloudProgress(activeCode);
      const local = readInterviewProgress();
      if (JSON.stringify(local) !== JSON.stringify(remote.state)) {
        const accepted = await confirm({
          title: "Tải tiến độ từ cloud về máy?",
          message: "Tiến độ trên máy hiện tại sẽ được thay bằng bản từ Cloudflare. Nếu muốn giữ bản hiện tại, hãy bấm Hủy rồi chọn “Đẩy từ máy lên”.",
          confirmText: "Tải cloud về",
          cancelText: "Giữ bản trên máy",
          variant: "warning",
        });
        if (!accepted) return;
      }
      replaceInterviewProgress(remote.state);
      rememberCloudState(remote.state, remote.revision);
      resetCloudWriteQueue();
      setMessage("Đã tải tiến độ từ Cloudflare về máy. Các thay đổi sau đó sẽ tự đồng bộ.");
    } catch {
      setMessage("Không tải được tiến độ. Bản trên máy vẫn nguyên vẹn.");
    } finally { setBusy(false); }
  };

  const disconnect = () => {
    setSyncCode(null);
    resetCloudWriteQueue();
    setActiveCode(null);
    setCode("");
    setMessage("Đã ngắt kết nối. Tiến độ trên máy và dữ liệu đã lưu trên cloud không bị xóa.");
  };

  return (
    <section aria-label="Đồng bộ tiến độ học tập" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
      <button type="button" onClick={open} aria-expanded={expanded} className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-[var(--foreground)]">
        <span className="inline-flex items-center gap-2"><Cloud className="h-4 w-4 text-indigo-500" /> Đồng bộ tiến độ giữa các thiết bị</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-[var(--border)] pt-3">
          <p className="text-xs leading-relaxed text-[var(--muted-strong)]">
            Dùng mã đồng bộ riêng để lưu Nắm vững / Cần ôn / Đã lưu vào Cloudflare D1.
            Mở trên thiết bị khác và nhập cùng mã để tải lại tiến độ. Không cần tài khoản;
            mã này chính là chìa khóa truy cập dữ liệu, hãy bảo mật và sao lưu.
          </p>
          <label className="block space-y-1 text-xs font-semibold text-[var(--muted-strong)]">
            <span>Mã đồng bộ bí mật (64 ký tự)</span>
            <input type="password" value={code} onChange={e => setCode(e.target.value)} autoComplete="off"
              placeholder="Tạo mã mới hoặc nhập mã đã có"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 font-mono text-xs text-[var(--foreground)]" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={generate} disabled={busy} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)]">Tạo mã mới</button>
            <button type="button" onClick={connect} disabled={busy} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)]">Dùng mã đã có</button>
            <button type="button" onClick={() => void copyCode()} disabled={!activeCode || busy} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--foreground)] disabled:opacity-40 hover:bg-[var(--surface-hover)]"><Copy className="h-3.5 w-3.5" /> Sao chép mã</button>
          </div>
          {activeCode && (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void download()} disabled={busy} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Download className="h-3.5 w-3.5" /> Tải cloud về máy</button>
              <button type="button" onClick={() => void upload()} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/40 px-3 py-2 text-xs font-bold text-[var(--foreground)] disabled:opacity-50 hover:bg-indigo-500/10"><Upload className="h-3.5 w-3.5" /> Đẩy từ máy lên</button>
              <button type="button" onClick={disconnect} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted-strong)] disabled:opacity-50"><Link2Off className="h-3.5 w-3.5" /> Ngắt kết nối</button>
            </div>
          )}
          <p className="flex items-start gap-1.5 text-[11px] text-[var(--muted)]"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Chỉ mã băm của mã đồng bộ được dùng làm định danh trong D1. Không lưu mã gốc trên server. Dữ liệu localStorage luôn được giữ cho đến khi bạn chủ động tải cloud về.</p>
          {message && <p role="status" className="rounded-lg bg-indigo-500/10 px-3 py-2 text-xs text-[var(--foreground)]">{message}</p>}
        </div>
      )}
    </section>
  );
}
