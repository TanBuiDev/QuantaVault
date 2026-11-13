import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { AdminAccountPanel } from "../AdminAccountPanel";

const auth = vi.hoisted(() => ({ role:"user" as "user"|"admin", loggedIn:true }));
vi.mock("@/lib/auth/AccountProvider", () => ({
  useAccount: () => ({
    user: auth.loggedIn ? { id:"verified-owner", email:"owner@example.com", name:"Owner", role:auth.role } : null,
    refresh: vi.fn(),
  }),
}));
vi.mock("@/components/ui/ConfirmDialog", () => ({
  useConfirm: () => vi.fn(),
}));

describe("Admin panel visibility", () => {
  beforeEach(() => {
    auth.loggedIn = true;
    auth.role = "user";
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok:true,
      json:async () => ({ ok:true, elevated:false }),
    })));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("never shows administrative controls to a regular Google account", () => {
    render(<AdminAccountPanel />);
    expect(screen.queryByRole("region", {name:"Quản trị tài khoản"})).not.toBeInTheDocument();
    expect(screen.queryByText("Kích hoạt admin đầu tiên")).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows only step-up authentication for a provisioned admin", async () => {
    auth.role = "admin";
    render(<AdminAccountPanel />);
    expect(screen.getByRole("region", {name:"Quản trị tài khoản"})).toBeInTheDocument();
    expect(screen.getByText("Bạn có quyền admin.", {exact:false})).toBeInTheDocument();
    expect(screen.getByRole("button", {name:/Xác thực 15 phút/})).toBeInTheDocument();
    expect(screen.queryByText("Kích hoạt admin đầu tiên")).not.toBeInTheDocument();
    expect(screen.queryByText("TOTP (6 số)")).not.toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/admin/status", expect.any(Object)));
  });
});
