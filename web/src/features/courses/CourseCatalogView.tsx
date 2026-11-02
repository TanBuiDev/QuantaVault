"use client";

import Link from "next/link";
import { Database, BookOpen, Clock, ChevronRight, Sparkles, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";

interface CourseCatalogViewProps {
  courses: CourseManifest[];
}

export function CourseCatalogView({ courses }: CourseCatalogViewProps) {
  const { hydrated, getCourseCompletion, getCourseRecord } = useCourseProgress();

  return (
    <div className="space-y-8 lg:space-y-10 animate-fade-in max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {/* Header Banner */}
      <header className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-indigo-500/[0.07] via-transparent to-emerald-500/[0.05] p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" dot>
              Academy & Roadmaps
            </Badge>
            <span className="text-xs sm:text-sm font-medium text-[var(--muted)]">
              Lộ trình chuyên sâu theo bài học
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-[-0.035em] text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Khóa Học & Lộ Trình Kỹ Sư
          </h1>
          <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Xây dựng kiến thức nền tảng vững vàng và tư duy kiến trúc hệ thống thực chiến. Mỗi khóa học được thiết kế bài bản theo từng chặng, kết hợp sơ đồ trực quan, truy vấn mẫu và tối ưu hóa hiệu năng cao.
          </p>
        </div>
      </header>

      {/* Courses Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <span>Lộ Trình Hiện Có ({courses.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const { completedCount, totalLessons, percentage } = hydrated
              ? getCourseCompletion(course.id, course.totalLessons)
              : { completedCount: 0, totalLessons: course.totalLessons, percentage: 0 };

            const record = hydrated ? getCourseRecord(course.id) : null;
            const targetLessonId =
              record?.lastAccessedLessonId || course.lessons[0]?.id || "lesson-01";

            return (
              <div
                key={course.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-200 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="space-y-4">
                  {/* Top tags & icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                      {course.icon === "Database" ? (
                        <Database className="h-6 w-6" />
                      ) : (
                        <BookOpen className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {course.badge}
                      </span>
                      <span className="rounded-md bg-[var(--surface-hover)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-strong)] border border-[var(--border)]">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Chapters count & info */}
                  <div className="flex items-center gap-4 text-xs text-[var(--muted)] pt-1">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{course.chapters.length} Phần</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>{course.totalLessons} Bài học</span>
                    </span>
                  </div>
                </div>

                {/* Progress & Action button */}
                <div className="mt-6 pt-5 border-t border-[var(--border)] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[var(--muted-strong)]">Tiến độ hoàn thành</span>
                      <span className="font-bold text-[var(--foreground)]">
                        {completedCount}/{totalLessons} ({percentage}%)
                      </span>
                    </div>
                    <ProgressBar value={percentage} max={100} />
                  </div>

                  <Link
                    href={`/courses/${course.slug}/${targetLessonId}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-110 active:scale-[0.99] transition-all"
                  >
                    <span>{percentage > 0 ? "Vào Học Tiếp" : "Bắt Đầu Học Ngay"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="rounded-3xl border border-dashed border-[var(--border-strong)] p-6 sm:p-8 text-center space-y-2">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
          <Sparkles className="h-5 w-5" />
        </div>
        <h3 className="text-base font-bold text-[var(--foreground)]">Sắp Ra Mắt Các Lộ Trình Mới</h3>
        <p className="text-xs sm:text-sm text-[var(--muted)] max-w-lg mx-auto">
          Spring Boot & Cloud Native Microservices, Kafka Event-Driven Architecture và Docker & Kubernetes for Java Engineers.
        </p>
      </section>
    </div>
  );
}
