"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import type { ProblemContent, CodeVersionItem } from "@/lib/content";
export function usePracticeVersions(content: ProblemContent, handleCodeChange: (code: string) => void) {
  const router = useRouter();
  const { success, error: toastError, warning } = useToast();
  // Code Versions (Reference Solution)
  const codeVersions = content.codeVersions ?? (content.javaSource ? [{ id: "v1", name: "Version 1", source: content.javaSource, isCanonical: true, isDefault: true }] : []);
  const defaultVersionIdx = codeVersions.findIndex((v) => v.isDefault);
  const [selectedVersionId, setSelectedVersionId] = useState<string | undefined>(codeVersions[defaultVersionIdx >= 0 ? defaultVersionIdx : 0]?.id);
  const matchedVersionIdx = codeVersions.findIndex(v => v.id === selectedVersionId);
  const selectedVersionIdx = matchedVersionIdx >= 0 ? matchedVersionIdx : Math.max(defaultVersionIdx, 0);
  const setSelectedVersionIdx = (value: number | ((previous: number) => number)) => {
    const index = typeof value === "function" ? value(selectedVersionIdx) : value;
    setSelectedVersionId(codeVersions[index]?.id);
  };
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [editingVersion, setEditingVersion] = useState<CodeVersionItem | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const currentCodeItem = codeVersions[selectedVersionIdx] ?? codeVersions[0];
  const currentJavaSource = currentCodeItem ? currentCodeItem.source : content.javaSource;

  const confirm = useConfirm();

  async function handleLoadSolutionToEditor() {
    if (currentJavaSource) {
      const ok = await confirm({
        title: "Đưa lời giải vào Editor?",
        message: "Mã nguồn hiện tại trong Code Editor của bạn sẽ được thay thế bằng mã nguồn lời giải tham khảo này.",
        confirmText: "Đồng ý thay thế",
        cancelText: "Hủy",
        variant: "warning",
      });
      if (ok) {
        handleCodeChange(currentJavaSource);
        success("Đã đưa lời giải tham khảo vào Code Editor!");
      }
    }
  }

  async function copyJavaSource() {
    const sourceToCopy = currentJavaSource;
    if (!sourceToCopy) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(sourceToCopy);
      setCopyState("copied");
      success("Đã sao chép toàn bộ code Java vào clipboard!", "Sao chép thành công");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      toastError("Không thể truy cập clipboard của trình duyệt.", "Lỗi sao chép");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  async function handleDeleteCodeVersion(version: CodeVersionItem) {
    if (version.isCanonical || codeVersions.length <= 1) {
      warning("Không thể xóa phiên bản code duy nhất còn lại.", "Thao tác không hợp lệ");
      return;
    }
    const ok = await confirm({
      title: "Xóa phiên bản code?",
      message: `Bạn có chắc chắn muốn xóa vĩnh viễn phiên bản "${version.name || version.id}" không?`,
      confirmText: "Xóa phiên bản",
      cancelText: "Hủy",
      variant: "danger",
    });
    if (!ok) {
      return;
    }
    try {
      const res = await fetch("/api/code-versions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-workspace-request": "1" },
        body: JSON.stringify({ problemId: content.id, id: version.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        toastError(data.error || "Xóa phiên bản code thất bại.", "Lỗi");
        return;
      }
      success(`Đã xóa "${version.name || version.id}" thành công!`);
      router.refresh();
    } catch {
      toastError("Đã có lỗi xảy ra trong quá trình xóa.", "Lỗi mạng");
    }
  }

  return {
    codeVersions,
    selectedVersionIdx,
    setSelectedVersionIdx,
    isCodeModalOpen,
    setIsCodeModalOpen,
    editingVersion,
    setEditingVersion,
    copyState,
    currentCodeItem,
    currentJavaSource,
    handleLoadSolutionToEditor,
    copyJavaSource,
    handleDeleteCodeVersion
  };
}
