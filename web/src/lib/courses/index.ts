import postgresCourseData from "@/data/courses/postgres-for-java/course.json";
import redisCourseData from "@/data/courses/redis-for-java/course.json";
import englishCourseData from "@/data/courses/english-job-interview/course.json";
import springCourseData from "@/data/courses/spring-framework-for-java/course.json";
import type { CourseLesson, CourseManifest } from "./types";
import { personalizedEnglishLessons } from "./englishPersonalized";
import type { PersonalizedInterviewLesson } from "./englishPersonalized";

export * from "./types";

// Published personal interview content is layered over the immutable source-backed corpus.
const personalizedByLessonId = new Map(
  personalizedEnglishLessons.map((lesson) => [lesson.lessonId, lesson])
);

function personalizedMarkdown(lesson: PersonalizedInterviewLesson): string {
  const number = lesson.lessonId.split("-")[1];
  const questions = lesson.questions.map((question, index) => {
    const alternative = question.questionEnAlternative && question.questionViAlternative
      ? "\n\n**Cách hỏi tương đương / Alternative question:** " +
        question.questionEnAlternative + " / " + question.questionViAlternative
      : "";
    const answer = question.answers[0];
    const en = answer.en.split(/\n\s*\n/);
    const vi = answer.vi.split(/\n\s*\n/);
    const paragraphs = en.map((paragraph, paragraphIndex) =>
      paragraph + "\n\n" + vi[paragraphIndex]
    ).join("\n\n");
    return "## " + (index + 1) + ". " + question.questionEn + " / " +
      question.questionVi + alternative + "\n\n" + paragraphs;
  }).join("\n\n---\n\n");
  return "# Lesson " + number + ": " + lesson.titleEn + " / " + lesson.title +
    "\n\n" + questions + "\n";
}

const englishCourse = englishCourseData as unknown as CourseManifest;
const personalizedEnglishCourse: CourseManifest = {
  ...englishCourse,
  // 24 reviewed personal questions replace 45 original questions; 110 later questions stay intact.
  badge: "134 câu hỏi phỏng vấn",
  chapters: englishCourse.chapters.map((chapter) => {
    const customized = chapter.lessonIds
      .map((id) => personalizedByLessonId.get(id))
      .filter((lesson): lesson is PersonalizedInterviewLesson => Boolean(lesson));
    if (customized.length !== chapter.lessonIds.length) return chapter;
    const count = customized.reduce((sum, lesson) => sum + lesson.questions.length, 0);
    return { ...chapter, description: count + " câu hỏi phỏng vấn Anh–Việt theo chủ đề." };
  }),
  lessons: englishCourse.lessons.map((lesson) => {
    const personalized = personalizedByLessonId.get(lesson.id);
    if (!personalized) return lesson;
    return {
      ...lesson,
      title: personalized.title,
      titleEn: personalized.titleEn,
      summary: "Luyện " + personalized.questions.length +
        " câu hỏi phỏng vấn với các câu trả lời song ngữ đã biên tập.",
      contentMarkdown: personalizedMarkdown(personalized)
    };
  })
};

const ALL_COURSES: CourseManifest[] = [
  postgresCourseData as unknown as CourseManifest,
  redisCourseData as unknown as CourseManifest,
  personalizedEnglishCourse,
  springCourseData as unknown as CourseManifest
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

