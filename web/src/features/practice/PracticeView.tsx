"use client";
import { AddApproachModal } from "./AddApproachModal";
import { CodeVersionModal } from "./CodeVersionModal";
import { PracticeLayout } from "./PracticeLayout";
import { PracticeStudyContent } from "./PracticeStudyContent";
import { PracticeToolbar } from "./PracticeToolbar";
import type { PracticeViewProps } from "./practiceTypes";
import { usePracticeWorkspace } from "./usePracticeWorkspace";
export type { AdjacentProblemLink, PracticeViewProps } from "./practiceTypes";
export function PracticeView(props: PracticeViewProps) {
  const model = usePracticeWorkspace(props);
  const { content, router, isCodeModalOpen, setIsCodeModalOpen, editingVersion, setEditingVersion, isAddModalOpen, setIsAddModalOpen } = model;
  return <div className="space-y-5">
    <PracticeToolbar {...model} />
    <PracticeLayout {...model} studyContent={<PracticeStudyContent {...model} />} />
    <AddApproachModal
      isOpen={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
      problemId={content.id}
      onSuccess={() => router.refresh()}
    />

    <CodeVersionModal
      isOpen={isCodeModalOpen}
      onClose={() => {
        setIsCodeModalOpen(false);
        setEditingVersion(null);
      }}
      problemId={content.id}
      editingVersion={editingVersion}
      onSuccess={() => router.refresh()}
    />
  </div>;
}
