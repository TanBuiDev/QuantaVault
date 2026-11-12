"use client";

import type { InterviewProgressState } from "../interview/types";
import { readInterviewProgress, replaceInterviewProgress } from "../interview/progress";
import { archiveProgressBeforeMerge } from "../interview/questionIdMerge";

const LINK_KEY = "quantavault_google_linked_user_v1";
const STATE_KEY = "quantavault_google_progress_baseline_v1";
export const GOOGLE_SYNC_STATUS = "quantavault-google-sync:status";
export type GoogleSyncStatus = "unlinked" | "synced" | "syncing" | "offline" | "conflict";
export interface RemoteProgress { state: InterviewProgressState; revision: number }
interface SyncBaseline { userId: string; revision: number; state: InterviewProgressState }

const equal = (a: InterviewProgressState, b: InterviewProgressState): boolean => JSON.stringify(a) === JSON.stringify(b);
const empty = (): InterviewProgressState => ({ learned: {}, review: {}, bookmarks: {} });
const hasData = (s: InterviewProgressState): boolean => Object.keys(s.learned).length + Object.keys(s.review).length + Object.keys(s.bookmarks).length > 0;

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
export async function fetchGoogleProgress(): Promise<RemoteProgress> {
  const res = await fetch("/api/google-progress", { credentials: "same-origin", cache: "no-store" });
  if (!res.ok) throw new Error("ACCOUNT_PROGRESS_READ_" + res.status);
  const result = await res.json() as { ok: boolean; state: InterviewProgressState; revision: number };
  if (!result.ok || !result.state || !Number.isSafeInteger(result.revision)) throw new Error("INVALID_ACCOUNT_PROGRESS");
  return { state: result.state, revision: result.revision };
}
export async function putGoogleProgress(state: InterviewProgressState, revision: number): Promise<number> {
  const res = await fetch("/api/google-progress", {
    method: "PUT", credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state, revision }),
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
    revision = await putGoogleProgress(local, 0);
  } else if (mode === "conservative" && !equal(selected, remote.state)) {
    revision = await putGoogleProgress(selected, remote.revision);
  }
  if (!equal(selected, local)) replaceInterviewProgress(selected);
  // Keep baseline and link atomic from the user's perspective: write baseline first.
  setBaseline(userId, { state: selected, revision });
  localStorage.setItem(LINK_KEY, userId);
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
  if (!isGoogleProgressLinkedTo(userId)) return "unlinked";
  const base = readBaseline(userId);
  if (!base) return "conflict";
  const local = readInterviewProgress();
  const remote = await fetchGoogleProgress();
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
  const revision = await putGoogleProgress(local, base.revision);
  if (!isGoogleProgressLinkedTo(userId)) return "unlinked";
  setBaseline(userId, { state: local, revision });
  return equal(readInterviewProgress(), local) ? "synced" : "syncing";
}
