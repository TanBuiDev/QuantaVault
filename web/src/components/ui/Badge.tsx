import type { HTMLAttributes } from "react";

import { classNames } from "./classNames";

type BadgeVariant = "neutral" | "success" | "warning" | "info";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-800 ring-amber-600/20",
  info: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
