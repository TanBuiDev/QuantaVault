export interface CourseFlashcard {
  id: string;
  questionEn: string;
  questionVi: string;
  answerEn: string;
  answerVi: string;
  explanationEn?: string;
  explanationVi?: string;
}

export interface CourseTranscriptSentence {
  id: string;
  en: string;
  vi: string;
  time?: string;
  start?: number;
  end?: number;
}

export interface CourseLesson {
  id: string;
  slug: string;
  number: number;
  chapterId: string;
  title: string;
  /** Optional English title for bilingual lessons. */
  titleEn?: string;
  summary: string;
  durationMinutes: number;
  tags?: string[];
  contentMarkdown: string;
  /** Optional YouTube video ID (e.g. "X4Pho7r5sDg") */
  videoId?: string;
  /** Optional bilingual flashcards for interactive deck */
  flashcards?: CourseFlashcard[];
  /** Optional structured bilingual transcript sentences */
  transcript?: CourseTranscriptSentence[];
}

export interface CourseChapter {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  lessonIds: string[];
}

export interface CourseManifest {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  badge: string;
  level: string;
  author?: string;
  totalLessons: number;
  chapters: CourseChapter[];
  lessons: CourseLesson[];
}

/** Lightweight public navigation metadata; never includes lesson Markdown. */
export interface CourseNavigationItem {
  id: string;
  slug: string;
  title: string;
  icon: string;
  totalLessons: number;
  firstLessonId: string;
  lessonIds: string[];
}

export interface CourseProgressRecord {
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  updatedAt: string;
}

export interface AllCoursesProgressState {
  version: 1;
  courses: Record<string, CourseProgressRecord>;
}

