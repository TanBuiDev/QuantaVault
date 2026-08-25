import { classNames } from "./classNames";

export type ProgressVariant = "primary" | "success" | "warning" | "danger";
export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showPercent?: boolean;
}

const variantGradients: Record<ProgressVariant, string> = {
  primary: "bg-gradient-to-r from-indigo-500 to-violet-600",
  success: "bg-gradient-to-r from-emerald-500 to-teal-500",
  warning: "bg-gradient-to-r from-amber-500 to-orange-500",
  danger: "bg-gradient-to-r from-rose-500 to-red-600",
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

export function ProgressBar({
  value,
  max = 100,
  label = "Progress",
  className,
  variant = "primary",
  size = "md",
  showPercent = false,
}: ProgressBarProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), safeMax) : 0;
  const percent = Math.round((safeValue / safeMax) * 100);

  return (
    <div className="w-full space-y-1">
      {showPercent && (
        <div className="flex justify-between text-xs font-semibold text-[var(--muted)]">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        className={classNames(
          "w-full overflow-hidden rounded-full bg-[var(--surface-hover)] ring-1 ring-inset ring-[var(--border)]",
          sizeClasses[size],
          className,
        )}
      >
        <div
          className={classNames(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantGradients[variant],
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

