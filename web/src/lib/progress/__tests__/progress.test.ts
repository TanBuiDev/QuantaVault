import { beforeEach, describe, expect, it } from "vitest";

import {
  getProblemProgress,
  readProgress,
  removeProblemProgress,
  upsertProblemProgress,
  writeProgress,
  type ProgressStateV1,
} from "@/lib/progress";

const STORAGE_KEY = "leetcode-top150-progress:v1";

function emptyState(): ProgressStateV1 {
  return { version: 1, problems: {} };
}

describe("versioned learner progress", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("treats missing browser storage as an empty version-1 state", () => {
    expect(readProgress()).toEqual(emptyState());
  });

  it("round-trips valid progress through localStorage", () => {
    const state = upsertProblemProgress(emptyState(), 121, {
      status: "solved",
      bookmarked: true,
      confidence: 4,
      revealedHints: 2,
      solutionViewed: true,
      interviewViewed: false,
      notes: "Review the running minimum invariant.",
    });

    writeProgress(state);

    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
    expect(readProgress()).toEqual(state);
  });

  it("recovers safely from corrupt or incompatible stored data", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    expect(readProgress()).toEqual(emptyState());

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, problems: {} }));
    expect(readProgress()).toEqual(emptyState());
  });

  it("creates immutable records with defaults and an ISO UTC updatedAt", () => {
    const initial = emptyState();
    const next = upsertProblemProgress(initial, 121, { status: "in-progress" });
    const progress = getProblemProgress(next, 121);

    expect(next).not.toBe(initial);
    expect(next.problems).not.toBe(initial.problems);
    expect(progress).toMatchObject({
      problemId: 121,
      status: "in-progress",
      bookmarked: false,
      confidence: null,
      revealedHints: 0,
      solutionViewed: false,
      interviewViewed: false,
      notes: "",
    });
    expect(progress?.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it("preserves existing fields across partial updates", () => {
    const first = upsertProblemProgress(emptyState(), 121, {
      status: "in-progress",
      bookmarked: true,
      notes: "First note",
    });
    const second = upsertProblemProgress(first, 121, {
      status: "review",
      confidence: 3,
    });

    expect(getProblemProgress(second, 121)).toMatchObject({
      status: "review",
      bookmarked: true,
      confidence: 3,
      notes: "First note",
    });
  });

  it("clamps unsafe hint counts and confidence values", () => {
    const state = upsertProblemProgress(emptyState(), 121, {
      status: "solved",
      revealedHints: -8,
      confidence: 99 as never,
    });

    expect(getProblemProgress(state, 121)).toMatchObject({
      revealedHints: 0,
      confidence: null,
    });
  });

  it("removes a problem record so absence means not-started", () => {
    const state = upsertProblemProgress(emptyState(), 121, { status: "solved" });
    const removed = removeProblemProgress(state, 121);

    expect(getProblemProgress(removed, 121)).toBeNull();
    expect(removed).toEqual(emptyState());
  });
});
