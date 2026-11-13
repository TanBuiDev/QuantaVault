import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccountTabs } from "../AccountTabs";

const accountState=vi.hoisted(()=>({ role:"user" as "user"|"admin",signedIn:true,loading:false }));
vi.mock("@/lib/auth/AccountProvider",()=>({
  useAccount:()=>({
    user:accountState.signedIn ? {id:"google-user",name:"Test",email:"user@example.com",role:accountState.role} : null,
    loading:accountState.loading,logout:vi.fn(),
  }),
}));
vi.mock("../GoogleAccountPanel",()=>({GoogleAccountPanel:()=> <div>Progress sync panel</div>}));
vi.mock("../GoogleLearningSyncPanel",()=>({GoogleLearningSyncPanel:()=> <div>Course sync panel</div>}));
vi.mock("../AdminAccountPanel",()=>({AdminAccountPanel:()=> <div>Restricted admin panel</div>}));
vi.mock("../InterviewCloudSync",()=>({InterviewCloudSync:()=> <div>Legacy recovery</div>}));

describe("Account route tabs",()=>{
  beforeEach(()=>{
    accountState.role="user";
    accountState.signedIn=true;
    accountState.loading=false;
    window.history.replaceState(null,"","/account/");
  });

  it("regular users see only the profile and sync features",()=>{
    render(<AccountTabs/>);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tablist")).toHaveClass("grid-cols-2");
    expect(screen.queryByRole("tab",{name:"Bảo mật"})).not.toBeInTheDocument();
    expect(screen.queryByText("Restricted admin panel")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab",{name:"Đồng bộ"}));
    expect(window.location.search).toBe("?tab=sync");
    expect(screen.getByRole("tabpanel",{name:"Đồng bộ"})).not.toHaveAttribute("hidden");
  });

  it("redirects old security links to a usable page for ordinary users",async()=>{
    window.history.replaceState(null,"","/account/?tab=security");
    render(<AccountTabs/>);
    await waitFor(()=>expect(window.location.search).toBe("?tab=profile"));
    expect(screen.getByRole("tab",{name:"Tài khoản"})).toHaveAttribute("aria-selected","true");
    expect(screen.queryByRole("tab",{name:"Bảo mật"})).not.toBeInTheDocument();
  });

  it("handles legacy administration hash without exposing an empty panel",async()=>{
    window.history.replaceState(null,"","/account/#administration");
    render(<AccountTabs/>);
    await waitFor(()=>expect(window.location.hash).toBe(""));
    expect(window.location.search).toBe("?tab=profile");
    expect(screen.getByRole("tabpanel",{name:"Tài khoản"})).not.toHaveAttribute("hidden");
  });

  it("guests cannot access an administrative tab",async()=>{
    accountState.signedIn=false;
    window.history.replaceState(null,"","/account/?tab=security");
    render(<AccountTabs/>);
    await waitFor(()=>expect(window.location.search).toBe("?tab=profile"));
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.queryByRole("tabpanel",{name:"Bảo mật"})).not.toBeInTheDocument();
  });

  it("administrators retain the management tab and legacy links",()=>{
    accountState.role="admin";
    window.history.replaceState(null,"","/account/#administration");
    render(<AccountTabs/>);
    expect(screen.getByRole("tablist")).toHaveClass("grid-cols-3");
    expect(screen.getByRole("tab",{name:"Bảo mật"})).toHaveAttribute("aria-selected","true");
    expect(screen.getByText("Restricted admin panel")).toBeInTheDocument();
  });

  it("removes admin controls when the current session loses its role",async()=>{
    accountState.role="admin";
    window.history.replaceState(null,"","/account/?tab=security");
    const {rerender}=render(<AccountTabs/>);
    expect(screen.getByText("Restricted admin panel")).toBeInTheDocument();
    accountState.role="user";
    rerender(<AccountTabs/>);
    await waitFor(()=>expect(window.location.search).toBe("?tab=profile"));
    expect(screen.queryByText("Restricted admin panel")).not.toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab",{name:"Tài khoản"})).toHaveAttribute("aria-selected","true");
  });

  it("keeps the old sync hash working for every user",()=>{
    window.history.replaceState(null,"","/account/#sync");
    render(<AccountTabs/>);
    expect(screen.getByRole("tab",{name:"Đồng bộ"})).toHaveAttribute("aria-selected","true");
  });
});
