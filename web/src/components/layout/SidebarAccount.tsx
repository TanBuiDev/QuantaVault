"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Cloud, LogIn, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { useAccount } from "@/lib/auth/AccountProvider";

export function SidebarAccount({ compact = false }: { compact?: boolean }) {
  const { user, loading, logout, syncStatus } = useAccount();
  const [open, setOpen] = useState(false);
  if (loading) return <div aria-label="Đang xác minh tài khoản" className={compact ? "size-9 rounded-full bg-[var(--surface-hover)] animate-pulse" : "h-11 rounded-xl bg-[var(--surface-hover)] animate-pulse"} />;
  if (!user) {
    return compact
      ? <a href="/api/auth/google/start" title="Đăng nhập Google" aria-label="Đăng nhập Google" className="flex size-9 items-center justify-center rounded-xl border border-[var(--border)] text-indigo-500"><LogIn className="h-4 w-4" /></a>
      : <a href="/api/auth/google/start" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2.5 text-xs font-semibold text-white"><LogIn className="h-4 w-4" /> Tiếp tục với Google</a>;
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
