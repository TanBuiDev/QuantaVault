"use client";

import { useSyncExternalStore } from "react";

const AUTH_CHANGE_EVENT = "quantavault-learning-session:change";
let authenticated = false;

/** A confirmed Google session permits learning-state writes.
 * Cloud APIs separately enforce server-side authentication. */
export function setLearningSessionActive(active: boolean): void {
  if (authenticated === active) return;
  authenticated = active;
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
export function canWriteLearningProgress(): boolean { return authenticated; }
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
}
export function useLearningSession(): boolean {
  return useSyncExternalStore(subscribe, canWriteLearningProgress, () => false);
}
