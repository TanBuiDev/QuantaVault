"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface SidebarContextValue {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpenState] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("sidebar_open_preference");
      if (saved !== null) {
        setIsOpenState(saved === "true");
      } else {
        // Default: open on desktop (>=1024), closed on mobile
        setIsOpenState(window.innerWidth >= 1024);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpenState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar_open_preference", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
    try {
      localStorage.setItem("sidebar_open_preference", String(open));
    } catch {
      // ignore
    }
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen: isMounted ? isOpen : true, toggleSidebar, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}
