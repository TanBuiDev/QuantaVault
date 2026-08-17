import { ProblemExplorer } from "@/features/problem-list/ProblemExplorer";
import { getAllProblemSummaries, getTopInterview150 } from "@/lib/content";

export default function ProblemsPage() {
  return (
    <ProblemExplorer
      summaries={getAllProblemSummaries()}
      sections={getTopInterview150().sections}
    />
  );
}
