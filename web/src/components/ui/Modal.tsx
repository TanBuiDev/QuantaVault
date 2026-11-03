"use client";

import React, { useEffect, type ReactNode } from "react";
import { classNames } from "./classNames";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  contentClassName?: string;
  fullScreen?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "2xl",
  className,
  contentClassName,
  fullScreen = false,
}: ModalProps) {
  // Đóng modal khi nhấn Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Khóa cuộn trang khi modal đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={classNames(
        "fixed inset-0 z-50 flex items-center justify-center",
        fullScreen ? "p-0" : "p-4 sm:p-6"
      )}
    >
      {/* Backdrop Glassmorphism */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card Content */}
      <div
        className={classNames(
          "flex w-full flex-col bg-[var(--surface)] shadow-2xl isolate",
          fullScreen
            ? "absolute inset-0 min-h-0 max-h-none max-w-none rounded-none border-0"
            : classNames("relative max-h-[90vh] rounded-3xl border border-[var(--border)] transition-all animate-scale-in transform-gpu", maxWidthClasses[maxWidth]),
          className
        )}
      >
        {(title || description) && (
          <header className="flex items-start justify-between border-b border-[var(--border)] px-6 py-5 sm:px-7">
            <div className="space-y-1">
              {title && <h2 className="text-xl font-bold text-[var(--foreground)] tracking-tight">{title}</h2>}
              {description && <p className="text-xs text-[var(--muted)]">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Đóng (Esc)"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
        )}

        <div className={classNames("flex-1 min-h-0", fullScreen ? "overflow-hidden" : "overflow-y-auto", contentClassName ?? "px-6 py-5 sm:px-7")}>
          {children}
        </div>
      </div>
    </div>
  );
}
