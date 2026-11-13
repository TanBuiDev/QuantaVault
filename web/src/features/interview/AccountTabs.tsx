"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, CloudOff, LoaderCircle } from "lucide-react";
import { useAccount } from "@/lib/auth/AccountProvider";
import { googleLoginHref } from "@/lib/auth/loginReturn";
import { GoogleAccountPanel } from "./GoogleAccountPanel";
import { GoogleLearningSyncPanel } from "./GoogleLearningSyncPanel";
import { AdminAccountPanel } from "./AdminAccountPanel";

type AccountTab = "profile" | "security";
const TABS: { id:AccountTab;label:string }[] = [
  {id:"profile",label:"Tài khoản"},
  {id:"security",label:"Quản trị"},
];
function selectedTab(isAdmin:boolean):AccountTab {
  const url=new URL(window.location.href);
  return isAdmin && (url.hash==="#administration" || url.searchParams.get("tab")==="security") ? "security" : "profile";
}
const progressStatus={
  synced:{title:"Đã lưu tiến độ học tập",detail:"Tiến độ của bạn được tự động cập nhật khi sử dụng các thiết bị khác.",icon:CheckCircle2,color:"text-emerald-600 dark:text-emerald-400"},
  syncing:{title:"Đang lưu tiến độ",detail:"Các thay đổi của bạn đang được cập nhật.",icon:LoaderCircle,color:"text-[var(--primary-strong)]"},
  offline:{title:"Chưa thể kết nối",detail:"Tiến độ vẫn được giữ trên thiết bị này và sẽ đồng bộ khi có kết nối.",icon:CloudOff,color:"text-amber-600"},
  conflict:{title:"Cần kiểm tra tiến độ",detail:"Có dữ liệu cần được đối chiếu trước khi tiếp tục đồng bộ. Tiến độ hiện tại vẫn được giữ nguyên.",icon:AlertTriangle,color:"text-amber-600"},
  unlinked:{title:"Đang chuẩn bị đồng bộ",detail:"Tiến độ của bạn sẽ được tự động lưu vào tài khoản.",icon:LoaderCircle,color:"text-[var(--muted-strong)]"},
} as const;

export function AccountTabs() {
  const [tab,setTab]=useState<AccountTab>("profile");
  const {user,loading,logout,syncStatus}=useAccount();
  const isAdmin=!loading && user?.role==="admin";
  useEffect(()=>{
    if(loading)return;
    const update=()=>{
      const next=selectedTab(isAdmin);
      setTab(next);
      const url=new URL(window.location.href);
      // Retired sync tab and non-admin security deep links open the account summary.
      if(url.hash==="#sync" || url.searchParams.get("tab")==="sync" ||
        (!isAdmin && (url.hash==="#administration" || url.searchParams.get("tab")==="security"))){
        url.searchParams.set("tab","profile");
        url.hash="";
        window.history.replaceState(null,"",url.pathname+url.search);
      }
    };
    update();
    window.addEventListener("popstate",update);
    window.addEventListener("hashchange",update);
    return ()=>{window.removeEventListener("popstate",update);window.removeEventListener("hashchange",update);};
  },[isAdmin,loading]);
  function choose(next:AccountTab) {
    if(next==="security" && !isAdmin)return;
    setTab(next);
    const url=new URL(window.location.href);
    url.searchParams.set("tab",next);
    url.hash="";
    window.history.pushState(null,"",url.pathname+url.search);
  }
  const avatar=user?.picture && /^https:\/\/([a-z0-9-]+\.)?googleusercontent\.com\//i.test(user.picture)
    ? <img src={user.picture} alt="" className="size-14 rounded-full object-cover" referrerPolicy="no-referrer"/>
    : <span className="grid size-14 place-items-center rounded-full bg-[var(--primary-soft)] text-xl font-semibold text-[var(--primary-strong)]">{user?.name?.charAt(0).toUpperCase()||"G"}</span>;
  const status=progressStatus[syncStatus]??progressStatus.unlinked;
  const StatusIcon=status.icon;
  return (
    <div className="space-y-5">
      {isAdmin && <div role="tablist" aria-label="Cài đặt tài khoản" className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
        {TABS.map(item=><button key={item.id} id={"account-tab-"+item.id} type="button" role="tab" aria-selected={tab===item.id} aria-controls={"account-panel-"+item.id}
          onClick={()=>choose(item.id)}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] ${tab===item.id ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]" : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)]"}`}>
          {item.label}
        </button>)}
      </div>}
      <section id="account-panel-profile" role={isAdmin ? "tabpanel" : undefined} aria-labelledby={isAdmin ? "account-tab-profile" : undefined} hidden={isAdmin && tab!=="profile"}
        className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <h2 className="text-base font-semibold">Thông tin tài khoản</h2>
        {loading ? <p className="text-sm text-[var(--muted)]">Đang tải thông tin tài khoản...</p>
          : user ? <>
            <div className="flex min-w-0 items-center gap-4">{avatar}
              <div className="min-w-0">
                <p className="break-words font-semibold">{user.name}</p>
                <p className="break-all text-sm text-[var(--muted-strong)]">{user.email}</p>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">Đã đăng nhập bằng Google{user.role==="admin" ? " · Quản trị viên" : ""}</p>
              </div>
            </div>
            <div id="progress-sync" role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3">
              <StatusIcon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${status.color}`}/>
              <div>
                <p className="text-sm font-semibold">{status.title}</p>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">{status.detail}</p>
              </div>
            </div>
            {syncStatus==="conflict" && <div className="space-y-3" aria-label="Khôi phục tiến độ học tập">
              <GoogleAccountPanel key={user.id}/>
              <GoogleLearningSyncPanel key={user.id}/>
            </div>}
            <button type="button" onClick={()=>void logout()} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium">Đăng xuất</button>
          </> : <div className="space-y-3">
            <p className="text-sm text-[var(--muted-strong)]">Đăng nhập Google để tự lưu và khôi phục tiến độ trên các thiết bị.</p>
            <a href="/api/auth/google/start" onClick={event=>{event.preventDefault();window.location.assign(googleLoginHref());}} className="inline-flex rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">Tiếp tục với Google</a>
          </div>}
      </section>
      {isAdmin && <section id="account-panel-security" role="tabpanel" aria-labelledby="account-tab-security" hidden={tab!=="security"} className="space-y-4">
        <AdminAccountPanel key={user?.id ?? "admin"}/>
      </section>}
    </div>
  );
}
