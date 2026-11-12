"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { GoogleAccount } from "./googleOAuth";
import { GOOGLE_SYNC_STATUS, emitGoogleSync, isGoogleProgressLinkedTo, reconcileGoogleProgress, type GoogleSyncStatus } from "./googleSync";

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
    let timeout: ReturnType<typeof setTimeout> | null = null;
    async function sync() {
      if (!active || !userId || !isGoogleProgressLinkedTo(userId)) return;
      if (busy) { replay = true; return; }
      busy = true;
      try {
        do {
          replay = false;
          setStatus("syncing");
          try {
            const result = await reconcileGoogleProgress(userId);
            if (!active) return;
            setStatus(result);
            if (result === "conflict") return;
            if (result === "syncing") replay = true;
          } catch (e) {
            if (!active) return;
            setStatus(e instanceof Error && e.message === "VERSION_CONFLICT" ? "conflict" : "offline");
            return;
          }
        } while (replay && active);
      } finally { busy = false; }
    }
    function schedule() {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(() => { timeout = null; void sync(); }, 700);
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || ["quantavault_google_linked_user_v1", "interview-prep-progress-v1"].includes(e.key)) schedule();
    };
    const onLink = () => {
      if (isGoogleProgressLinkedTo(userId)) schedule();
      else setStatus("unlinked");
    };
    const onFocus = () => schedule();
    window.addEventListener("interview-prep-progress:change", schedule);
    window.addEventListener("storage", onStorage);
    window.addEventListener("online", onFocus);
    window.addEventListener("focus", onFocus);
    window.addEventListener(GOOGLE_SYNC_STATUS, onLink);
    if (isGoogleProgressLinkedTo(userId)) schedule();
    return () => {
      active = false;
      if (timeout !== null) clearTimeout(timeout);
      window.removeEventListener("interview-prep-progress:change", schedule);
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
      setUser(data.user);
    } catch { setUser(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: "{}" });
      if (!response.ok) return false;
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
