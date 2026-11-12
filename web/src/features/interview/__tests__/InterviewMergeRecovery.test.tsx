import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { InterviewMergeRecovery } from "../InterviewMergeRecovery";
import { readInterviewProgress } from "@/lib/interview/progress";
import type { InterviewProgressState } from "@/lib/interview/types";
import { getSafelyMappableRetiredIds } from "@/lib/interview/questionIdMerge";

const fromIds = (learned: string[] = [], review: string[] = [], bookmarks: string[] = []): InterviewProgressState => ({
  learned: Object.fromEntries(learned.map(id => [id, true])),
  review: Object.fromEntries(review.map(id => [id, true])),
  bookmarks: Object.fromEntries(bookmarks.map(id => [id, true])),
});

function load(state: InterviewProgressState) {
  localStorage.setItem("interview-prep-progress-v1", JSON.stringify(state));
}

function view(state: InterviewProgressState) {
  return render(<InterviewMergeRecovery progress={state} drafts={{}} publishedCache={{}} />);
}

describe("automatic and manual retired progress reconciliation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("classifies the two pictured IDs as safe, never as historic aliases", () => {
    expect(getSafelyMappableRetiredIds(fromIds(["q-090", "q-043"]))).toEqual(["q-090", "q-043"]);
    expect(getSafelyMappableRetiredIds(fromIds(["q-194", "q-090"]))).toEqual(["q-090"]);
  });

  it("automatically resolves both pictured IDs, archives originals and removes warning", async () => {
    const original = fromIds(["q-090", "q-043", "q-044"], ["q-500"], ["q-043"]);
    load(original);
    const { queryByRole } = view(original);
    await waitFor(() => expect(readInterviewProgress().learned["q-090"]).toBeUndefined());
    const next = readInterviewProgress();
    expect(next.learned["q-043"]).toBeUndefined();
    expect(next.learned["q-044"]).toBe(true); // Both source and target learned.
    expect(next.review["q-089"]).toBe(true); // Source learned alone: merged answer needs review.
    expect(next.learned["q-089"]).toBeUndefined();
    expect(next.review["q-500"]).toBe(true);
    expect(next.bookmarks["q-044"]).toBe(true);
    expect(queryByRole("region", { name: "Khôi phục và hợp nhất câu hỏi cũ" })).toBeNull();
    const archive = JSON.parse(localStorage.getItem("interview-progress-merge-archives-v1")!);
    expect(archive).toHaveLength(1);
    expect(archive[0].state).toEqual(original);
  });

  it("keeps ambiguous historical keys untouched and asks only for those", () => {
    const original = fromIds(["q-090", "q-194"], [], ["q-194"]);
    load(original);
    view(original);
    expect(readInterviewProgress().learned["q-090"]).toBeUndefined();
    expect(readInterviewProgress().learned["q-194"]).toBe(true);
    expect(readInterviewProgress().bookmarks["q-194"]).toBe(true);
    expect(screen.getByText(/Có 1 ID trùng với lịch sử/)).toBeInTheDocument();
    expect(screen.getByText(/q-194/)).toBeInTheDocument();
    expect(screen.queryByText(/q-090 → q-089/)).not.toBeInTheDocument();
  });

  it("does not create archives or change states if there is nothing to migrate", () => {
    const original = fromIds(["q-500", "q-089"]);
    load(original);
    view(original);
    expect(localStorage.getItem("interview-progress-merge-archives-v1")).toBeNull();
    expect(readInterviewProgress()).toEqual(original);
  });

  it("never mutates progress or synchronizes if the archive write fails", () => {
    const original = fromIds(["q-090"]);
    load(original);
    const setItem = Storage.prototype.setItem;
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function(this: Storage, key: string, val: string) {
      if (key === "interview-progress-merge-archives-v1") throw new Error("QuotaExceeded");
      return setItem.call(this, key, val);
    });
    try {
      view(original);
      expect(readInterviewProgress()).toEqual(original);
      expect(screen.getByRole("alert")).toHaveTextContent(/Không thể tự đối chiếu/);
    } finally {
      spy.mockRestore();
    }
  });

  it("does not silently overwrite browser changes made before the effect", () => {
    const original = fromIds(["q-090"]);
    load(original);
    const newer = fromIds(["q-090", "q-099"]);
    load(newer);
    view(original);
    expect(readInterviewProgress()).toEqual(newer);
    expect(localStorage.getItem("interview-progress-merge-archives-v1")).toBeNull();
  });
});
