"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface AddApproachModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: number;
  onSuccess: () => void;
}

export function AddApproachModal({ isOpen, onClose, problemId, onSuccess }: AddApproachModalProps) {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("");
  const [spaceComplexity, setSpaceComplexity] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [solutionMarkdown, setSolutionMarkdown] = useState("");
  const [javaSource, setJavaSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const finalName = name.trim() !== "" ? name.trim() : "Cách giải mới";
    const finalJava = javaSource.trim() !== "" 
      ? javaSource.trim() 
      : `class Solution {\n    // Implementation\n}`;

    try {
      const res = await fetch("/api/approaches", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-workspace-request": "1" },
        body: JSON.stringify({
          problemId,
          name: finalName,
          tag: tag.trim(),
          timeComplexity: timeComplexity.trim(),
          spaceComplexity: spaceComplexity.trim(),
          isDefault,
          solutionMarkdown: solutionMarkdown.trim(),
          javaSource: finalJava,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu cách giải.");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title="Thêm cách giải mới"
      description={`Tạo thêm một hướng giải quyết (Approach) cho bài #${problemId}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 pt-1">
        {error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-500">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Tên cách giải (Tùy chọn)
            </span>
            <input
              type="text"
              placeholder="Ví dụ: Cách 2: Quy hoạch động O(n)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 transition-all"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Tag phân loại (Tùy chọn)
            </span>
            <input
              type="text"
              placeholder="Ví dụ: Optimal, Alternative, Brute-force"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 transition-all"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Time Complexity</span>
            <input
              type="text"
              placeholder="Ví dụ: O(n log n)"
              value={timeComplexity}
              onChange={(e) => setTimeComplexity(e.target.value)}
              className="h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 transition-all"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Space Complexity</span>
            <input
              type="text"
              placeholder="Ví dụ: O(1)"
              value={spaceComplexity}
              onChange={(e) => setSpaceComplexity(e.target.value)}
              className="h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 transition-all"
            />
          </label>
        </div>

        <label className="flex items-center gap-2.5 pt-1 text-sm font-medium text-[var(--foreground)] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-strong)] text-[var(--primary)] focus:ring-indigo-500 cursor-pointer"
          />
          <span>Đặt cách giải này làm mặc định hiển thị đầu tiên</span>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Code Java</span>
          <textarea
            rows={8}
            placeholder={`class Solution {\n    // Paste your Java implementation here\n}`}
            value={javaSource}
            onChange={(e) => setJavaSource(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            className="w-full font-mono text-xs leading-5 rounded-xl border border-[var(--border-strong)] bg-[var(--code-surface)] p-3 text-[var(--code-foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 [contain:content] [font-variant-ligatures:none]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Giải thích ý tưởng (Markdown)</span>
          <textarea
            rows={5}
            placeholder="## 1. Core idea&#10;Giải thích thuật toán tại đây..."
            value={solutionMarkdown}
            onChange={(e) => setSolutionMarkdown(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            className="w-full text-sm leading-6 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-3 text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 [contain:content]"
          />
        </label>

        <footer className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Lưu cách giải
          </Button>
        </footer>
      </form>
    </Modal>
  );
}
