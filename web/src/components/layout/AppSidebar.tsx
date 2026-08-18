"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navigation = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/problems", label: "Problems", icon: "▤" },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--border)] bg-[var(--sidebar)] lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-[var(--border)] px-5">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)]"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-[var(--primary)] text-sm font-black tracking-tight text-white shadow-sm">
            150
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-[var(--foreground)]">Top Interview 150</span>
            <span className="block truncate text-xs text-[var(--muted)]">Java study workspace</span>
          </span>
        </Link>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 px-3 py-5">
        <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Study</p>
        <ul className="mt-2 space-y-1">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href) === true;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] ${
                    active
                      ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]"
                      : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span aria-hidden="true" className="grid size-7 place-items-center text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--border)] p-4">
        <ThemeToggle />
        <p className="mt-3 px-1 text-xs leading-5 text-[var(--muted)]">
          Progress stays in this browser. Code and submit on LeetCode.
        </p>
      </div>
    </aside>
  );
}
