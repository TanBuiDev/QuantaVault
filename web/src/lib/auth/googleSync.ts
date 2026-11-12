"use client";

import type { InterviewProgressState } from "../interview/types";
import { readInterviewProgress, replaceInterviewProgress } from "../interview/progress";
import { archiveProgressBeforeMerge } from "../interview/questionIdMerge";

const LINK_KEY = "quantavault_google_linked_user_v1";
const STATE_KEY = "quantavault_google_progress_baseline_v1";
const ACTIVE_KEY = "quantavault_active_progress_account_v1";
const ACCOUNT_CACHE = "quantavault_progress_cache_by_account_v1:";
const UNOWNED_KEY = "quantavault_unowned_progress_v1:";
const STORES = [
  { kind: "interview", key: "interview-prep-progress-v1", event: "interview-prep-progress:change" },
  { kind: "courses", key: "quantavault-course-progress:v1", event: "quantavault-course-progress:change" },
  { kind: "top150", key: "leetcode-top150-progress:v1", event: "leetcode-top150-progress:change" },
] as const;
export const GOOGLE_SYNC_STATUS = "quantavault-google-sync:status";
let googleSessionActive = false;
export function setGoogleSessionActive(active: boolean): void { googleSessionActive = active; }
export function isGoogleSessionActive(): boolean { return googleSessionActive; }
export type GoogleSyncStatus = "unlinked" | "synced" | "syncing" | "offline" | "conflict";
export interface RemoteProgress { state: InterviewProgressState; revision: number }
interface SyncBaseline { userId: string; revision: number; state: InterviewProgressState }

const equal = (a: InterviewProgressState, b: InterviewProgressState): boolean => JSON.stringify(a) === JSON.stringify(b);
const empty = (): InterviewProgressState => ({ learned: {}, review: {}, bookmarks: {} });
const hasData = (s: InterviewProgressState): boolean => Object.keys(s.learned).length + Object.keys(s.review).length + Object.keys(s.bookmarks).length > 0;
function assertActiveAccount(userId: string): void {
  const active = localStorage.getItem(ACTIVE_KEY);
  if (active && active !== userId) throw new Error("ACCOUNT_SWITCHED");
}

export function isGoogleProgressLinked(): boolean {
  try { return Boolean(localStorage.getItem(LINK_KEY)); }
  catch { return false; }
}
export function isGoogleProgressLinkedTo(userId: string): boolean {
  try { return localStorage.getItem(LINK_KEY) === userId; }
  catch { return false; }
}
export function getLinkedGoogleUser(): string | null {
  try { return localStorage.getItem(LINK_KEY); } catch { return null; }
}
function readBaseline(userId: string): SyncBaseline | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SyncBaseline;
    return parsed.userId === userId && Number.isSafeInteger(parsed.revision) && parsed.revision >= 0 && parsed.state
      ? parsed : null;
  } catch { return null; }
}
function setBaseline(userId: string, remote: RemoteProgress): void {
  localStorage.setItem(STATE_KEY, JSON.stringify({ userId, revision: remote.revision, state: remote.state } satisfies SyncBaseline));
}
export function emitGoogleSync(status: GoogleSyncStatus): void {
  window.dispatchEvent(new CustomEvent(GOOGLE_SYNC_STATUS, { detail: status }));
}

