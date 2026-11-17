"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";

import { canWriteLearningProgress, useLearningSession } from "../auth/progressAccess";
import {
  PROGRESS_STORAGE_KEY,
  createEmptyProgressState,
  getProblemProgress,
  readProgress,
  removeProblemProgress,
  upsertProblemProgress,
  writeProgress,
  type ProblemProgress,
  type ProgressStateV1,
} from "./index";

const LOCAL_CHANGE_EVENT = "leetcode-top150-progress:change";
const SERVER_SNAPSHOT = createEmptyProgressState();

let cachedRaw: string | null | undefined;
let cachedState: ProgressStateV1 = SERVER_SNAPSHOT;

export type LocalSaveStatus = "idle" | "saved-local" | "storage-error";
export interface ProgressContextValue {
  localSaveStatus: LocalSaveStatus;
  lastLocalSavedAt: number;
  state: ProgressStateV1;
  hydrated: boolean;
  canTrackProgress: boolean;
  getProgress: (problemId: number) => ProblemProgress | null;
  updateProblem: (
    problemId: number,
    patch: Partial<Omit<ProblemProgress, "problemId" | "updatedAt">>,
  ) => boolean;
  clearProblem: (problemId: number) => void;
}

function getBrowserSnapshot(): ProgressStateV1 {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  let raw: string | null;
  try { raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY); }
  catch { return SERVER_SNAPSHOT; }
  if (raw === cachedRaw) return cachedState;

  cachedRaw = raw;
  cachedState = readProgress();
  return cachedState;
}

function invalidateSnapshot(): void {
  cachedRaw = undefined;
}

function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== PROGRESS_STORAGE_KEY) return;
    invalidateSnapshot();
    listener();
  };
  const onLocalChange = () => {
    invalidateSnapshot();
    listener();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCAL_CHANGE_EVENT, onLocalChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCAL_CHANGE_EVENT, onLocalChange);
  };
}

function subscribeHydration(): () => void {
  return () => undefined;
}

function getHydratedSnapshot(): boolean {
  return true;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

function publish(next: ProgressStateV1): void {
  writeProgress(next);
  invalidateSnapshot();
  window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const storedState = useSyncExternalStore(subscribe, getBrowserSnapshot, () => SERVER_SNAPSHOT);
  const [localSaveStatus, setLocalSaveStatus] = useState<LocalSaveStatus>("idle");
  const [lastLocalSavedAt, setLastLocalSavedAt] = useState(0);
  const canTrackProgress = useLearningSession();
  const state = canTrackProgress ? storedState : SERVER_SNAPSHOT;
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );

  const getProgress = useCallback(
    (problemId: number) => getProblemProgress(state, problemId),
    [state],
  );

  const updateProblem = useCallback<ProgressContextValue["updateProblem"]>(
    (problemId, patch) => {
      if (!canWriteLearningProgress()) return false;
      try {
        publish(upsertProblemProgress(getBrowserSnapshot(), problemId, patch));
        setLocalSaveStatus("saved-local");
        setLastLocalSavedAt(Date.now());
        return true;
      } catch {
        setLocalSaveStatus("storage-error");
        return false;
      }
    },
    [],
  );

  const clearProblem = useCallback((problemId: number) => {
    if (!canWriteLearningProgress()) return;
    try {
      publish(removeProblemProgress(getBrowserSnapshot(), problemId));
      setLocalSaveStatus("saved-local");
      setLastLocalSavedAt(Date.now());
    } catch { setLocalSaveStatus("storage-error"); }
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({ state, hydrated, canTrackProgress, localSaveStatus, lastLocalSavedAt, getProgress, updateProblem, clearProblem }),
    [state, hydrated, canTrackProgress, localSaveStatus, lastLocalSavedAt, getProgress, updateProblem, clearProblem],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider.");
  }
  return context;
}
