"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { GoogleAccount } from "./googleOAuth";
import { googleLoginHref } from "./loginReturn";
import { GOOGLE_SYNC_STATUS, emitGoogleSync, classifyGoogleSyncError, ensureAutoLinkedGoogleProgress, prepareGoogleDevice, setGoogleSessionActive, type GoogleSyncStatus } from "./googleSync";
import { reconcileLearningProgress } from "./learningSync";

export type SessionStatus = "checking" | "authenticated" | "guest" | "offline" | "expired";
interface AccountValue {
  user: GoogleAccount | null;
  loading: boolean;
  sessionStatus: SessionStatus;
  refresh: () => Promise<void>;
  logout: () => Promise<boolean>;
  syncStatus: GoogleSyncStatus;
  syncConfirmedAt: number;
  requestLogin: () => void;
}
const AccountContext = createContext<AccountValue | null>(null);

function ProgressAutoSync({ userId, setStatus, onSessionInvalid }: { userId: string | null; setStatus: (status: GoogleSyncStatus) => void; onSessionInvalid: () => Promise<void> }) {
  useEffect(() => {
    if (!userId) return;
    let active = true;
    let busy = false;
    let replay = false;
    let lastReconciledAt = 0;
    try { prepareGoogleDevice(userId); }
    catch { setStatus("conflict"); return; }
    let timeout: ReturnType<typeof setTimeout> | null = null;
    async function sync() {
      if (!active || !userId) return;
      if (busy) { replay = true; return; }
      busy = true;
      lastReconciledAt = Date.now();
      try {
        do {
          replay = false;
          setStatus("syncing");
          const results: GoogleSyncStatus[] = [];
          for (const operation of [
            () => ensureAutoLinkedGoogleProgress(userId),
            () => reconcileLearningProgress("courses", userId),
            () => reconcileLearningProgress("top150", userId),
          ]) {
            try { results.push(await operation()); }
            catch (e) { results.push(classifyGoogleSyncError(e)); }
          }
          if (!active) return;
          const result: GoogleSyncStatus = results.includes("auth-required") ? "auth-required"
            : results.includes("forbidden") ? "forbidden"
              : results.includes("conflict") ? "conflict"
                : results.includes("offline") ? "offline"
                  : results.includes("syncing") ? "syncing" : "synced";
          if (result === "auth-required") void onSessionInvalid();
          setStatus(result);
          if (result === "syncing") replay = true;
        } while (replay && active);
      } finally { busy = false; }
    }
    function schedule() {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(() => { timeout = null; void sync(); }, 700);
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || ["quantavault_google_linked_user_v1", "interview-prep-progress-v1", "quantavault-course-progress:v1", "leetcode-top150-progress:v1"].includes(e.key)) schedule();
    };
    const onLink = () => schedule();
    const onFocus = () => { if (Date.now() - lastReconciledAt >= 60_000) schedule(); };
    const onOnline = () => schedule();
    window.addEventListener("interview-prep-progress:change", schedule);
    window.addEventListener("quantavault-course-progress:change", schedule);
    window.addEventListener("leetcode-top150-progress:change", schedule);
    window.addEventListener("storage", onStorage);
    window.addEventListener("online", onOnline);
    window.addEventListener("focus", onFocus);
    window.addEventListener(GOOGLE_SYNC_STATUS, onLink);
    schedule();
    return () => {
      active = false;
      if (timeout !== null) clearTimeout(timeout);
      window.removeEventListener("interview-prep-progress:change", schedule);
      window.removeEventListener("quantavault-course-progress:change", schedule);
      window.removeEventListener("leetcode-top150-progress:change", schedule);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(GOOGLE_SYNC_STATUS, onLink);
    };
  }, [userId, setStatus, onSessionInvalid]);
  return null;
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("checking");
  const lastSessionCheck = useRef(0);
  const [syncStatus, setSyncStatus] = useState<GoogleSyncStatus>("unlinked");
  const [syncConfirmedAt, setSyncConfirmedAt] = useState(0);
  const reportSyncStatus = useCallback((status: GoogleSyncStatus) => {
    setSyncStatus(status);
    if (status === "synced") setSyncConfirmedAt(Date.now());
  }, []);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    lastSessionCheck.current = Date.now();
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" });
      if (response.status === 401 || response.status === 403) {
        setGoogleSessionActive(false);
        setUser(null);
        setSessionStatus("expired");
        return;
      }
      if (!response.ok) throw new Error("SESSION_READ_FAILED");
      const data = await response.json() as { ok: boolean; user: GoogleAccount | null };
      if (!data.ok) throw new Error("SESSION_INVALID");
      setGoogleSessionActive(Boolean(data.user));
      setUser(data.user);
      setSessionStatus(previous => data.user ? "authenticated" : (previous === "authenticated" || previous === "offline" ? "expired" : "guest"));
    } catch {
      // A failed network request is not proof of a sign-out. Retain the last verified in-memory identity.
      // On a fresh offline reload the user stays null and progress writes remain locked.
      setSessionStatus("offline");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { queueMicrotask(() => { void refresh(); }); }, [refresh]);
  useEffect(() => {
    const onOnline = () => { void refresh(); };
    const onFocus = () => { if (Date.now() - lastSessionCheck.current >= 60_000) void refresh(); };
    window.addEventListener("online", onOnline);
    window.addEventListener("focus", onFocus);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("focus", onFocus); };
  }, [refresh]);
  useEffect(() => {
    const url = new URL(window.location.href);
    const reason = url.searchParams.get("authError");
    if (!reason) return;
    const messages: Record<string, string> = {
      cancelled: "Bạn đã hủy đăng nhập Google. Nội dung đang học vẫn được giữ nguyên.",
      expired: "Phiên xác thực đã hết hạn hoặc không hợp lệ. Vui lòng thử lại.",
      unavailable: "Chưa thể đăng nhập với Google. Vui lòng thử lại sau.",
    };
    queueMicrotask(() => setAuthError(messages[reason] ?? messages.unavailable));
    url.searchParams.delete("authError");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, []);
  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (!response.ok) return false;
      setGoogleSessionActive(false);
      setUser(null);
      setSessionStatus("guest");
      emitGoogleSync("unlinked");
      setSyncStatus("unlinked");
      return true;
    } catch { return false; }
  }, []);
  return (
    <AccountContext.Provider value={{ user, loading, sessionStatus, refresh, logout, syncStatus, syncConfirmedAt, requestLogin: () => setAuthPromptOpen(true) }}>
      <ProgressAutoSync userId={user?.id ?? null} setStatus={reportSyncStatus} onSessionInvalid={refresh} />
      {children}
      {(sessionStatus === "offline" || sessionStatus === "expired") && !authPromptOpen && <div role="status" className="pointer-events-none fixed bottom-3 right-3 z-[40] w-[min(92vw,360px)] rounded-xl border border-amber-500/40 bg-[var(--surface)] px-4 py-3 shadow-lg">
        <p className="text-sm font-semibold text-[var(--foreground)]">{sessionStatus === "offline" ? "Chưa thể xác minh phiên Google" : "Phiên Google đã hết hạn"}</p>
        <p className="mt-1 text-xs text-[var(--muted-strong)]">{sessionStatus === "offline" ? (user ? "Không có kết nối. Tiến độ trên máy vẫn được giữ; đồng bộ sẽ thử lại khi có mạng." : "Bạn vẫn có thể đọc nội dung, nhưng chưa thể lưu tiến độ trước khi xác minh.") : "Bạn có thể đăng nhập lại mà không xóa bản nháp trên thiết bị."}</p>
        <button type="button" className="pointer-events-auto mt-2 text-xs font-bold text-[var(--primary-strong)]" onClick={() => sessionStatus === "offline" ? void refresh() : setAuthPromptOpen(true)}>{sessionStatus === "offline" ? "Thử kết nối lại" : "Đăng nhập lại"}</button>
      </div>}
      {authError && <div role="alert" className="fixed bottom-5 left-1/2 z-[150] w-[min(94vw,500px)] -translate-x-1/2 rounded-2xl border border-amber-500/40 bg-[var(--surface)] p-4 shadow-2xl">
        <p className="text-sm text-[var(--foreground)]">{authError}</p>
        <div className="mt-3 flex justify-end gap-3">
          <button type="button" className="text-sm font-medium text-[var(--muted)]" onClick={() => setAuthError(null)}>Đóng</button>
          <button type="button" className="text-sm font-semibold text-[var(--primary-strong)]" onClick={() => window.location.assign(googleLoginHref())}>Thử đăng nhập lại</button>
        </div>
      </div>}
      {authPromptOpen && <div role="presentation" className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 p-4" onKeyDown={event => { if (event.key === "Escape") setAuthPromptOpen(false); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="qv-auth-title" aria-describedby="qv-auth-description" className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
          <h2 id="qv-auth-title" className="text-lg font-bold text-[var(--foreground)]">Đăng nhập để lưu tiến độ</h2>
          <p id="qv-auth-description" className="mt-3 text-sm text-[var(--muted-strong)]">Bạn có thể đọc và luyện tập mà không cần đăng nhập. Để đánh dấu, ghi chú và đồng bộ giữa các thiết bị, hãy tiếp tục với Google. Đăng nhập xong bạn sẽ trở lại đúng trang này; thao tác vừa bấm sẽ không tự thực hiện.</p>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={() => setAuthPromptOpen(false)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium">Để sau</button>
            <button type="button" autoFocus onClick={() => window.location.assign(googleLoginHref())} className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">Tiếp tục với Google</button>
          </div>
        </div>
      </div>}
    </AccountContext.Provider>
  );
}
export function useAccount(): AccountValue {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}
