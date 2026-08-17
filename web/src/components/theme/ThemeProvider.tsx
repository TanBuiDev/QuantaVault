"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "top150-theme";
const LOCAL_CHANGE_EVENT = "top150-theme:change";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getBrowserTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerTheme(): Theme {
  return "light";
}

function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    listener();
  };
  const onLocalChange = () => listener();
  const onSystemChange = () => listener();

  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCAL_CHANGE_EVENT, onLocalChange);
  media?.addEventListener?.("change", onSystemChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCAL_CHANGE_EVENT, onLocalChange);
    media?.removeEventListener?.("change", onSystemChange);
  };
}

function publishTheme(theme: Theme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getBrowserTheme, getServerTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => publishTheme(nextTheme), []);
  const toggleTheme = useCallback(
    () => publishTheme(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
