import postgresCourseData from "@/data/courses/postgres-for-java/course.json";
import type { CourseLesson, CourseManifest } from "./types";

export * from "./types";

const ALL_COURSES: CourseManifest[] = [
  postgresCourseData as unknown as CourseManifest
];

export function getAllCourses(): CourseManifest[] {
  return ALL_COURSES;
}

export function getCourseBySlug(slug: string): CourseManifest | undefined {
  return ALL_COURSES.find((c) => c.slug === slug || c.id === slug);
}

export function getCourseLesson(
  courseSlug: string,
  lessonIdOrSlug: string
): {
  course: CourseManifest;
  lesson: CourseLesson;
  chapterTitle: string;
  prevLesson?: CourseLesson;
  nextLesson?: CourseLesson;
} | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;

  const lessonIndex = course.lessons.findIndex(
    (l) => l.id === lessonIdOrSlug || l.slug === lessonIdOrSlug
  );
  if (lessonIndex === -1) return undefined;

  const lesson = course.lessons[lessonIndex];
  const chapter = course.chapters.find((ch) => ch.id === lesson.chapterId);

  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : undefined;
  const nextLesson =
    lessonIndex < course.lessons.length - 1
      ? course.lessons[lessonIndex + 1]
      : undefined;

  return {
    course,
    lesson,
    chapterTitle: chapter?.title || "Chương",
    prevLesson,
    nextLesson
  };
}
