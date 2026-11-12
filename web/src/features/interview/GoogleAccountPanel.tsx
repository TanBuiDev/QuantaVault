"use client";

import { useEffect, useState } from "react";
import { CloudDownload, CloudUpload, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { readInterviewProgress, replaceInterviewProgress } from "@/lib/interview/progress";
import { archiveProgressBeforeMerge } from "@/lib/interview/questionIdMerge";
import type { InterviewProgressState } from "@/lib/interview/types";

type User = { id: string; email: string; name: string };
type Remote = { ok: boolean; state: InterviewProgressState; revision: number };
function nonEmpty(state: InterviewProgressState) {
  return Object.keys(state.learned).length + Object.keys(state.review).length + Object.keys(state.bookmarks).length > 0;
}
function same(a: InterviewProgressState, b: InterviewProgressState) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function GoogleAccountPanel() {
  const confirm = useConfirm();
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let live = true;
    void fetch("/api/auth/session", { credentials: "same-origin", cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("session failed");
        return response.json() as Promise<{ user: User | null }>;
      })
      .then(data => { if (live) setUser(data.user); })
      .catch(() => { if (live) setMessage("Không thể kiểm tra phiên đăng nhập. Tiến độ trên máy vẫn được giữ."); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, []);

  async function getAccountProgress(): Promise<Remote> {
    const response = await fetch("/api/google-progress", { credentials: "same-origin", cache: "no-store" });
    if (!response.ok) throw new Error("Google progress read failed");
    const result = await response.json() as Remote;
    if (!result.ok || !result.state || !Number.isSafeInteger(result.revision)) throw new Error("invalid cloud progress");
    return result;
  }

  async function saveToAccount() {
    if (!user || busy) return;
    setBusy(true);
    try {
      const remote = await getAccountProgress();
      const local = readInterviewProgress();
      if (remote.revision !== 0) {
        setMessage(same(local, remote.state)
          ? "Tài khoản Google đã có cùng tiến độ trên máy. Không cần ghi đè."
          : "Tài khoản Google đã có tiến độ khác. Để tránh mất dữ liệu, hệ thống không tự ghi đè; hãy sao lưu và đối chiếu trước.");
        return;
      }
      if (!nonEmpty(local)) { setMessage("Máy hiện chưa có tiến độ để lưu."); return; }
      const accepted = await confirm({
        title: "Lưu tiến độ lên tài khoản Google?",
        message: "Tài khoản Google chưa có dữ liệu. Thao tác sẽ sao chép trạng thái Nắm vững, Cần ôn, Đã lưu từ trình duyệt. Mã đồng bộ cũ và dữ liệu localStorage không bị xóa.",
        confirmText: "Lưu bản tiến độ", cancelText: "Hủy", variant: "primary",
      });
      if (!accepted) return;
      if (!same(readInterviewProgress(), local)) { setMessage("Tiến độ vừa thay đổi. Hãy kiểm tra và thử lại."); return; }
      // Fail closed before any remote write if the local immutable archive cannot be stored.
      archiveProgressBeforeMerge(local);
      const response = await fetch("/api/google-progress", {
        method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: local, revision: 0 }),
      });
      if (response.status === 409) { setMessage("Tài khoản đã thay đổi trên thiết bị khác. Không ghi đè dữ liệu."); return; }
      if (!response.ok) throw new Error("cannot upload");
      setMessage("Đã lưu bản tiến độ lên tài khoản Google; bản tiến độ và mã đồng bộ cũ vẫn còn. Chưa bật đồng bộ tự động.");
    } catch {
      setMessage("Chưa thể lưu lên tài khoản Google. Tiến độ trên thiết bị vẫn còn nguyên.");
    } finally { setBusy(false); }
  }

  async function loadFromAccount() {
    if (!user || busy) return;
    setBusy(true);
    try {
      const remote = await getAccountProgress();
      if (remote.revision === 0 || !nonEmpty(remote.state)) { setMessage("Tài khoản Google chưa có tiến độ để tải."); return; }
      const current = readInterviewProgress();
      if (same(current, remote.state)) { setMessage("Tiến độ trên máy đã khớp với tài khoản Google."); return; }
      const accepted = await confirm({
        title: "Nhập tiến độ từ tài khoản Google?",
        message: "Tiến độ trên trình duyệt sẽ được thay bằng bản từ tài khoản Google. Bản hiện tại được lưu tại chỗ trước khi nhập. Mã đồng bộ riêng và dữ liệu trong bảng D1 cũ không bị thay đổi.",
        confirmText: "Sao lưu rồi nhập", cancelText: "Giữ tiến độ trên máy", variant: "warning",
      });
      if (!accepted) return;
      if (!same(readInterviewProgress(), current)) { setMessage("Tiến độ trên máy vừa thay đổi; đã dừng để tránh ghi đè."); return; }
      archiveProgressBeforeMerge(current);
      replaceInterviewProgress(remote.state);
      setMessage("Đã nhập tiến độ Google. Bản trên máy trước khi nhập đã được lưu; không tác động dữ liệu đồng bộ bằng mã riêng.");
    } catch {
      setMessage("Không thể tải tiến độ Google. Trạng thái hiện tại trên máy không bị thay đổi.");
    } finally { setBusy(false); }
  }

  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: "{}",
      });
      if (!response.ok) throw new Error("signout error");
      setUser(null);
      setMessage("Đã đăng xuất khỏi QuantaVault. Tiến độ trên máy vẫn được giữ.");
    } catch { setMessage("Không đăng xuất được. Hãy thử lại."); }
    finally { setBusy(false); }
  }

  return (
    <section id="google-account" aria-label="Tài khoản Google" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-500" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Tài khoản Google</p>
            <p className="text-xs text-[var(--muted-strong)]">
              {loading ? "Đang kiểm tra phiên đăng nhập..." : user ? `Đã đăng nhập: ${user.name} (${user.email})` : "Đăng nhập để lưu bản tiến độ riêng theo tài khoản"}
            </p>
          </div>
        </div>
        {!loading && (user
          ? <button type="button" onClick={() => void logout()} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold disabled:opacity-40"><LogOut className="h-3.5 w-3.5" /> Đăng xuất</button>
          : <a href="/api/auth/google/start" className="inline-flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white"><LogIn className="h-3.5 w-3.5" /> Tiếp tục với Google</a>)}
      </div>
      {user && (
        <>
          <p className="text-xs text-[var(--muted-strong)]">
            Tiến độ trong tài khoản Google được lưu riêng, không tự thay thế tiến độ trên thiết bị hoặc mã đồng bộ cũ.
            Khi mới đăng nhập, bạn cần chọn thao tác chuyển dữ liệu một lần.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void saveToAccount()} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold disabled:opacity-40">
              <CloudUpload className="h-3.5 w-3.5" /> Lưu tiến độ máy lên tài khoản
            </button>
            <button type="button" onClick={() => void loadFromAccount()} disabled={busy} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold disabled:opacity-40">
              <CloudDownload className="h-3.5 w-3.5" /> Tải tiến độ từ tài khoản
            </button>
          </div>
        </>
      )}
      {message && <p role="status" className="text-xs text-[var(--muted-strong)]">{message}</p>}
    </section>
  );
}
