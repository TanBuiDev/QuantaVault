import type { Metadata } from "next";
import { getAllInterviewQuestions } from "@/lib/interview";
import { InterviewListView } from "@/features/interview/InterviewListView";

export const metadata: Metadata = {
  title: "Bộ Câu Hỏi Phỏng Vấn Java Toàn Diện",
  description:
    "Tổng hợp bộ câu hỏi ôn luyện phỏng vấn Java Core, Đa luồng (Concurrency), JVM, Collections, Spring Boot và Database cho lập trình viên từ Junior đến Senior.",
};

export default function InterviewPage() {
  const questions = getAllInterviewQuestions();

  return <InterviewListView initialQuestions={questions} />;
}
