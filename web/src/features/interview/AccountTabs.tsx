"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/lib/auth/AccountProvider";
import { GoogleAccountPanel } from "./GoogleAccountPanel";
import { GoogleLearningSyncPanel } from "./GoogleLearningSyncPanel";
import { AdminAccountPanel } from "./AdminAccountPanel";
import { InterviewCloudSync } from "./InterviewCloudSync";

type AccountTab = "profile" | "sync" | "security";
const TABS: { id:AccountTab;label:string }[] = [
  {id:"profile",label:"Tài khoản"},
  {id:"sync",label:"Đồng bộ"},
  {id:"security",label:"Bảo mật"},
];
function selectedTab():AccountTab {
  const hash=window.location.hash;
  if(hash==="#sync")return "sync";
  if(hash==="#administration")return "security";
  const tab=new URLSearchParams(window.location.search).get("tab");
  return tab==="sync"||tab==="security" ? tab : "profile";
}
export function AccountTabs() {
  const [tab,setTab]=useState<AccountTab>("profile");
  const {user,loading,logout}=useAccount();
  useEffect(()=>{
    const update=()=>setTab(selectedTab());
    update();
    window.addEventListener("popstate",update);
    window.addEventListener("hashchange",update);
    return ()=>{window.removeEventListener("popstate",update);window.removeEventListener("hashchange",update);};
  },[]);
  function choose(next:AccountTab) {
    setTab(next);
    const url=new URL(window.location.href);
    url.searchParams.set("tab",next);
    url.hash="";
    window.history.pushState(null,"",url.pathname+url.search);
  }
  const avatar=user?.picture && /^https:\/\/([a-z0-9-]+\.)?googleusercontent\.com\//i.test(user.picture)
    ? <img src={user.picture} alt="" className="size-14 rounded-full object-cover" referrerPolicy="no-referrer"/>
    : <span className="grid size-14 place-items-center rounded-full bg-[var(--primary-soft)] text-xl font-semibold text-[var(--primary-strong)]">{user?.name?.charAt(0).toUpperCase()||"G"}</span>;
  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Cài đặt tài khoản" className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
        {TABS.map(item=><button key={item.id} id={"account-tab-"+item.id} type="button" role="tab" aria-selected={tab===item.id} aria-controls={"account-panel-"+item.id}
          onClick={()=>choose(item.id)}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] ${tab===item.id ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]" : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)]"}`}>
          {item.label}
        </button>)}
      </div>
      <section id="account-panel-profile" role="tabpanel" aria-labelledby="account-tab-profile" hidden={tab!=="profile"}
        className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <h2 className="text-base font-semibold">Thông tin tài khoản</h2>
        {loading ? <p className="text-sm text-[var(--muted)]">Đang xác thực tài khoản...</p>
          : user ? <>
            <div className="flex min-w-0 items-center gap-4">{avatar}
              <div className="min-w-0">
                <p className="break-words font-semibold">{user.name}</p>
                <p className="break-all text-sm text-[var(--muted-strong)]">{user.email}</p>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">Đã đăng nhập bằng Google · Vai trò: {user.role==="admin"?"Quản trị viên":"Người dùng"}</p>
              </div>
            </div>
            <button type="button" onClick={()=>void logout()} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium">Đăng xuất</button>
          </> : <div className="space-y-3">
            <p className="text-sm text-[var(--muted-strong)]">Đăng nhập Google để tự lưu và khôi phục tiến độ trên các thiết bị.</p>
            <a href="/api/auth/google/start" className="inline-flex rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">Tiếp tục với Google</a>
          </div>}
      </section>
      <section id="account-panel-sync" role="tabpanel" aria-labelledby="account-tab-sync" hidden={tab!=="sync"} className="space-y-4">
        <GoogleAccountPanel />
        <GoogleLearningSyncPanel />
        <details className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <summary className="cursor-pointer text-sm font-semibold">Cài đặt nâng cao · Khôi phục dữ liệu cũ</summary>
          <p className="mt-3 text-xs text-[var(--muted-strong)]">Mã đồng bộ 64 ký tự chỉ dùng để nhập hoặc khôi phục tiến độ legacy. Không cần mã này khi đã đăng nhập Google. Trước khi khôi phục, hãy sao lưu và đối chiếu dữ liệu.</p>
          <div className="mt-3"><InterviewCloudSync /></div>
        </details>
      </section>
      <section id="account-panel-security" role="tabpanel" aria-labelledby="account-tab-security" hidden={tab!=="security"} className="space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
          <h2 className="font-semibold">Bảo mật tài khoản</h2>
          <p className="mt-2 text-[var(--muted-strong)]">{user ? "Phiên đăng nhập Google được xác thực ở máy chủ. Quyền quản trị được kiểm tra riêng cho từng API." : "Đăng nhập Google để xem thông tin bảo mật và quyền tài khoản."}</p>
        </div>
        <AdminAccountPanel />
      </section>
    </div>
  );
}
