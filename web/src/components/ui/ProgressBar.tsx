import { classNames } from "./classNames";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label = "Progress",
  className,
}: ProgressBarProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value)
    ? Math.min(Math.max(value, 0), safeMax)
    : 0;
  const percent = (safeValue / safeMax) * 100;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      className={classNames(
        "h-2.5 overflow-hidden rounded-full bg-slate-200",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-slate-950 transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
