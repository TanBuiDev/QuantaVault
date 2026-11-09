import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";
import { EnglishPracticeView } from "@/features/courses/EnglishPracticeView";

export const metadata: Metadata = {
  title: "Luyện tập dịch song ngữ | Tiếng Anh Phỏng Vấn | QuantaVault",
  description: "Luyện dịch câu hỏi và mẫu trả lời phỏng vấn Anh–Việt hai chiều, tự kiểm tra và đánh dấu cần ôn."
};

export default function EnglishInterviewPracticePage() {
  const course = getCourseBySlug("english-job-interview");
  if (!course) notFound();

  const lessons = course.lessons.map((lesson) => ({
    id: lesson.id,
    number: lesson.number,
    title: lesson.title,
    titleEn: lesson.titleEn || lesson.title
  }));

  return <EnglishPracticeView lessons={lessons} />;
}
