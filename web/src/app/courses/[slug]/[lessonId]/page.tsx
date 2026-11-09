import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseLesson } from "@/lib/courses";
import { CourseLessonView } from "@/features/courses/CourseLessonView";

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  const paramsList: Array<{ slug: string; lessonId: string }> = [];

  for (const course of courses) {
    for (const lesson of course.lessons) {
      paramsList.push({
        slug: course.slug,
        lessonId: lesson.id
      });
    }
  }

  return paramsList;
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug, lessonId } = await params;
  const data = getCourseLesson(slug, lessonId);

  if (!data) {
    return {
      title: "Bài học không tồn tại | QuantaVault"
    };
  }

  return {
    title: (data.lesson.titleEn ? data.lesson.titleEn + " | " : "") + data.lesson.title + " | " + data.course.title + " | QuantaVault",
    description: data.lesson.summary
  };
}

export default async function CourseLessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = await params;
  const data = getCourseLesson(slug, lessonId);

  if (!data) {
    notFound();
  }

  return (
    <CourseLessonView
      course={data.course}
      lesson={data.lesson}
      chapterTitle={data.chapterTitle}
      prevLesson={data.prevLesson}
      nextLesson={data.nextLesson}
    />
  );
}

