"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import controls from "@/components/ui/SidebarControl.module.css";
import { useAccount } from "@/lib/auth/AccountProvider";

function GoogleLogo() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 48 48" className={controls.icon} xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.8 7.18l7.73 6C44.38 38.03 46.98 31.88 46.98 24.55z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.39 14.39 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

const menuItem = "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus)]";

export function SidebarAccount({ compact = false }: { compact?: boolean }) {
  const { user, loading, logout, syncStatus } = useAccount();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const controlClass = `${controls.control} ${compact ? controls.compact : ""}`;

  if (loading) {
    return <div aria-label="Đang xác minh tài khoản" className={`${controlClass} ${controls.loading} motion-safe:animate-pulse`} />;
  }
  if (!user) {
    return (
      <a
        href="/api/auth/google/start"
        title="Đăng nhập bằng Google"
        aria-label="Đăng nhập bằng Google"
        className={`${controlClass} ${controls.centerContent}`}
      >
        <GoogleLogo />
        {!compact && <span className="truncate">Đăng nhập</span>}
      </a>
    );
  }

  const avatar = user.picture && /^https:\/\/([a-z0-9-]+\.)?googleusercontent\.com\//i.test(user.picture)
    ? <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-7 shrink-0 rounded-full object-cover" />
    : <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] text-[var(--primary-strong)]"><UserRound className="size-4" /></span>;

  return (
    <div
      className="relative min-w-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="Mở menu tài khoản"
        title="Tài khoản Google"
        onClick={() => setOpen(value => !value)}
        className={controlClass}
      >
        {avatar}
        {!compact && (
          <>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-xs" title={user.name}>{user.name}</span>
              <span className="block truncate text-[11px] font-normal text-[var(--muted)]" title={user.email}>{user.email}</span>
            </span>
            <ChevronDown aria-hidden="true" className={`size-3.5 shrink-0 text-[var(--muted)] ${open ? "rotate-180" : ""}`} />
          </>
        )}
      </button>
      {open && (
        <div
          id={menuId}
          className={`absolute bottom-full left-0 z-10 mb-2 max-h-[max(2rem,calc(100dvh-7rem))] space-y-1 overflow-y-auto overscroll-contain rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 text-xs shadow-lg ${compact ? "w-56" : "w-full"}`}
        >
          <Link href="/account/?tab=profile" onClick={() => setOpen(false)} className={menuItem}><Settings className="size-4 shrink-0" /> Quản lý tài khoản</Link>
          {syncStatus === "conflict" && (
            <Link href="/account/?tab=profile#progress-sync" onClick={() => setOpen(false)} className={menuItem}><AlertTriangle className="size-4 shrink-0" /> Cần kiểm tra tiến độ</Link>
          )}
          {user.role === "admin" && (
            <Link href="/account/?tab=security" onClick={() => setOpen(false)} className={menuItem}><ShieldCheck className="size-4 shrink-0" /> Quản trị nội dung</Link>
          )}
          <button type="button" onClick={() => void logout()} className={menuItem}><LogOut className="size-4 shrink-0" /> Đăng xuất</button>
        </div>
      )}
    </div>
  );
}
