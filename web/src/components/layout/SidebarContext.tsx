"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface SidebarContextValue {
  isOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpenState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    if (window.innerWidth < 1024) return false;
    try {
      const saved = localStorage.getItem("sidebar_open_preference");
      if (saved !== null) return saved === "true";
    } catch {
      // ignore
    }
    return true;
  });


  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1024) {
        setIsOpenState(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpenState((prev) => {
      const next = !prev;
      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
        try {
          localStorage.setItem("sidebar_open_preference", String(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
  }, []);

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      try {
        localStorage.setItem("sidebar_open_preference", String(open));
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, setSidebarOpen }}>
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
