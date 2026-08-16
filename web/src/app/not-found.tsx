import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you requested does not exist in this practice workspace."
    />
  );
}
