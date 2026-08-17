import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("home page foundation", () => {
  it("renders an accessible Top Interview 150 heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /Top Interview 150/i })).toBeInTheDocument();
  });
});
