"use client";

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedToggleProps {
  label: string;
  value: string;
  options: SegmentedOption[];
  onChange: (value: string) => void;
}

/** Accessible segmented buttons used by course practice modes and translation directions. */
export function SegmentedToggle({ label, value, options, onChange }: SegmentedToggleProps) {
  return (
    <div role="group" aria-label={label} className="inline-flex w-full rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/70 p-1 sm:w-auto">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={"min-w-0 flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:flex-none " +
            (value === option.value
              ? "bg-[var(--surface)] text-[var(--foreground)] shadow-sm ring-1 ring-[var(--border)]"
              : "text-[var(--muted-strong)] hover:text-[var(--foreground)]")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
