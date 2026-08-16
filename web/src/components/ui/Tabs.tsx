"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";

import { classNames } from "./classNames";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: readonly TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function Tabs({
  items,
  value,
  onValueChange,
  ariaLabel = "Sections",
  className,
}: TabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusRelativeTab(currentIndex: number, direction: 1 | -1) {
    if (items.length === 0) return;

    for (let offset = 1; offset <= items.length; offset += 1) {
      const nextIndex =
        (currentIndex + direction * offset + items.length) % items.length;
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
      const nextIndex =
        event.key === "Home"
          ? enabledIndexes[0]
          : enabledIndexes[enabledIndexes.length - 1];
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
        "inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1",
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
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-600 hover:text-slate-950",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
