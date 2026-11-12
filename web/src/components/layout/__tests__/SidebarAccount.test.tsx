import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SidebarAccount } from "../SidebarAccount";
import controls from "@/components/ui/SidebarControl.module.css";

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
    expect(link).toHaveClass(controls.centerContent);
    expect(within(link).getByText("Đăng nhập")).toBeInTheDocument();
    expect([...link.querySelectorAll("svg path")].map(p => p.getAttribute("fill")))
      .toEqual(["#EA4335", "#4285F4", "#FBBC05", "#34A853"]);
  });

  it("shows only the Google icon in the collapsed sidebar with an accessible tooltip", () => {
    render(<SidebarAccount compact />);
    const link = screen.getByRole("link", { name: "Đăng nhập bằng Google" });
    expect(link).toHaveAttribute("href", "/api/auth/google/start");
    expect(link).toHaveAttribute("title", "Đăng nhập bằng Google");
    expect(within(link).queryByText("Đăng nhập")).not.toBeInTheDocument();
    expect(link.querySelector("svg")).toBeInTheDocument();
  });

  it("opens account management from the avatar in the collapsed sidebar", () => {
    accountState.signedIn = true;
    render(<SidebarAccount compact />);
    const account = screen.getByRole("button", { name: "Mở menu tài khoản" });
    expect(account).toHaveAttribute("aria-expanded", "false");
    expect(account).not.toHaveClass(controls.centerContent);
    expect(account).toHaveTextContent("");
    fireEvent.click(account);
    expect(account).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Quản lý tài khoản" }))
      .toHaveAttribute("href", "/account");
    expect(screen.queryByRole("link", { name: "Đăng nhập bằng Google" }))
      .not.toBeInTheDocument();
  });
});
