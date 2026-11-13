import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccountTabs } from "../AccountTabs";
vi.mock("@/lib/auth/AccountProvider",()=>({
  useAccount:()=>({user:{id:"a",name:"Test",email:"user@example.com",role:"user"},loading:false,logout:vi.fn()})
}));
vi.mock("../GoogleAccountPanel",()=>({GoogleAccountPanel:()=> <div>Progress sync panel</div>}));
vi.mock("../AdminAccountPanel",()=>({AdminAccountPanel:()=> <div>Restricted admin panel</div>}));
vi.mock("../InterviewCloudSync",()=>({InterviewCloudSync:()=> <div>Legacy recovery</div>}));
describe("Account route tabs",()=>{
  beforeEach(()=>{window.history.replaceState(null,"","/account/");});
  it("opens independent profile, sync and security panels",()=>{
    render(<AccountTabs/>);
    expect(screen.getByRole("tab",{name:"Tài khoản"})).toHaveAttribute("aria-selected","true");
    fireEvent.click(screen.getByRole("tab",{name:"Đồng bộ"}));
    expect(window.location.search).toContain("tab=sync");
    expect(screen.getByRole("tabpanel",{name:"Đồng bộ"})).not.toHaveAttribute("hidden");
    fireEvent.click(screen.getByRole("tab",{name:"Bảo mật"}));
    expect(window.location.search).toContain("tab=security");
    expect(screen.getByRole("tabpanel",{name:"Bảo mật"})).not.toHaveAttribute("hidden");
    expect(screen.queryByText("Restricted admin panel")).not.toBeInTheDocument();
  });
  it("accepts links from the legacy hash navigation",()=>{
    window.history.replaceState(null,"","/account/#administration");
    render(<AccountTabs/>);
    expect(screen.getByRole("tab",{name:"Bảo mật"})).toHaveAttribute("aria-selected","true");
  });
});
