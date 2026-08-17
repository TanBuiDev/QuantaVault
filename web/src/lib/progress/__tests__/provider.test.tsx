import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { PROGRESS_STORAGE_KEY, type ProgressStateV1 } from "@/lib/progress";
import { ProgressProvider, useProgress } from "@/lib/progress/provider";

function ProgressProbe() {
  const { hydrated, getProgress, updateProblem } = useProgress();
  const progress = getProgress(121);

  return (
    <div>
      <span data-testid="hydrated">{hydrated ? "ready" : "loading"}</span>
      <span data-testid="status">{progress?.status ?? "not-started"}</span>
      <span data-testid="bookmark">{progress?.bookmarked ? "bookmarked" : "plain"}</span>
      <button
        type="button"
        onClick={() =>
          updateProblem(121, {
            status: "solved",
            bookmarked: true,
            confidence: 4,
          })
        }
      >
        Solve 121
      </button>
    </div>
  );
}

function storedState(status: "in-progress" | "solved" | "review"): ProgressStateV1 {
  return {
    version: 1,
    problems: {
      "121": {
        problemId: 121,
        status,
        bookmarked: false,
        confidence: 2,
        revealedHints: 1,
        solutionViewed: false,
        interviewViewed: false,
        notes: "Stored note",
        updatedAt: "2026-08-17T00:00:00.000Z",
      },
    },
  };
}

describe("ProgressProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hydrates learner state from localStorage after mounting", async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(storedState("review")));

    render(
      <ProgressProvider>
        <ProgressProbe />
      </ProgressProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("hydrated")).toHaveTextContent("ready"));
    expect(screen.getByTestId("status")).toHaveTextContent("review");
  });

  it("persists mutations and exposes the updated record", async () => {
    render(
      <ProgressProvider>
        <ProgressProbe />
      </ProgressProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("hydrated")).toHaveTextContent("ready"));
    fireEvent.click(screen.getByRole("button", { name: "Solve 121" }));

    expect(screen.getByTestId("status")).toHaveTextContent("solved");
    expect(screen.getByTestId("bookmark")).toHaveTextContent("bookmarked");

    const stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null") as ProgressStateV1;
    expect(stored.problems["121"]).toMatchObject({
      status: "solved",
      bookmarked: true,
      confidence: 4,
    });
  });

  it("refreshes state after a storage event from another tab", async () => {
    render(
      <ProgressProvider>
        <ProgressProbe />
      </ProgressProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("hydrated")).toHaveTextContent("ready"));

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(storedState("solved")));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: PROGRESS_STORAGE_KEY,
        newValue: localStorage.getItem(PROGRESS_STORAGE_KEY),
      }),
    );

    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("solved"));
  });
});
