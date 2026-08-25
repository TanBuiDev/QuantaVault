"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function MobileHeader() {
  const pathname = usePathname();

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--page-translucent)] backdrop-blur-md lg:hidden">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-black text-white shadow-sm"
          >
            150
          </Link>
          <nav aria-label="Primary navigation" className="flex items-center gap-1">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${
                pathname === "/"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/problems"
              aria-current={pathname?.startsWith("/problems") ? "page" : undefined}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${
                pathname?.startsWith("/problems")
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Problems
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
            title="Tìm kiếm (Ctrl+K)"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <ThemeToggle compact />
        </div>
      </div>
    </header>
  );
}
