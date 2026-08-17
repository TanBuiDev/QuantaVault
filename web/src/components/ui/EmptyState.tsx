import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-12 text-center">
      <h2 className="text-lg font-bold text-[var(--foreground)]">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </section>
  );
}
