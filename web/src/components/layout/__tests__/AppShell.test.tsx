import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

vi.mock("next/navigation", () => ({
  usePathname: () => null,
}));

describe("AppShell", () => {
  it("renders the primary navigation and wraps child content", () => {
    render(
      <ThemeProvider>
        <AppShell>
          <p>Shell child content</p>
        </AppShell>
      </ThemeProvider>,
    );

    for (const link of screen.getAllByRole("link", { name: "Dashboard" })) {
      expect(link).toHaveAttribute("href", "/");
      expect(link).not.toHaveAttribute("aria-current");
    }
    for (const link of screen.getAllByRole("link", { name: "Problems" })) {
      expect(link).toHaveAttribute("href", "/problems");
      expect(link).not.toHaveAttribute("aria-current");
    }
    expect(screen.getByText("Shell child content")).toBeInTheDocument();
  });
});
