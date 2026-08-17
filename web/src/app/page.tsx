import { DashboardView } from "@/features/dashboard/DashboardView";
import { getOrderedProblemIds, getTopInterview150 } from "@/lib/content";

export default function HomePage() {
  return (
    <DashboardView
      plan={getTopInterview150()}
      orderedProblemIds={getOrderedProblemIds()}
    />
  );
}
