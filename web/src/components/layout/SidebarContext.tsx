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
    const frame = window.requestAnimationFrame(() => {
      setIsMounted(true);
      try {
        if (window.innerWidth < 1024) {
          setIsOpenState(false);
        } else {
          const saved = localStorage.getItem("sidebar_open_preference");
          if (saved !== null) {
            setIsOpenState(saved === "true");
          } else {
            setIsOpenState(true);
          }
        }
      } catch {
        // ignore
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

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
