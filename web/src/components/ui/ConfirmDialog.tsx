"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AlertTriangle, AlertCircle, HelpCircle, Info, X } from "lucide-react";
import { Button } from "./Button";

export type ConfirmVariant = "danger" | "warning" | "primary" | "info";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

function getVariantIcon(variant: ConfirmVariant) {
  switch (variant) {
    case "danger":
      return (
        <div className="grid size-12 place-items-center rounded-2xl bg-rose-500/10 text-rose-500 dark:bg-rose-500/20">
          <AlertTriangle className="h-6 w-6" />
        </div>
      );
    case "warning":
      return (
        <div className="grid size-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
          <AlertCircle className="h-6 w-6" />
        </div>
      );
    case "info":
      return (
        <div className="grid size-12 place-items-center rounded-2xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
          <Info className="h-6 w-6" />
        </div>
      );
    default:
      return (
        <div className="grid size-12 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20">
          <HelpCircle className="h-6 w-6" />
        </div>
      );
  }
}

function getConfirmButtonVariant(variant: ConfirmVariant) {
  switch (variant) {
    case "danger":
      return "danger" as const;
    case "warning":
      return "warning" as const;
    default:
      return "primary" as const;
  }
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve?: (value: boolean) => void;
  }>({
    isOpen: false,
    options: { message: "" },
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(
    (confirmed: boolean) => {
      if (state.resolve) {
        state.resolve(confirmed);
      }
      setState((prev) => ({ ...prev, isOpen: false }));
    },
    [state]
  );

  const { options, isOpen } = state;
  const variant = options.variant || "primary";

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop Glassmorphism */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-fade-in"
            onClick={() => handleClose(false)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl transition-all animate-scale-in sm:p-7">
            {/* Close button */}
            <button
              type="button"
              onClick={() => handleClose(false)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Hủy (Esc)"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {/* Icon badge */}
              <div className="mb-4">{getVariantIcon(variant)}</div>

              {/* Title & message */}
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
                  {options.title || "Xác nhận thao tác"}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--muted)]">
                  {options.message}
                </p>
              </div>

              {/* Actions footer */}
              <div className="mt-6 flex w-full flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClose(false)}
                  className="w-full sm:w-auto"
                >
                  {options.cancelText || "Hủy"}
                </Button>

                <Button
                  variant={getConfirmButtonVariant(variant)}
                  size="sm"
                  onClick={() => handleClose(true)}
                  className="w-full sm:w-auto"
                >
                  {options.confirmText || "Xác nhận"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return ctx.confirm;
}
