import type { Metadata } from "next";
import { getAllCourses } from "@/lib/courses";
import { CourseCatalogView } from "@/features/courses/CourseCatalogView";

export const metadata: Metadata = {
  title: "Khóa Học & Lộ Trình Kỹ Sư Toàn Diện | QuantaVault",
  description:
    "Các lộ trình học tập chuyên sâu theo bài học: Database & PostgreSQL cho Java Backend, Spring Boot, Microservices và Hệ thống phân tán."
};

export default function CoursesPage() {
  const courses = getAllCourses();
  return <CourseCatalogView courses={courses} />;
}
