import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InterviewQuestion } from "../types";
import {
  saveDraft, getDrafts, clearAllDrafts,
  writePublishedCache, getPublishedCache, mergeQuestionsWithDrafts,
  reconcilePublishedCache, downloadRetiredInterviewBackup,
} from "../draftStore";

const makeQuestion = (id: string): InterviewQuestion => ({
  id, title: `Question ${id}`, summary: "Summary", answerMarkdown: "Details",
  category: "java-core", difficulty: "middle", tags: ["java"],
});

describe("retired question recovery without resurrection", () => {
  beforeEach(() => {
    localStorage.clear();
    clearAllDrafts();
    writePublishedCache({});
  });

  it("hides orphan retired drafts but keeps them in localStorage", () => {
    const current = makeQuestion("q-193");
    const retired = makeQuestion("q-194");
    saveDraft(retired);
    saveDraft(makeQuestion("q-new"));
    const merged = mergeQuestionsWithDrafts([current], getDrafts());
    expect(merged.map(q => q.id)).toContain("q-193");
    expect(merged.map(q => q.id)).not.toContain("q-194");
    expect(merged.map(q => q.id)).toContain("q-new"); // Still allows genuine new questions.
    expect(getDrafts()["q-194"]).toEqual(expect.objectContaining({ id: "q-194" }));
  });

  it("preserves retired published copies even after reconciliation or deletion", () => {
    const retired = makeQuestion("q-194");
    const cache = {
      "q-194": {
        question: { ...retired, isDeleted: true },
        publishedAt: Date.now(),
      },
      "q-new": {
        question: makeQuestion("q-new"),
        publishedAt: Date.now(),
      },
    };
    writePublishedCache(cache);
    const reconciled = reconcilePublishedCache([makeQuestion("q-193")], getPublishedCache());
    expect(reconciled["q-194"]).toBeDefined();
    const merged = mergeQuestionsWithDrafts([makeQuestion("q-193")], {}, getPublishedCache());
    expect(merged.map(q => q.id)).not.toContain("q-194");
    expect(merged.map(q => q.id)).toContain("q-new");
    expect(getPublishedCache()["q-194"]).toBeDefined();
  });

  it("clear all active drafts never clears retired archived drafts", () => {
    saveDraft(makeQuestion("q-194"));
    saveDraft(makeQuestion("q-new"));
    clearAllDrafts();
    expect(getDrafts()["q-new"]).toBeUndefined();
    expect(getDrafts()["q-194"]).toBeDefined();
  });

  it("exports both archived layers without changing them", () => {
    saveDraft(makeQuestion("q-194"));
    writePublishedCache({ "q-194": { question: makeQuestion("q-194"), publishedAt: Date.now() } });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const create = vi.fn(() => "blob:retired");
    const revoke = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: create });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revoke });
    downloadRetiredInterviewBackup(getDrafts(), getPublishedCache());
    expect(create).toHaveBeenCalledTimes(1);
    expect(revoke).toHaveBeenCalledWith("blob:retired");
    expect(click).toHaveBeenCalledTimes(1);
    expect(getDrafts()["q-194"]).toBeDefined();
    expect(getPublishedCache()["q-194"]).toBeDefined();
    click.mockRestore();
  });
});
