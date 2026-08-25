"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navigation = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    href: "/problems",
    label: "Problems",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--border)] bg-[var(--sidebar)] lg:flex lg:flex-col">
      {/* Brand Header */}
      <div className="flex h-20 items-center border-b border-[var(--border)] px-5">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-black tracking-tight text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            150
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-[var(--foreground)]">Top Interview 150</span>
            <span className="block truncate text-xs font-medium text-[var(--muted)]">Java Study Hub</span>
          </span>
        </Link>
      </div>

      {/* Quick Search Button */}
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={openSearch}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-xs font-medium text-[var(--muted)] shadow-2xs hover:border-[var(--border-strong)] hover:text-[var(--foreground)] transition-all"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span>Tìm kiếm...</span>
          </span>
          <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted-strong)]">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Primary navigation" className="flex-1 px-3 py-5">
        <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Study Hub</p>
        <ul className="mt-2 space-y-1.5">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href) === true;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-2xl px-3.5 text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-[var(--primary)] text-white shadow-sm shadow-indigo-500/20"
                      : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span aria-hidden="true" className="shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer & Theme Toggle */}
      <div className="border-t border-[var(--border)] p-4 space-y-3">
        <ThemeToggle />
        <p className="px-1 text-[11px] leading-relaxed text-[var(--muted)]">
          Dữ liệu ghi nhớ trong trình duyệt. Tự tin chinh phục 150 câu hỏi LeetCode.
        </p>
      </div>
    </aside>
  );
}
