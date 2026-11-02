export interface CourseLesson {
  id: string;
  slug: string;
  number: number;
  chapterId: string;
  title: string;
  summary: string;
  durationMinutes: number;
  tags?: string[];
  contentMarkdown: string;
}

export interface CourseChapter {
  id: string;
  title: string;
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

export interface CourseProgressRecord {
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  updatedAt: string;
}

export interface AllCoursesProgressState {
  version: 1;
  courses: Record<string, CourseProgressRecord>;
}

