import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { CodeVersionItem } from "@/lib/content";


interface CodeVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: number;
  editingVersion?: CodeVersionItem | null;
  onSuccess: () => void;
}

export function CodeVersionModal({
  isOpen,
  onClose,
  problemId,
  editingVersion,
  onSuccess,
}: CodeVersionModalProps) {
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (editingVersion) {
        setName(editingVersion.name || "");
        setSource(editingVersion.source || "");
        setIsDefault(Boolean(editingVersion.isDefault));
      } else {
        setName("");
        setSource("");
        setIsDefault(false);
      }
      setError(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [editingVersion, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const finalSource = source.trim() !== "" 
      ? source.trim() 
      : `class Solution {\n    // Implementation\n}`;

    try {
      const res = await fetch("/api/code-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-workspace-request": "1" },
        body: JSON.stringify({
          problemId,
          id: editingVersion?.id,
          name: name.trim() || undefined,
          source: finalSource,
          isDefault,
        }),
      });


      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu phiên bản code.");
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
      title={editingVersion ? "Chỉnh sửa phiên bản code" : "Thêm phiên bản code mới"}
      description={
        editingVersion
          ? `Cập nhật nội dung code của ${editingVersion.name}`
          : `Thêm một cách viết code mới cho bài #${problemId}`
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 pt-1">
        {error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-500">
            {error}
          </div>
        ) : null}

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Tên phiên bản (Tùy chọn)
          </span>
          <input
            type="text"
            placeholder="Ví dụ: Dùng Stream API / Khử đệ quy / Tối ưu bộ nhớ..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 transition-all"
          />
        </label>

        <label className="flex items-center gap-2.5 pt-1 text-sm font-medium text-[var(--foreground)] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border-strong)] text-[var(--primary)] focus:ring-indigo-500 cursor-pointer"
          />
          <span>Đặt phiên bản code này làm mặc định</span>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Code Java (Tùy chọn)
          </span>
          <textarea
            rows={12}
            placeholder={`class Solution {\n    // Paste code Java tại đây\n}`}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            className="w-full font-mono text-xs leading-5 rounded-xl border border-[var(--border-strong)] bg-[var(--code-surface)] p-3.5 text-[var(--code-foreground)] outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-indigo-500/15 [contain:content] [font-variant-ligatures:none]"
          />
        </label>

        <footer className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            {editingVersion ? "Lưu thay đổi" : "Lưu phiên bản code"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}

