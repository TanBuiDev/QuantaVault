import type { ButtonHTMLAttributes, ReactNode } from "react";

import { classNames } from "./classNames";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white shadow-sm shadow-indigo-500/20 hover:brightness-110 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--foreground)] shadow-xs hover:bg-[var(--surface-hover)] hover:border-[var(--border)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:text-[var(--muted)]",
  outline:
    "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-hover)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50",
  ghost:
    "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:text-[var(--muted)]",
  danger:
    "bg-rose-500 text-white shadow-sm shadow-rose-500/20 hover:bg-rose-600 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs rounded-lg gap-1.5",
  sm: "h-9 px-3.5 text-sm rounded-xl gap-2",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-11 px-5 text-base rounded-xl gap-2.5",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classNames(
        "inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none focus-visible:outline-none disabled:cursor-not-allowed disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!isLoading && rightIcon ? rightIcon : null}
    </button>
  );
}

