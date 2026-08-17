"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

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

export interface ProgressContextValue {
  state: ProgressStateV1;
  hydrated: boolean;
  getProgress: (problemId: number) => ProblemProgress | null;
  updateProblem: (
    problemId: number,
    patch: Partial<Omit<ProblemProgress, "problemId" | "updatedAt">>,
  ) => void;
  clearProblem: (problemId: number) => void;
}

function getBrowserSnapshot(): ProgressStateV1 {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
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
  const state = useSyncExternalStore(subscribe, getBrowserSnapshot, () => SERVER_SNAPSHOT);
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
      publish(upsertProblemProgress(getBrowserSnapshot(), problemId, patch));
    },
    [],
  );

  const clearProblem = useCallback((problemId: number) => {
    publish(removeProblemProgress(getBrowserSnapshot(), problemId));
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({ state, hydrated, getProgress, updateProblem, clearProblem }),
    [state, hydrated, getProgress, updateProblem, clearProblem],
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
