import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { getOrderedProblemIds, getTopInterview150 } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dashboard Tổng Quan | Top Interview 150",
  description:
    "Trung tâm theo dõi tiến độ luyện tập 150 thuật toán LeetCode trọng tâm và ngân hàng 538 câu hỏi phỏng vấn Java Core, Concurrency, Spring Boot.",
};

export default function HomePage() {
  return (
    <DashboardView
      plan={getTopInterview150()}
      orderedProblemIds={getOrderedProblemIds()}
    />
  );
}
