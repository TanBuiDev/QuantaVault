import lesson01 from "@/data/courses/english-job-interview/personalized/lesson-01.json";
import lesson02 from "@/data/courses/english-job-interview/personalized/lesson-02.json";
import lesson03 from "@/data/courses/english-job-interview/personalized/lesson-03.json";
import lesson04 from "@/data/courses/english-job-interview/personalized/lesson-04.json";
import lesson05 from "@/data/courses/english-job-interview/personalized/lesson-05.json";
import lesson06 from "@/data/courses/english-job-interview/personalized/lesson-06.json";

/**
 * Approved, personalized interview answers for lessons 01–06.
 * The source-backed PDF corpus, generated manifest and remaining lessons stay unchanged.
 */
export interface PersonalizedInterviewAnswer {
  id: string;
  en: string;
  vi: string;
}

export interface PersonalizedInterviewQuestion {
  id: string;
  lessonId: string;
  questionEn: string;
  questionVi: string;
  questionEnAlternative?: string;
  questionViAlternative?: string;
  answers: PersonalizedInterviewAnswer[];
}

export interface PersonalizedInterviewLesson {
  lessonId: string;
  title: string;
  titleEn: string;
  questions: PersonalizedInterviewQuestion[];
}

export const personalizedEnglishLessons: PersonalizedInterviewLesson[] = [
  lesson01, lesson02, lesson03, lesson04, lesson05, lesson06
];

export const personalizedEnglishLessonIds = new Set(
  personalizedEnglishLessons.map((lesson) => lesson.lessonId)
);
