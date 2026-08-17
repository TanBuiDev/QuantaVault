import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";
import { ProgressProvider } from "@/lib/progress/provider";

describe("home dashboard", () => {
  it("renders an accessible Top Interview 150 heading", () => {
    render(
      <ProgressProvider>
        <HomePage />
      </ProgressProvider>,
    );
    expect(screen.getByRole("heading", { name: /Top Interview 150/i })).toBeInTheDocument();
  });
});
