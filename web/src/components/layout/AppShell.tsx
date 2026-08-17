import type { ReactNode } from "react";

import { AppSidebar } from "./AppSidebar";
import { MobileHeader } from "./MobileHeader";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--foreground)]">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-[var(--surface)] px-4 py-2 font-semibold text-[var(--foreground)] shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline focus:outline-2 focus:outline-[var(--focus)]"
      >
        Skip to content
      </a>
      <AppSidebar />
      <MobileHeader />
      <div className="lg:pl-64">
        <main
          id="main-content"
          className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
