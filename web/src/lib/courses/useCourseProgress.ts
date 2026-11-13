"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { AllCoursesProgressState, CourseProgressRecord } from "./types";
import { canWriteLearningProgress, useLearningSession } from "../auth/progressAccess";

const STORAGE_KEY = "quantavault-course-progress:v1";
const LOCAL_CHANGE_EVENT = "quantavault-course-progress:change";

const SERVER_SNAPSHOT: AllCoursesProgressState = {
  version: 1,
  courses: {}
};

let cachedRaw: string | null = null;
let cachedState: AllCoursesProgressState = SERVER_SNAPSHOT;

function getSnapshot(): AllCoursesProgressState {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedState;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedState = SERVER_SNAPSHOT;
      return cachedState;
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && typeof parsed.courses === "object") {
      cachedState = parsed;
      return cachedState;
    }
  } catch {
    // Ignore JSON errors
  }

  cachedState = SERVER_SNAPSHOT;
  return cachedState;
}

function getServerSnapshot(): AllCoursesProgressState {
  return SERVER_SNAPSHOT;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const handleCustom = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCAL_CHANGE_EVENT, handleCustom);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCAL_CHANGE_EVENT, handleCustom);
  };
}

function emitChange(nextState: AllCoursesProgressState) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(nextState);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedState = nextState;
    window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
  } catch {
    // Ignore quota issues
  }
}

/** Used by account-level sync; broadcasts changes to every course subscriber. */
export function readCourseProgress(): AllCoursesProgressState {
  return getSnapshot();
}
export function replaceCourseProgress(state: AllCoursesProgressState): void {
  if (typeof window === "undefined") throw new Error("Browser storage unavailable");
  if (state.version !== 1 || !state.courses || typeof state.courses !== "object") throw new Error("Invalid course progress");
  const raw = JSON.stringify(state);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedState = state;
  window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
}

export function useCourseProgress() {
  const storedState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const canTrackProgress = useLearningSession();
  const state = canTrackProgress ? storedState : SERVER_SNAPSHOT;
  const hydrated = typeof window !== "undefined";

  const getCourseRecord = useCallback(
    (courseId: string): CourseProgressRecord => {
      return state.courses[courseId] || { completedLessonIds: [], updatedAt: "" };
    },
    [state]
  );

  const isLessonCompleted = useCallback(
    (courseId: string, lessonId: string): boolean => {
      const rec = state.courses[courseId];
      return rec ? rec.completedLessonIds.includes(lessonId) : false;
    },
    [state]
  );

  const toggleLessonCompleted = useCallback(
    (courseId: string, lessonId: string) => {
      if (!canWriteLearningProgress()) return;
      const currentState = getSnapshot();
      const curRecord = currentState.courses[courseId] || {
        completedLessonIds: [],
        updatedAt: new Date().toISOString()
      };

      const exists = curRecord.completedLessonIds.includes(lessonId);
      const updatedList = exists
        ? curRecord.completedLessonIds.filter((id) => id !== lessonId)
        : [...curRecord.completedLessonIds, lessonId];

      const nextState: AllCoursesProgressState = {
        ...currentState,
        courses: {
          ...currentState.courses,
          [courseId]: {
            ...curRecord,
            completedLessonIds: updatedList,
            lastAccessedLessonId: lessonId,
            updatedAt: new Date().toISOString()
          }
        }
      };
      emitChange(nextState);
    },
    []
  );

  const recordLastAccessed = useCallback(
    (courseId: string, lessonId: string) => {
      if (!canWriteLearningProgress()) return;
      const currentState = getSnapshot();
      const curRecord = currentState.courses[courseId] || {
        completedLessonIds: [],
        updatedAt: new Date().toISOString()
      };
      if (curRecord.lastAccessedLessonId === lessonId) return;

      const nextState: AllCoursesProgressState = {
        ...currentState,
        courses: {
          ...currentState.courses,
          [courseId]: {
            ...curRecord,
            lastAccessedLessonId: lessonId,
            updatedAt: new Date().toISOString()
          }
        }
      };
      emitChange(nextState);
    },
    []
  );

  const getCourseCompletion = useCallback(
    (courseId: string, totalLessons: number) => {
      const rec = state.courses[courseId];
      const count = rec ? rec.completedLessonIds.length : 0;
      const percentage =
        totalLessons > 0 ? Math.min(100, Math.round((count / totalLessons) * 100)) : 0;
      return {
        completedCount: count,
        totalLessons,
        percentage
      };
    },
    [state]
  );

  return {
    hydrated,
    canTrackProgress,
    getCourseRecord,
    isLessonCompleted,
    toggleLessonCompleted,
    recordLastAccessed,
    getCourseCompletion
  };
}
