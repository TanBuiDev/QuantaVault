"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSidebar } from "./SidebarContext";

export function MobileHeader() {
  const { toggleSidebar } = useSidebar();

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--page-translucent)] backdrop-blur-md lg:hidden">
      <div className="flex min-h-14 items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2.5">
          {/* Mobile Burger Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-2xs hover:bg-[var(--surface-hover)] transition-colors"
            title="Mở danh sách bài tập"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl"
          >
            <img
              src="/brand-logo.png"
              alt="Logo Java"
              className="size-8 rounded-xl object-cover shadow-xs"
            />
            <span className="font-bold text-xs text-[var(--foreground)]">Top 150</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
            title="Tìm kiếm (Ctrl+K)"
          >
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle compact />
        </div>
      </div>
    </header>
  );
}
