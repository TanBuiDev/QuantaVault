"use client";

import type { InterviewProgressState } from "./types";

const KEY_STORAGE = "quantavault_progress_sync_code_v1";
const REV_STORAGE = "quantavault_progress_sync_revision_v1";
const BASE_STORAGE = "quantavault_progress_sync_baseline_v1";
export const CLOUD_SYNC_EVENT = "quantavault-progress-cloud:status";

export type SyncStatus = "saved" | "conflict" | "offline";
const emptyState = (): InterviewProgressState => ({ learned: {}, review: {}, bookmarks: {} });

function emitStatus(status: SyncStatus) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(CLOUD_SYNC_EVENT, { detail: status }));
}

export function getSyncCode(): string | null {
  try {
    const code = localStorage.getItem(KEY_STORAGE);
    return code && /^[a-f0-9]{64}$/.test(code) ? code : null;
  } catch { return null; }
}
export function generateSyncCode(): string {
  const values = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(values, byte => byte.toString(16).padStart(2, "0")).join("");
}
export function setSyncCode(code: string | null): boolean {
  if (code !== null && !/^[a-f0-9]{64}$/.test(code)) return false;
  try {
    if (getSyncCode() !== code) {
      localStorage.removeItem(REV_STORAGE);
      localStorage.removeItem(BASE_STORAGE);
    }
    if (code) localStorage.setItem(KEY_STORAGE, code);
    else localStorage.removeItem(KEY_STORAGE);
    return true;
  } catch { return false; }
}
export function getSyncedBaseline(): string | null {
  try { return localStorage.getItem(BASE_STORAGE); } catch { return null; }
}
function readRevision(): number | null {
  try {
    const value = localStorage.getItem(REV_STORAGE);
    if (value === null) return null;
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
  } catch { return null; }
}
export function rememberCloudState(state: InterviewProgressState, revision: number) {
  try {
    localStorage.setItem(BASE_STORAGE, JSON.stringify(state));
    localStorage.setItem(REV_STORAGE, String(revision));
  } catch { /* Browser storage may be blocked. */ }
}
function headers(code: string) {
  return { Authorization: `Bearer ${code}`, "Content-Type": "application/json" };
}
export async function downloadCloudProgress(code: string): Promise<{ state: InterviewProgressState; revision: number }> {
  const response = await fetch("/api/interview-progress", {
    method: "GET", headers: { Authorization: `Bearer ${code}` }, cache: "no-store",
  });
  if (!response.ok) throw new Error(`CLOUD_READ_${response.status}`);
  const data = await response.json() as { ok: boolean; state: InterviewProgressState; revision: number };
  if (!data.ok || !data.state) throw new Error("INVALID_CLOUD_DATA");
  return { state: data.state, revision: data.revision };
}
export async function uploadCloudProgress(
  code: string, state: InterviewProgressState, revision: number, overwrite = false
): Promise<number> {
  const response = await fetch("/api/interview-progress", {
    method: "PUT", headers: headers(code), cache: "no-store",
    body: JSON.stringify({ state, revision, overwrite }),
  });
  if (response.status === 409) throw new Error("VERSION_CONFLICT");
  if (!response.ok) throw new Error(`CLOUD_WRITE_${response.status}`);
  const data = await response.json() as { ok: boolean; revision: number };
  if (!data.ok || !Number.isSafeInteger(data.revision)) throw new Error("INVALID_CLOUD_DATA");
  return data.revision;
}

// Serialize writes from repeated clicks; the last local snapshot is sent last.
// A failed write remains in localStorage and is never silently discarded.
let pending: InterviewProgressState | null = null;
let flushing = false;
let blocked = false;
let queuedCode: string | null = null;

export function resetCloudWriteQueue() {
  pending = null;
  blocked = false;
  queuedCode = getSyncCode();
}
export function queueCloudProgress(state: InterviewProgressState) {
  const code = getSyncCode();
  if (!code || readRevision() === null) return; // Not connected until first explicit transfer.
  if (queuedCode !== code) { pending = null; blocked = false; queuedCode = code; }
  if (blocked) { emitStatus("conflict"); return; }
  pending = state;
  if (flushing) return;
  flushing = true;
  void (async () => {
    try {
      while (pending !== null) {
        const snapshot = pending;
        pending = null;
        if (getSyncCode() !== code) return;
        const rev = readRevision();
        if (rev === null) return;
        try {
          const nextRevision = await uploadCloudProgress(code, snapshot, rev);
          if (getSyncCode() !== code) return;
          rememberCloudState(snapshot, nextRevision);
          emitStatus("saved");
        } catch (error) {
          // Do not overwrite newer remote data when another device changed it.
          blocked = true;
          emitStatus(error instanceof Error && error.message === "VERSION_CONFLICT" ? "conflict" : "offline");
          return;
        }
      }
    } finally { flushing = false; }
  })();
}
export { emptyState };
