import { redirect, notFound } from "next/navigation";
import { getAllCourses, getCourseBySlug } from "@/lib/courses";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  return courses.map((course) => ({
    slug: course.slug
  }));
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const firstLessonId = course.lessons[0]?.id || "lesson-01";
  redirect(`/courses/${course.slug}/${firstLessonId}`);
}

