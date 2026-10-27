import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { PracticeView } from "@/features/practice/PracticeView";
import { parseProblemId } from "@/features/practice/route";
import {
  getAdjacentProblemIds,
  getProblemContent,
  getProblemSummary,
  getTopInterview150,
  splitHints,
} from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseProblemId(rawId);
  if (id === null) return { title: "Không tìm thấy bài tập" };
  const content = getProblemContent(id);
  if (!content) return { title: "Không tìm thấy bài tập" };

  return {
    title: `Bài #${content.id}. ${content.title} | Top Interview 150`,
    description: `Giải thuật toán ${content.title} (${content.difficulty}) bằng Java. Giải thích trực quan, các cách tiếp cận và phân tích độ phức tạp thời gian/bộ nhớ.`,
  };
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id: rawId } = await params;
  const id = parseProblemId(rawId);
  if (id === null) notFound();

  const content = getProblemContent(id);
  if (!content) notFound();

  const adjacent = getAdjacentProblemIds(id);
  const previousSummary =
    adjacent.previous === null ? null : getProblemSummary(adjacent.previous);
  const nextSummary = adjacent.next === null ? null : getProblemSummary(adjacent.next);
  const plan = getTopInterview150();
  const section = plan.sections.find((entry) => entry.problemIds.includes(id));

  return (
    <PracticeView
      key={content.id}
      content={content}
      hints={splitHints(content.hintsMarkdown)}
      previous={
        previousSummary
          ? { id: previousSummary.id, title: previousSummary.title }
          : null
      }
      next={nextSummary ? { id: nextSummary.id, title: nextSummary.title } : null}
      sectionName={section?.name ?? content.primarySection}
    />
  );
}
