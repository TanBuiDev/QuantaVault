import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InterviewProgressState } from "../types";
import {
  archiveProgressBeforeMerge,
  inspectRetiredProgress,
  mergeApprovedRetiredProgress,
  isRetiredInterviewId,
} from "../questionIdMerge";
import { readInterviewProgress, replaceInterviewProgress } from "../progress";

const state = (learned: string[] = [], review: string[] = [], bookmarks: string[] = []): InterviewProgressState => ({
  learned: Object.fromEntries(learned.map(id => [id, true])),
  review: Object.fromEntries(review.map(id => [id, true])),
  bookmarks: Object.fromEntries(bookmarks.map(id => [id, true])),
});

describe("canonical interview ID retirement and progress reconciliation", () => {
  beforeEach(() => window.localStorage.clear());

  it("keeps historical collision metadata visible for explicit user review", () => {
    expect(isRetiredInterviewId("q-194")).toBe(true);
    expect(isRetiredInterviewId("q-999")).toBe(false);
    const matches = inspectRetiredProgress(state(["q-194"]));
    expect(matches).toMatchObject([{ oldId: "q-194", newId: "q-193", historicalTarget: "q-202", learned: true }]);
  });

  it("never silently rewrites unversioned canonical IDs when merely reading", () => {
    const raw = state(["q-194", "q-193"], ["q-090"], ["q-194"]);
    window.localStorage.setItem("interview-prep-progress-v1", JSON.stringify(raw));
    expect(readInterviewProgress()).toEqual(raw);
    expect(JSON.parse(window.localStorage.getItem("interview-prep-progress-v1")!)).toEqual(raw);
  });

  it("requires explicit approval, preserves unrelated and ambiguous records", () => {
    const original = state(["q-193", "q-194", "q-090", "q-500"], [], ["q-194", "q-500"]);
    const snapshot = JSON.stringify(original);
    const next = mergeApprovedRetiredProgress(original, ["q-194"]);
    expect(original).toEqual(JSON.parse(snapshot));
    expect(next.learned["q-500"]).toBe(true);
    expect(next.learned["q-090"]).toBe(true); // Not approved and still preserved.
    expect(next.learned["q-193"]).toBe(true); // Both A01 answers mastered.
    expect(next.learned["q-194"]).toBeUndefined();
    expect(next.bookmarks["q-193"]).toBe(true);
    expect(next.bookmarks["q-500"]).toBe(true);
  });

  it("conservatively downgrades incomplete mastery and favors review", () => {
    const one = mergeApprovedRetiredProgress(state(["q-193"], ["q-194"]), ["q-194"]);
    expect(one.learned["q-193"]).toBeUndefined();
    expect(one.review["q-193"]).toBe(true);

    const two = mergeApprovedRetiredProgress(state(["q-194"]), ["q-194"]);
    expect(two.learned["q-193"]).toBeUndefined();
    expect(two.review["q-193"]).toBe(true);
  });

  it("does not grant mastery when one of three source questions is not learned", () => {
    const original = state(["q-022", "q-023"], [], ["q-024"]);
    const result = mergeApprovedRetiredProgress(original, ["q-023", "q-024"]);
    expect(result.learned["q-022"]).toBeUndefined();
    expect(result.review["q-022"]).toBe(true);
    expect(result.bookmarks["q-022"]).toBe(true);
  });

  it("does not create learned/review collisions; repeated migration is idempotent", () => {
    const original = state(["q-193", "q-194"], [], ["q-194"]);
    const once = mergeApprovedRetiredProgress(original, ["q-194"]);
    const twice = mergeApprovedRetiredProgress(once, ["q-194"]);
    expect(twice).toEqual(once);
    expect(Object.keys(once.learned).some(id => once.review[id])).toBe(false);
  });

  it("refuses to accept unrelated IDs", () => {
    expect(() => mergeApprovedRetiredProgress(state(["q-888"]), ["q-888"])).toThrow(/Unknown retired ID/);
  });

  it("archives raw progress before replacement and preserves older snapshots", () => {
    const first = state(["q-194"]);
    const second = state([], ["q-194"]);
    archiveProgressBeforeMerge(first);
    archiveProgressBeforeMerge(second);
    const archive = JSON.parse(localStorage.getItem("interview-progress-merge-archives-v1")!);
    expect(archive).toHaveLength(2);
    expect(archive[0].state).toEqual(first);
    expect(archive[1].state).toEqual(second);
  });

  it("fails closed when archive or progress replacement cannot be persisted", () => {
    const before = state(["q-194"]);
    replaceInterviewProgress(before);
    const originalSetItem = Storage.prototype.setItem;
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key: string, value: string) {
      if (key === "interview-progress-merge-archives-v1" || key === "interview-prep-progress-v1") {
        throw new DOMException("quota", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    });
    expect(() => archiveProgressBeforeMerge(before)).toThrow();
    expect(() => replaceInterviewProgress(state([], ["q-193"]))).toThrow();
    spy.mockRestore();
    expect(readInterviewProgress()).toEqual(before);
  });
});
