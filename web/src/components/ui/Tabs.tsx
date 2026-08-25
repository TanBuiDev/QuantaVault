"use client";

import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { classNames } from "./classNames";

export interface TabItem {
  id: string;
  label: string;
  badge?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: readonly TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function Tabs({ items, value, onValueChange, ariaLabel = "Sections", className }: TabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusRelativeTab(currentIndex: number, direction: 1 | -1) {
    if (items.length === 0) return;
    for (let offset = 1; offset <= items.length; offset += 1) {
      const nextIndex = (currentIndex + direction * offset + items.length) % items.length;
      if (!items[nextIndex]?.disabled) {
        refs.current[nextIndex]?.focus();
        onValueChange(items[nextIndex].id);
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusRelativeTab(index, 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusRelativeTab(index, -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const enabledIndexes = items
        .map((item, itemIndex) => (item.disabled ? -1 : itemIndex))
        .filter((itemIndex) => itemIndex >= 0);
      const nextIndex = event.key === "Home" ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1];
      if (nextIndex !== undefined) {
        refs.current[nextIndex]?.focus();
        onValueChange(items[nextIndex].id);
      }
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={classNames(
        "inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] p-1 shadow-inner backdrop-blur-sm",
        className,
      )}
    >
      {items.map((item, index) => {
        const isActive = item.id === value;
        return (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onValueChange(item.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={classNames(
              "relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-40 select-none",
              isActive
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs ring-1 ring-[var(--border)] font-bold"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]/50",
            )}
          >
            {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
            <span>{item.label}</span>
            {item.badge ? (
              <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold">{item.badge}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

