"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { AppSidebar } from "./AppSidebar";
import { MobileHeader } from "./MobileHeader";
import { CommandPalette } from "./CommandPalette";

export interface AppShellProps {
  children: ReactNode;
}

function AppShellContent({ children }: { children: ReactNode }) {
  const { isOpen, toggleSidebar, setSidebarOpen } = useSidebar();

  // Keyboard shortcut: Ctrl + B to toggle sidebar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        toggleSidebar();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <div className="min-h-screen bg-[var(--page)] text-[var(--foreground)]">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-[var(--surface)] px-4 py-2 font-semibold text-[var(--foreground)] shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline focus:outline-2 focus:outline-[var(--focus)]"
      >
        Skip to content
      </a>

      {/* Backdrop for mobile when sidebar is open */}
      {isOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          aria-hidden="true"
        />
      )}

      <AppSidebar />
      <MobileHeader />
      <CommandPalette />

      {/* Main Content Area with smooth transition between 72 (288px) and 16 (64px) */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "lg:pl-72" : "lg:pl-16"
        }`}
      >
        <main
          id="main-content"
          className="mx-auto w-full max-w-[1800px] px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