/** Never let data bound to a previous Google account become the new account's local progress. */
export function prepareGoogleDevice(userId: string): void {
  const active = localStorage.getItem(ACTIVE_KEY) ?? getLinkedGoogleUser();
  if (active === userId) {
    localStorage.setItem(ACTIVE_KEY, userId);
    return;
  }
  if (active) {
    const previous = {
      values: Object.fromEntries(STORES.map(s => [s.key, localStorage.getItem(s.key)])),
      baseline: localStorage.getItem(STATE_KEY),
      linked: localStorage.getItem(LINK_KEY),
      unowned: Object.fromEntries(STORES.map(s => [s.kind, localStorage.getItem(UNOWNED_KEY + s.kind)])),
    };
    // Persist the entire previous account snapshot BEFORE modifying shared storage.
    localStorage.setItem(ACCOUNT_CACHE + active, JSON.stringify(previous));
    const saved = localStorage.getItem(ACCOUNT_CACHE + userId);
    const target = saved ? JSON.parse(saved) as typeof previous : null;
    if (target && (!target.values || typeof target.values !== "object")) throw new Error("INVALID_ACCOUNT_CACHE");
    for (const store of STORES) {
      const value = target?.values[store.key];
      if (typeof value === "string") localStorage.setItem(store.key, value);
      else localStorage.removeItem(store.key);
      const unowned = target?.unowned?.[store.kind];
      if (unowned === "1") localStorage.setItem(UNOWNED_KEY + store.kind, "1");
      else localStorage.removeItem(UNOWNED_KEY + store.kind);
      window.dispatchEvent(new Event(store.event));
    }
    if (target?.linked === userId && target.baseline) {
      localStorage.setItem(LINK_KEY, userId);
      localStorage.setItem(STATE_KEY, target.baseline);
    } else {
      localStorage.removeItem(LINK_KEY);
      localStorage.removeItem(STATE_KEY);
    }
  } else {
    // Data existing before the first Google login has no verified owner.
    for (const store of STORES) {
      const raw = localStorage.getItem(store.key);
      if (raw && raw !== "{}") {
        try {
          const value = JSON.parse(raw);
          const nonempty = store.kind === "interview"
            ? Object.values(value as Record<string, Record<string, unknown>>).some(v => v && Object.keys(v).length > 0)
            : store.kind === "courses"
              ? Object.keys((value as { courses?: object }).courses ?? {}).length > 0
              : Object.keys((value as { problems?: object }).problems ?? {}).length > 0;
          if (nonempty) localStorage.setItem(UNOWNED_KEY + store.kind, "1");
        } catch { localStorage.setItem(UNOWNED_KEY + store.kind, "1"); }
      }
    }
  }
  localStorage.setItem(ACTIVE_KEY, userId);
}

export function isUnownedProgress(kind: "interview" | "courses" | "top150"): boolean {
  return localStorage.getItem(UNOWNED_KEY + kind) === "1";
}
export function clearUnowned(kind: "interview" | "courses" | "top150"): void {
  localStorage.removeItem(UNOWNED_KEY + kind);
}

/** Transparent first login for blank or matching device state; never claim unknown legacy data. */
export async function ensureAutoLinkedGoogleProgress(userId: string): Promise<GoogleSyncStatus> {
  assertActiveAccount(userId);
  if (isGoogleProgressLinkedTo(userId)) return reconcileGoogleProgress(userId);
  if (getLinkedGoogleUser()) return "conflict";
  const local = readInterviewProgress();
  const remote = await fetchGoogleProgress(userId);
  assertActiveAccount(userId);
  if (!equal(readInterviewProgress(), local)) return "conflict";
  if (isUnownedProgress("interview") && hasData(local) && !equal(local, remote.state)) return "conflict";
  if (remote.revision === 0 && hasData(local)) return "conflict";
  if (remote.revision > 0 && hasData(local) && !equal(local, remote.state)) return "conflict";
  if (remote.revision > 0) await linkGoogleProgress(userId, "remote", remote);
  else await linkGoogleProgress(userId, "local", remote);
  return "synced";
}
export async function fetchGoogleProgress(userId?: string): Promise<RemoteProgress> {
  const url = userId ? "/api/google-progress?userId=" + encodeURIComponent(userId) : "/api/google-progress";
  const res = await fetch(url, { credentials: "same-origin", cache: "no-store" });
  if (!res.ok) throw new Error("ACCOUNT_PROGRESS_READ_" + res.status);
  const result = await res.json() as { ok: boolean; state: InterviewProgressState; revision: number };
  if (!result.ok || !result.state || !Number.isSafeInteger(result.revision)) throw new Error("INVALID_ACCOUNT_PROGRESS");
  return { state: result.state, revision: result.revision };
}
export async function putGoogleProgress(state: InterviewProgressState, revision: number, userId?: string): Promise<number> {
  if (userId) assertActiveAccount(userId);
  const res = await fetch("/api/google-progress", {
    method: "PUT", credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, revision, userId }),
  });
  if (res.status === 409) throw new Error("VERSION_CONFLICT");
  if (!res.ok) throw new Error("ACCOUNT_PROGRESS_WRITE_" + res.status);
  const result = await res.json() as { ok: boolean; revision: number };
  if (!result.ok || !Number.isSafeInteger(result.revision)) throw new Error("INVALID_ACCOUNT_PROGRESS");
  return result.revision;
}
/** 
 * Explicit first-time link. The caller must confirm with the user first.
 * Never silently import or replace another account's progress.
 */
