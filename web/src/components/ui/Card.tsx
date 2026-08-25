import type { HTMLAttributes } from "react";

import { classNames } from "./classNames";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glass?: boolean;
}

export function Card({ className, interactive = false, glass = false, ...props }: CardProps) {
  return (
    <div
      className={classNames(
        "rounded-2xl border border-[var(--border)] transition-all duration-200",
        glass ? "glass shadow-md" : "bg-[var(--surface)] shadow-xs",
        interactive &&
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--border-strong)] hover:bg-[var(--surface-hover)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames("space-y-1.5 p-5 sm:p-6", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames("p-5 sm:p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={classNames(
        "flex items-center gap-3 border-t border-[var(--border)] px-5 py-4 sm:px-6",
        className,
      )}
      {...props}
    />
  );
}

