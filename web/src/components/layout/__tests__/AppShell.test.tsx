import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { AppShell } from "@/components/layout/AppShell";

describe("AppShell", () => {
  it("renders the primary navigation and wraps child content", () => {
    render(
      <AppShell>
        <p>Shell child content</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Problems" })).toHaveAttribute(
      "href",
      "/problems",
    );
    expect(screen.getByText("Shell child content")).toBeInTheDocument();
  });
});
