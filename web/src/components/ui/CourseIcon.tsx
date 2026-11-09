import { BookOpen, Database, Languages, Server, type LucideIcon } from "lucide-react";

const COURSE_ICONS: Record<string, LucideIcon> = {
  Database,
  Server,
  Languages,
  BookOpen
};

/** Shared course icon mapping. Keep metadata-to-icon decisions in one place. */
export function CourseIcon({ name, className }: { name: string; className?: string }) {
  const Icon = COURSE_ICONS[name] ?? BookOpen;
  return <Icon className={className} aria-hidden="true" />;
}
