"use client";

import { Moon, Sun } from "lucide-react";
import controls from "@/components/ui/SidebarControl.module.css";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? Moon : Sun;
  const label = isDark ? "Giao diện tối" : "Giao diện sáng";
  const target = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${target} mode`}
      title={`${label} · Chuyển sang giao diện ${isDark ? "sáng" : "tối"}`}
      className={`${controls.control} ${compact ? controls.compact : ""}`}
    >
      <Icon aria-hidden="true" className={controls.icon} />
      {!compact && <span className="truncate">{label}</span>}
    </button>
  );
}
