import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import { DashboardView } from "@/features/dashboard/DashboardView";
import { ProgressProvider } from "@/lib/progress/provider";
import type { StudyPlan } from "@/lib/content";

const plan: StudyPlan = {
  id: "top-interview-150",
  title: "Top Interview 150",
  sections: [
    { name: "Array / String", slug: "array-string", problemIds: [88, 27] },
    { name: "Two Pointers", slug: "two-pointers", problemIds: [125] },
  ],
};

describe("DashboardView", () => {
  beforeEach(() => window.localStorage.clear());

  test("presents overall progress as the primary dashboard region", () => {
    render(
      <ProgressProvider>
        <DashboardView plan={plan} orderedProblemIds={[88, 27, 125]} />
      </ProgressProvider>,
    );

    expect(screen.getByRole("heading", { name: "Top Interview 150" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Overall study progress" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse problems/i })).toHaveAttribute("href", "/problems");
    expect(screen.getByText("Array / String")).toBeInTheDocument();
  });
});
