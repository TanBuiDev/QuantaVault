import type { Metadata } from "next";
import { ProblemExplorer } from "@/features/problem-list/ProblemExplorer";
import { getAllProblemSummaries, getTopInterview150 } from "@/lib/content";

export const metadata: Metadata = {
  title: "Danh Sách 150 Thuật Toán | Top Interview 150",
  description:
    "Luyện tập 150 thuật toán kinh điển được chọn lọc cho các kỳ phỏng vấn Big Tech (FAANG) và các tập đoàn công nghệ hàng đầu.",
};

export default function ProblemsPage() {
  return (
    <ProblemExplorer
      summaries={getAllProblemSummaries()}
      sections={getTopInterview150().sections}
    />
  );
}
