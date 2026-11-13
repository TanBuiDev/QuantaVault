import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccountTabs } from "../AccountTabs";

const account=vi.hoisted(()=>({role:"user" as "user"|"admin",signedIn:true,loading:false,status:"synced" as "synced"|"offline"|"conflict"|"syncing"|"unlinked"}));
vi.mock("@/lib/auth/AccountProvider",()=>({useAccount:()=>({
  user:account.signedIn?{id:"google-user",name:"Test",email:"user@example.com",role:account.role}:null,
  loading:account.loading,syncStatus:account.status,logout:vi.fn(),
})}));
vi.mock("../GoogleAccountPanel",()=>({GoogleAccountPanel:()=> <div>Interview recovery</div>}));
vi.mock("../GoogleLearningSyncPanel",()=>({GoogleLearningSyncPanel:()=> <div>Course recovery</div>}));
vi.mock("../AdminAccountPanel",()=>({AdminAccountPanel:()=> <div>Restricted admin panel</div>}));
vi.mock("../InterviewCloudSync",()=>({InterviewCloudSync:()=> <div>Legacy recovery</div>}));

describe("Account view: Google sync is automatic",()=>{
  beforeEach(()=>{
    account.role="user";account.signedIn=true;account.loading=false;account.status="synced";
    window.history.replaceState(null,"","/account/");
  });
  it("has no redundant tabs for regular users and displays one compact save status",()=>{
    render(<AccountTabs/>);
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab",{name:"Đồng bộ"})).not.toBeInTheDocument();
    expect(screen.getByRole("heading",{name:"Thông tin tài khoản"})).toBeVisible();
    expect(screen.getByText("Đã lưu tiến độ học tập")).toBeInTheDocument();
    expect(screen.queryByText("Interview recovery")).not.toBeInTheDocument();
    expect(screen.getByText("Khôi phục dữ liệu cũ")).toBeInTheDocument();
  });
  it("redirects retired sync links and legacy hashes to the account summary",async()=>{
    window.history.replaceState(null,"","/account/?tab=sync");
    const {unmount}=render(<AccountTabs/>);
    await waitFor(()=>expect(window.location.search).toBe("?tab=profile"));
    unmount();
    window.history.replaceState(null,"","/account/#sync");
    render(<AccountTabs/>);
    await waitFor(()=>expect(window.location.hash).toBe(""));
    expect(window.location.search).toBe("?tab=profile");
  });
  it("does not let a regular user open admin through old links",async()=>{
    window.history.replaceState(null,"","/account/?tab=security");
    render(<AccountTabs/>);
    await waitFor(()=>expect(window.location.search).toBe("?tab=profile"));
    expect(screen.queryByText("Restricted admin panel")).not.toBeInTheDocument();
  });
  it("only shows recovery choices for real sync exceptions",()=>{
    account.status="conflict";
    render(<AccountTabs/>);
    expect(screen.getByText("Cần kiểm tra tiến độ")).toBeInTheDocument();
    expect(screen.getByText("Interview recovery")).toBeInTheDocument();
    expect(screen.getByText("Course recovery")).toBeInTheDocument();
  });
  it("explains offline saving without claiming a successful cloud write",()=>{
    account.status="offline";
    render(<AccountTabs/>);
    expect(screen.getByText("Chưa thể kết nối")).toBeInTheDocument();
    expect(screen.queryByText("Đã lưu tiến độ học tập")).not.toBeInTheDocument();
  });
  it("admin retains their management tab, but not sync tab",()=>{
    account.role="admin";
    window.history.replaceState(null,"","/account/?tab=security");
    render(<AccountTabs/>);
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab",{name:"Quản trị"})).toHaveAttribute("aria-selected","true");
    expect(screen.getByText("Restricted admin panel")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab",{name:"Tài khoản"}));
    expect(screen.getByRole("tabpanel",{name:"Tài khoản"})).not.toHaveAttribute("hidden");
    expect(screen.queryByRole("tab",{name:"Đồng bộ"})).not.toBeInTheDocument();
  });
  it("hides administrator controls immediately when the role changes",async()=>{
    account.role="admin";
    window.history.replaceState(null,"","/account/?tab=security");
    const {rerender}=render(<AccountTabs/>);
    account.role="user";rerender(<AccountTabs/>);
    await waitFor(()=>expect(window.location.search).toBe("?tab=profile"));
    expect(screen.queryByText("Restricted admin panel")).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });
});
