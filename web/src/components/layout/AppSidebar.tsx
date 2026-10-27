"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Search,
  Layers,
  GraduationCap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSidebar } from "./SidebarContext";
import { ProblemNavTree } from "./ProblemNavTree";

export function AppSidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, setSidebarOpen } = useSidebar();

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  }

  // Tự động đóng sidebar trên mobile khi chuyển trang
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[var(--border)] bg-[var(--sidebar)] transition-all duration-300 ease-in-out ${
        isOpen
          ? "w-72 translate-x-0"
          : "-translate-x-full lg:translate-x-0 lg:w-16"
      }`}
    >
      {/* 1. Header Bar: Brand & Burger Button */}
      <div className="flex h-16 shrink-0 items-center border-b border-[var(--border)] px-3">
        {isOpen ? (
          <div className="flex w-full items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)] min-w-0"
            >
              <img
                src="/brand-logo.png"
                alt="Logo Java"
                className="size-9 shrink-0 rounded-xl object-cover shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <span className="block truncate text-xs font-bold text-[var(--foreground)] tracking-tight">QuantaVault</span>
                <span className="block truncate text-[10px] font-medium text-[var(--muted)]">Knowledge Engine</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-xl p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Thu gọn thanh bên (Ctrl+B)"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-1">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Mở rộng thanh bên (Ctrl+B)"
            >
              <PanelLeftOpen className="h-5 w-5 text-indigo-500" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Middle Content Area */}
      {isOpen ? (
        /* EXPANDED SIDEBAR (w-72) */
        <>
          {/* Quick Search Button */}
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={openSearch}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-xs font-medium text-[var(--muted)] shadow-2xs hover:border-[var(--border-strong)] hover:text-[var(--foreground)] transition-all"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span>Tìm kiếm bài tập...</span>
              </span>
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted-strong)]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Navigation & Problem Accordion Tree */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3">
            <div className="px-1 space-y-1">
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  pathname === "/"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>Dashboard Tổng Quan</span>
              </Link>

              <Link
                href="/interview"
                aria-current={pathname?.startsWith("/interview") ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  pathname?.startsWith("/interview")
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                <GraduationCap className="h-4 w-4 shrink-0 text-indigo-400" />
                <span>Phỏng vấn Java</span>
                <span className="ml-auto rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  Mới
                </span>
              </Link>
            </div>

            <div className="border-t border-[var(--border)] pt-2">
              <ProblemNavTree />
            </div>
          </div>

          {/* Expanded Footer */}
          <div className="shrink-0 border-t border-[var(--border)] p-3 space-y-2">
            <ThemeToggle />
            <p className="px-1 text-[10px] leading-relaxed text-[var(--muted)]">
              Tự tin làm chủ 150 thuật toán phỏng vấn hàng đầu.
            </p>
          </div>
        </>
      ) : (
        /* COLLAPSED MINI-RAIL (w-16) */
        <div className="flex flex-1 flex-col items-center justify-between py-4">
          <div className="flex flex-col items-center gap-3">
            {/* Quick Logo to Home */}
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-xl overflow-hidden shadow-sm hover:scale-105 transition-transform"
              title="QuantaVault"
            >
              <img
                src="/brand-logo.png"
                alt="Logo Java"
                className="size-8 rounded-xl object-cover"
              />
            </Link>

            {/* Mini Dashboard Icon */}
            <Link
              href="/"
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                pathname === "/"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Link>

            {/* Mini Interview Icon */}
            <Link
              href="/interview"
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                pathname?.startsWith("/interview")
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
              title="Phỏng vấn Java"
            >
              <GraduationCap className="h-4 w-4" />
            </Link>

            {/* Mini Problems Icon (Click to open sidebar and browse tree) */}
            <button
              type="button"
              onClick={toggleSidebar}
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                pathname?.startsWith("/problems")
                  ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
              title="Danh sách 150 bài tập (Mở rộng)"
            >
              <Layers className="h-4 w-4" />
            </button>

            {/* Mini Search Icon */}
            <button
              type="button"
              onClick={openSearch}
              className="flex size-9 items-center justify-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Tìm kiếm (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Mini Footer Theme Toggle */}
          <div className="flex flex-col items-center gap-2">
            <ThemeToggle compact />
          </div>
        </div>
      )}
    </aside>
  );
}
