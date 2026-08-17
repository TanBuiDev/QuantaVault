import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";

export default function ProblemNotFound() {
  return (
    <EmptyState
      title="Problem not found"
      description="This ID is not part of the canonical Top Interview 150 study plan."
      action={
        <Link
          href="/problems"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
        >
          Back to problems
        </Link>
      }
    />
  );
}
