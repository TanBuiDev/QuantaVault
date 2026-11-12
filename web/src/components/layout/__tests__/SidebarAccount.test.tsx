import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SidebarAccount } from "../SidebarAccount";

const accountState = vi.hoisted(() => ({ signedIn: false }));
vi.mock("@/lib/auth/AccountProvider", () => ({
  useAccount: () => ({
    user: accountState.signedIn
      ? { id: "google-1", name: "Google User", email: "user@example.com", role: "user", picture: null }
      : null,
    loading: false,
    logout: vi.fn(),
    syncStatus: "unlinked",
  }),
}));

describe("Sidebar Google sign-in", () => {
  beforeEach(() => { accountState.signedIn = false; });

  it("shows the four-color Google icon and short label in the expanded sidebar", () => {
    render(<SidebarAccount />);
    const link = screen.getByRole("link", { name: "Đăng nhập bằng Google" });
    expect(link).toHaveAttribute("href", "/api/auth/google/start");
    expect(within(link).getByText("Đăng nhập")).toBeInTheDocument();
    expect(link).toHaveClass("w-fit");
    expect([...link.querySelectorAll("svg path")].map(p => p.getAttribute("fill")))
      .toEqual(["#EA4335", "#4285F4", "#FBBC05", "#34A853"]);
  });

  it("shows only the Google icon in the collapsed sidebar with an accessible tooltip", () => {
    render(<SidebarAccount compact />);
    const link = screen.getByRole("link", { name: "Đăng nhập bằng Google" });
    expect(link).toHaveAttribute("href", "/api/auth/google/start");
    expect(link).toHaveAttribute("title", "Đăng nhập bằng Google");
    expect(link).toHaveClass("size-9");
    expect(within(link).queryByText("Đăng nhập")).not.toBeInTheDocument();
    expect(link.querySelector("svg")).toBeInTheDocument();
  });

  it("continues to show the account avatar rather than Google sign-in when authenticated", () => {
    accountState.signedIn = true;
    render(<SidebarAccount compact />);
    expect(screen.getByRole("link", { name: "Quản lý tài khoản Google" }))
      .toHaveAttribute("href", "/account");
    expect(screen.queryByRole("link", { name: "Đăng nhập bằng Google" }))
      .not.toBeInTheDocument();
  });
});