export async function linkGoogleProgress(
  userId: string, mode: "local" | "remote" | "conservative", remote: RemoteProgress
): Promise<void> {
  assertActiveAccount(userId);
  const existingUser = getLinkedGoogleUser();
  if (existingUser && existingUser !== userId) throw new Error("DIFFERENT_LINKED_GOOGLE_ACCOUNT");
  const local = readInterviewProgress();
  let selected: InterviewProgressState;
  if (mode === "local") {
    if (remote.revision !== 0 && !equal(local, remote.state)) throw new Error("REMOTE_IS_NOT_EMPTY");
    selected = local;
  } else if (mode === "remote") {
    if (remote.revision === 0) throw new Error("REMOTE_NOT_INITIALIZED");
    selected = remote.state;
  } else {
    if (remote.revision === 0) throw new Error("REMOTE_NOT_INITIALIZED");
    selected = conservativeMerge(local, remote.state);
  }
  // The immutable local snapshot MUST be persisted before local changes or remote writes.
  archiveProgressBeforeMerge(local);
  let revision = remote.revision;
  if (mode === "local" && remote.revision === 0 && hasData(local)) {
    revision = await putGoogleProgress(local, 0, userId);
  } else if (mode === "conservative" && !equal(selected, remote.state)) {
    revision = await putGoogleProgress(selected, remote.revision, userId);
  }
  assertActiveAccount(userId);
  if (!equal(readInterviewProgress(), local)) throw new Error("LOCAL_CHANGED");
  if (!equal(selected, local)) replaceInterviewProgress(selected);
  // Keep baseline and link atomic from the user's perspective: write baseline first.
  setBaseline(userId, { state: selected, revision });
  localStorage.setItem(LINK_KEY, userId);
  clearUnowned("interview");
  emitGoogleSync("synced");
}
export function unlinkGoogleProgress(userId: string): void {
  if (!isGoogleProgressLinkedTo(userId)) return;
  localStorage.removeItem(LINK_KEY);
  localStorage.removeItem(STATE_KEY);
  emitGoogleSync("unlinked");
}
/** Prefer 'Cần ôn' on a contradiction; union bookmarks, never grant mastery in a conflict. */
export function conservativeMerge(a: InterviewProgressState, b: InterviewProgressState): InterviewProgressState {
  const state = empty();
  const ids = new Set([...Object.keys(a.learned), ...Object.keys(b.learned), ...Object.keys(a.review), ...Object.keys(b.review)]);
  for (const id of ids) {
    if (a.review[id] || b.review[id] || (Boolean(a.learned[id]) !== Boolean(b.learned[id]) && (a.learned[id] || b.learned[id]))) {
      state.review[id] = true;
    } else if (a.learned[id] && b.learned[id]) {
      state.learned[id] = true;
    }
  }
  for (const id of new Set([...Object.keys(a.bookmarks), ...Object.keys(b.bookmarks)])) {
    if (a.bookmarks[id] || b.bookmarks[id]) state.bookmarks[id] = true;
  }
  return state;
}
/**
 * Initial sync or local change. CAS prevents overwriting a newer device.
 * Offline data stays in localStorage. Only user-initiated merge can resolve a true conflict.
 */
export async function reconcileGoogleProgress(userId: string): Promise<GoogleSyncStatus> {
  assertActiveAccount(userId);
  if (!isGoogleProgressLinkedTo(userId)) return "unlinked";
  const base = readBaseline(userId);
  if (!base) return "conflict";
  const local = readInterviewProgress();
  const remote = await fetchGoogleProgress(userId);
  assertActiveAccount(userId);
  if (!isGoogleProgressLinkedTo(userId)) return "unlinked";
  if (equal(remote.state, local)) {
    setBaseline(userId, remote);
    return "synced";
  }
  if (remote.revision !== base.revision || !equal(remote.state, base.state)) {
    if (equal(local, base.state)) {
      archiveProgressBeforeMerge(local);
      if (!isGoogleProgressLinkedTo(userId) || !equal(readInterviewProgress(), local)) return "conflict";
      replaceInterviewProgress(remote.state);
      setBaseline(userId, remote);
      return "synced";
    }
    return "conflict";
  }
  if (equal(local, base.state)) return "synced";
  const revision = await putGoogleProgress(local, base.revision, userId);
  assertActiveAccount(userId);
  if (!isGoogleProgressLinkedTo(userId)) return "unlinked";
  setBaseline(userId, { state: local, revision });
  return equal(readInterviewProgress(), local) ? "synced" : "syncing";
}
