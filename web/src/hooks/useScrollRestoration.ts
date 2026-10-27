"use client";

import { useEffect, useRef } from "react";

/**
 * Custom hook to preserve and restore scroll position across reloads (F5) and client navigation.
 * Also supports auto-scrolling to URL hash targets (e.g., #question-java-core-001).
 *
 * @param storageKey Unique key for this page/route in sessionStorage
 * @param isReady Boolean indicating when content is mounted and ready for scroll measurement
 */
export function useScrollRestoration(storageKey: string, isReady = true) {
  const hasRestoredRef = useRef(false);

  // 1. Restore scroll position or target hash when content is ready
  useEffect(() => {
    if (!isReady || hasRestoredRef.current || typeof window === "undefined") return;

    // Check if there is an anchor hash first
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) {
      const targetEl = document.getElementById(hash);
      if (targetEl) {
        hasRestoredRef.current = true;
        // Small delay to allow CSS transitions and layouts to stabilize
        window.requestAnimationFrame(() => {
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          targetEl.classList.add("ring-2", "ring-indigo-500", "shadow-xl");
          setTimeout(() => {
            targetEl.classList.remove("ring-2", "ring-indigo-500", "shadow-xl");
          }, 2000);
        });
        return;
      }
    }

    // Otherwise restore saved Y coordinate from sessionStorage
    try {
      const savedY = sessionStorage.getItem(storageKey);
      if (savedY !== null) {
        const top = parseInt(savedY, 10);
        if (!isNaN(top) && top > 0) {
          hasRestoredRef.current = true;
          window.requestAnimationFrame(() => {
            window.scrollTo({ top, behavior: "instant" });
          });
        }
      }
    } catch {
      // Ignore sessionStorage access errors
    }
  }, [storageKey, isReady]);

  // 2. Throttled scroll listener to record current scroll position
  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timeoutId !== null) return;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        try {
          sessionStorage.setItem(storageKey, String(window.scrollY));
        } catch {
          // Ignore quota errors
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [storageKey]);
}
