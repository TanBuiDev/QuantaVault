import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import { ToastProvider } from "@/components/ui/Toast";
import { ProgressProvider } from "@/lib/progress/provider";

vi.mock("next/navigation", () => ({
  usePathname: () => null,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("AppShell", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ sections: [] }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the primary navigation and wraps child content", async () => {
    render(
      <ThemeProvider>
        <ProgressProvider>
          <ToastProvider>
            <ConfirmProvider>
              <AppShell>
                <p>Shell child content</p>
              </AppShell>
            </ConfirmProvider>
          </ToastProvider>
        </ProgressProvider>
      </ThemeProvider>,
    );

    const dashboard = screen.getByRole("link", { name: "Dashboard Tổng Quan" });
    expect(dashboard).toHaveAttribute("href", "/");
    expect(dashboard).not.toHaveAttribute("aria-current");

    expect(screen.getByText("Shell child content")).toBeInTheDocument();
  });
});
