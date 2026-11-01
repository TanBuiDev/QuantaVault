import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { getOrderedProblemIds, getTopInterview150 } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dashboard Tổng Quan | QuantaVault",
  description:
    "Trung tâm tri thức QuantaVault: theo dõi tiến độ luyện tập thuật toán LeetCode và ôn câu hỏi phỏng vấn kiến trúc phần mềm, Java Core, Concurrency, Spring Boot.",
};

export default function HomePage() {
  return (
    <DashboardView
      plan={getTopInterview150()}
      orderedProblemIds={getOrderedProblemIds()}
    />
  );
}
