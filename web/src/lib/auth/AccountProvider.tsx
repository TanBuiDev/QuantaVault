"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { GoogleAccount } from "./googleOAuth";
import { GOOGLE_SYNC_STATUS, emitGoogleSync, ensureAutoLinkedGoogleProgress, prepareGoogleDevice, setGoogleSessionActive, type GoogleSyncStatus } from "./googleSync";
import { reconcileLearningProgress } from "./learningSync";

interface AccountValue {
  user: GoogleAccount | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<boolean>;
  syncStatus: GoogleSyncStatus;
}
const AccountContext = createContext<AccountValue | null>(null);

function ProgressAutoSync({ userId, setStatus }: { userId: string | null; setStatus: (status: GoogleSyncStatus) => void }) {
  useEffect(() => {
    if (!userId) return;
    let active = true;
    let busy = false;
    let replay = false;
    try { prepareGoogleDevice(userId); }
    catch { setStatus("conflict"); return; }
    let timeout: ReturnType<typeof setTimeout> | null = null;
    async function sync() {
      if (!active || !userId) return;
      if (busy) { replay = true; return; }
      busy = true;
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
            catch (e) { results.push(e instanceof Error && ["VERSION_CONFLICT", "ACCOUNT_SWITCHED"].includes(e.message) ? "conflict" : "offline"); }
          }
          if (!active) return;
          const result: GoogleSyncStatus = results.includes("conflict") ? "conflict"
            : results.includes("offline") ? "offline"
              : results.includes("syncing") ? "syncing" : "synced";
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
    const onFocus = () => schedule();
    window.addEventListener("interview-prep-progress:change", schedule);
    window.addEventListener("quantavault-course-progress:change", schedule);
    window.addEventListener("leetcode-top150-progress:change", schedule);
    window.addEventListener("storage", onStorage);
    window.addEventListener("online", onFocus);
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
      window.removeEventListener("online", onFocus);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(GOOGLE_SYNC_STATUS, onLink);
    };
  }, [userId, setStatus]);
  return null;
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<GoogleSyncStatus>("unlinked");
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error("SESSION_READ_FAILED");
      const data = await response.json() as { ok: boolean; user: GoogleAccount | null };
      if (!data.ok) throw new Error("SESSION_INVALID");
      setGoogleSessionActive(Boolean(data.user));
      setUser(data.user);
    } catch {
      setGoogleSessionActive(false);
      setUser(null);
    }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { queueMicrotask(() => { void refresh(); }); }, [refresh]);
  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (!response.ok) return false;
      setGoogleSessionActive(false);
      setUser(null);
      emitGoogleSync("unlinked");
      setSyncStatus("unlinked");
      return true;
    } catch { return false; }
  }, []);
  return (
    <AccountContext.Provider value={{ user, loading, refresh, logout, syncStatus }}>
      <ProgressAutoSync userId={user?.id ?? null} setStatus={setSyncStatus} />
      {children}
    </AccountContext.Provider>
  );
}
export function useAccount(): AccountValue {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}
