"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Cloud, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { useAccount } from "@/lib/auth/AccountProvider";

function GoogleLogo() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" className="size-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.8 7.18l7.73 6C44.38 38.03 46.98 31.88 46.98 24.55z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.39 14.39 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function SidebarAccount({ compact = false }: { compact?: boolean }) {
  const { user, loading, logout, syncStatus } = useAccount();
  const [open, setOpen] = useState(false);
  if (loading) return <div aria-label="Đang xác minh tài khoản" className={compact ? "size-9 rounded-full bg-[var(--surface-hover)] animate-pulse" : "h-11 rounded-xl bg-[var(--surface-hover)] animate-pulse"} />;
  if (!user) {
    return compact ? (
      <a
        href="/api/auth/google/start"
        title="Đăng nhập bằng Google"
        aria-label="Đăng nhập bằng Google"
        className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#dadce0] bg-white transition-colors hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:hover:bg-[var(--surface-hover)]"
      >
        <GoogleLogo />
      </a>
    ) : (
      <a
        href="/api/auth/google/start"
        aria-label="Đăng nhập bằng Google"
        className="inline-flex h-9 w-fit max-w-full items-center justify-center gap-2 rounded-xl border border-[#dadce0] bg-white px-3 text-xs font-semibold text-[#202124] transition-colors hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] dark:border-[var(--border)] dark:bg-[var(--surface)] dark:text-[var(--foreground)] dark:hover:bg-[var(--surface-hover)]"
      >
        <GoogleLogo />
        <span className="whitespace-nowrap">Đăng nhập</span>
      </a>
    );
  }
  const avatar = user.picture && /^https:\/\/([a-z0-9-]+\.)?googleusercontent\.com\//i.test(user.picture)
    ? <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-9 shrink-0 rounded-full object-cover" />
    : <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600"><UserRound className="h-4 w-4" /></span>;
  if (compact) return <Link href="/account/" aria-label="Quản lý tài khoản Google" title="Tài khoản Google" className="inline-flex">{avatar}</Link>;
  return (
    <div className="space-y-2">
      <button type="button" aria-expanded={open} aria-label="Mở menu tài khoản" onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 text-left hover:bg-[var(--surface-hover)]">
        {avatar}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-[var(--foreground)]">{user.name}</span>
          <span className="block truncate text-[10px] text-[var(--muted)]">{user.email}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-[var(--muted)]" />
      </button>
      {open && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 space-y-1 text-xs">
          <Link href="/account/" className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[var(--surface-hover)]"><Settings className="h-4 w-4" /> Quản lý tài khoản</Link>
          <Link href="/account/#sync" className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[var(--surface-hover)]">
            <Cloud className="h-4 w-4" /> Đồng bộ: {syncStatus === "synced" ? "Đã đồng bộ" : syncStatus === "conflict" ? "Cần đối chiếu" : syncStatus === "offline" ? "Chưa kết nối" : syncStatus === "syncing" ? "Đang lưu" : "Chưa liên kết"}
          </Link>
          {user.role === "admin" && <Link href="/account/#administration" className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-[var(--surface-hover)]"><ShieldCheck className="h-4 w-4" /> Quản trị nội dung</Link>}
          <button type="button" onClick={() => void logout()} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-[var(--surface-hover)]"><LogOut className="h-4 w-4" /> Đăng xuất</button>
        </div>
      )}
    </div>
  );
}
