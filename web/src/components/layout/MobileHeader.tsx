"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function MobileHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:var(--page-translucent)] backdrop-blur lg:hidden">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--primary)] text-xs font-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
        >
          150
        </Link>
        <nav aria-label="Primary navigation" className="flex min-w-0 flex-1 items-center gap-1">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${pathname === "/" ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}
          >
            Dashboard
          </Link>
          <Link
            href="/problems"
            aria-current={pathname.startsWith("/problems") ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${pathname.startsWith("/problems") ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}
          >
            Problems
          </Link>
        </nav>
        <ThemeToggle compact />
      </div>
    </header>
  );
}
