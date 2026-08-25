import type { HTMLAttributes } from "react";

import { classNames } from "./classNames";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info" | "primary";

const variantClasses: Record<BadgeVariant, string> = {
  neutral:
    "bg-slate-100 text-slate-700 ring-slate-500/15 dark:bg-slate-800/80 dark:text-slate-200 dark:ring-slate-400/20",
  success:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-400/30",
  warning:
    "bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-400/30",
  danger:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/60 dark:text-rose-300 dark:ring-rose-400/30",
  info:
    "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-400/30",
  primary:
    "bg-indigo-50 text-indigo-700 ring-indigo-600/25 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-400/30",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ className, variant = "neutral", dot = false, children, ...props }: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset transition-colors",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={classNames(
            "h-1.5 w-1.5 rounded-full",
            variant === "success"
              ? "bg-emerald-500"
              : variant === "warning"
              ? "bg-amber-500"
              : variant === "danger"
              ? "bg-rose-500"
              : variant === "info"
              ? "bg-blue-500"
              : variant === "primary"
              ? "bg-indigo-500"
              : "bg-slate-400"
          )}
        />
      )}
      {children}
    </span>
  );
}

