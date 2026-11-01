import type { ProblemContent } from "@/lib/content";
import { mediaUrl } from "@/lib/content/mediaPaths";
export function MediaGallery({ items, problemId }: { items: NonNullable<ProblemContent["media"]>; problemId: number; }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4" aria-label="Illustrations">
      {items.map((item) => (
        <figure key={item.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]">
          {/* Canonical media has variable dimensions; keep its intrinsic aspect ratio. */}
          <img src={mediaUrl(problemId, item.path)} alt={item.altEn} loading="lazy" className="mx-auto max-h-[32rem] w-auto max-w-full object-contain" />
          <figcaption className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--muted)]">{item.altVi}</figcaption>
        </figure>
      ))}
    </div>
  );
}
