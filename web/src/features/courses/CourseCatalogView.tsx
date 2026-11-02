"use client";

import Link from "next/link";
import {
  Database,
  BookOpen,
  Clock,
  ChevronRight,
  Sparkles,
  Layers,
  Trophy,
  Flame,
  ArrowRight,
  ShieldCheck,
  Compass,
  Cpu,
  Server,
  Container
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";

interface CourseCatalogViewProps {
  courses: CourseManifest[];
}

export function CourseCatalogView({ courses }: CourseCatalogViewProps) {
  const { hydrated, getCourseCompletion, getCourseRecord } = useCourseProgress();

  // Aggregate stats across all courses
  const totalAllLessons = courses.reduce((acc, c) => acc + c.totalLessons, 0);
  const totalCompletedLessons = courses.reduce((acc, c) => {
    if (!hydrated) return acc;
    const { completedCount } = getCourseCompletion(c.id, c.totalLessons);
    return acc + completedCount;
  }, 0);
  const overallPercentage =
    totalAllLessons > 0 ? Math.round((totalCompletedLessons / totalAllLessons) * 100) : 0;

  // Find the primary active course (PostgreSQL)
  const primaryCourse = courses[0];
  const primaryRecord = hydrated && primaryCourse ? getCourseRecord(primaryCourse.id) : null;
  const primaryTargetLessonId =
    primaryRecord?.lastAccessedLessonId || primaryCourse?.lessons[0]?.id || "lesson-01";

  const primaryTargetLesson = primaryCourse?.lessons.find(
    (l) => l.id === primaryTargetLessonId
  );

  return (
    <div className="mx-auto w-full max-w-5xl xl:max-w-6xl 2xl:max-w-[1720px] space-y-8 lg:space-y-10 animate-fade-in">
      {/* 1. Header Banner */}
      <header className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-indigo-500/[0.08] via-transparent to-emerald-500/[0.05] p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" dot>
              Academy & Roadmaps
            </Badge>
            <span className="text-xs sm:text-sm font-medium text-[var(--muted)]">
              Lộ trình chuyên sâu theo bài học · Chuẩn kỹ sư Backend
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

      {/* 2. Main Two-Column Layout on 2xl+ screens */}
      <div className="2xl:grid 2xl:grid-cols-[1fr_380px] 2xl:gap-8 2xl:items-start">
        {/* Left Column: Courses List & Roadmaps (Fluid 1fr) */}
        <div className="space-y-8 min-w-0">
          <section aria-label="Danh sách lộ trình học tập" className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                <span>Lộ Trình Hiện Có ({courses.length})</span>
              </h2>
            </div>

            {/* Courses Showcase */}
            {courses.length === 1 && primaryCourse ? (
              // Featured Hero Course Card for single primary course
              (() => {
                const { completedCount, totalLessons, percentage } = hydrated
                  ? getCourseCompletion(primaryCourse.id, primaryCourse.totalLessons)
                  : { completedCount: 0, totalLessons: primaryCourse.totalLessons, percentage: 0 };

                const totalDurationHours = (
                  primaryCourse.lessons.reduce((acc, l) => acc + (l.durationMinutes || 0), 0) /
                  60
                ).toFixed(0);

                return (
                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-xs hover:border-indigo-500/40 transition-all">
                    {/* Top Badges & Title */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-indigo-500/20">
                          <Database className="h-7 w-7" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {primaryCourse.badge}
                            </span>
                            <span className="rounded-md bg-[var(--surface-hover)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-strong)] border border-[var(--border)]">
                              {primaryCourse.level}
                            </span>
                            <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>Đã kiểm duyệt v2</span>
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
                            {primaryCourse.title}
                          </h3>
                        </div>
                      </div>

                      {/* Top Action Button */}
                      <Link
                        href={`/courses/${primaryCourse.slug}/${primaryTargetLessonId}`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition-all shrink-0 self-start"
                      >
                        <span>{percentage > 0 ? "Vào Học Tiếp" : "Bắt Đầu Học Ngay"}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <p className="text-sm text-[var(--muted)] leading-relaxed max-w-3xl">
                      {primaryCourse.tagline}
                    </p>

                    {/* 4 Key Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-3.5 text-center">
                        <span className="block text-xl font-black text-[var(--foreground)]">
                          {primaryCourse.chapters.length}
                        </span>
                        <span className="text-xs text-[var(--muted)] font-medium">Chương kiến thức</span>
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-3.5 text-center">
                        <span className="block text-xl font-black text-indigo-600 dark:text-indigo-400">
                          {primaryCourse.totalLessons}
                        </span>
                        <span className="text-xs text-[var(--muted)] font-medium">Bài học thực chiến</span>
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-3.5 text-center">
                        <span className="block text-xl font-black text-amber-600 dark:text-amber-400">
                          ~{totalDurationHours} giờ
                        </span>
                        <span className="text-xs text-[var(--muted)] font-medium">Học & thực hành</span>
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)]/40 p-3.5 text-center">
                        <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">
                          17 sơ đồ
                        </span>
                        <span className="text-xs text-[var(--muted)] font-medium">Mermaid & 56 SQL Lab</span>
                      </div>
                    </div>

                    {/* Chapter Breakdown Pills */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        Tổng quan 4 chương trong khóa học:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {primaryCourse.chapters.map((chapter, idx) => (
                          <div
                            key={chapter.id}
                            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 hover:border-indigo-500/30 transition-colors"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 font-black text-xs text-indigo-600 dark:text-indigo-400">
                              0{idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-[var(--foreground)] truncate">
                                {chapter.title}
                              </span>
                              <span className="text-[11px] text-[var(--muted)]">
                                {chapter.lessonIds.length} bài học chuyên đề
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar Footer */}
                    <div className="pt-4 border-t border-[var(--border)] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--muted-strong)]">
                          Tiến độ của bạn
                        </span>
                        <span className="font-bold text-[var(--foreground)]">
                          {completedCount}/{totalLessons} bài ({percentage}%)
                        </span>
                      </div>
                      <ProgressBar value={percentage} max={100} />
                    </div>
                  </div>
                );
              })()
            ) : (
              // Multi-courses grid if multiple courses exist
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

                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
                            {course.tagline}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted)] pt-1">
                          <span className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-indigo-500" />
                            <span>{course.chapters.length} Chương</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{course.totalLessons} Bài học</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            <span>
                              ~{(course.lessons.reduce((acc, l) => acc + (l.durationMinutes || 0), 0) / 60).toFixed(0)} giờ học & thực hành
                            </span>
                          </span>
                        </div>
                      </div>

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
            )}
          </section>

          {/* 3. Upcoming Roadmaps Section */}
          <section aria-label="Lộ trình sắp ra mắt" className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Lộ Trình Đang Phát Triển Tiếp Theo
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2.5 hover:border-amber-500/30 transition-all">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Cpu className="h-5 w-5" />
                </span>
                <h4 className="text-sm font-bold text-[var(--foreground)]">
                  Spring Boot & Microservices
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Kiến trúc phân tầng, Clean Architecture, Security, OpenTelemetry và Resilient API Gateway.
                </p>
                <span className="inline-block text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  Chặng 02
                </span>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2.5 hover:border-indigo-500/30 transition-all">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Server className="h-5 w-5" />
                </span>
                <h4 className="text-sm font-bold text-[var(--foreground)]">
                  Kafka & Event-Driven Architecture
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Message Broker, Partitioning, Transactional Outbox Pattern, Exactly-Once Processing.
                </p>
                <span className="inline-block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                  Chặng 03
                </span>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-2.5 hover:border-emerald-500/30 transition-all">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Container className="h-5 w-5" />
                </span>
                <h4 className="text-sm font-bold text-[var(--foreground)]">
                  Docker, K8s & Cloud Native
                </h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Container hóa Spring Boot, Multi-stage builds, Kubernetes Pods, Ingress & CI/CD Pipelines.
                </p>
                <span className="inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Chặng 04
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sticky Column: Right Rail on 2xl+ screens */}
        <aside className="hidden 2xl:block sticky top-6 space-y-6">
          {/* 1. Personal Learning Hub Card */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Tiến Độ Học Tập Cá Nhân
                </h3>
              </div>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                {overallPercentage}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Số bài đã hoàn thành</span>
                <span className="font-bold text-[var(--foreground)]">
                  {totalCompletedLessons} / {totalAllLessons} bài
                </span>
              </div>
              <ProgressBar value={overallPercentage} max={100} />
            </div>

            {/* Quick Resume Card */}
            {primaryCourse && primaryTargetLesson && (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-3.5 space-y-2">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                  {totalCompletedLessons > 0 ? "Tiếp tục bài đang học:" : "Bắt đầu bài đầu tiên:"}
                </span>
                <Link
                  href={`/courses/${primaryCourse.slug}/${primaryTargetLessonId}`}
                  className="group flex items-center justify-between gap-2 text-xs font-bold text-[var(--foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span className="truncate">
                    Bài {primaryTargetLesson.number}: {primaryTargetLesson.title.replace(/^Bài \d+:\s*/i, "")}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          {/* 2. Java Backend Milestones Map */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Compass className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Lộ Trình Kỹ Sư Java Backend
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white text-[11px] font-bold">
                  ✓
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Chặng 01: PostgreSQL & DB
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    20 bài học · B-Tree, MVCC, Lock, JPA
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-[var(--surface-hover)]/60 border border-[var(--border)] p-3 opacity-80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--border)] text-[var(--muted)] text-[11px] font-bold">
                  2
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[var(--foreground)]">
                    Chặng 02: Spring Boot 3 Core
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    IoC, AOP, Transactional, Security
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-[var(--surface-hover)]/60 border border-[var(--border)] p-3 opacity-80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--border)] text-[var(--muted)] text-[11px] font-bold">
                  3
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[var(--foreground)]">
                    Chặng 03: Kafka & Microservices
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    Event-driven, SAGA, Outbox Pattern
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-[var(--surface-hover)]/60 border border-[var(--border)] p-3 opacity-80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[var(--border)] text-[var(--muted)] text-[11px] font-bold">
                  4
                </span>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-[var(--foreground)]">
                    Chặng 04: Docker & Kubernetes
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">
                    Cloud deployment, Monitoring, CI/CD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Engineer Practical Study Tips */}
          <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-indigo-500/[0.04] to-purple-500/[0.04] p-5 space-y-2.5 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-2 text-[var(--foreground)] font-bold">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Phương Pháp Học Thực Chiến</span>
            </div>
            <p className="leading-relaxed">
              Mỗi bài học đều có lệnh Docker local và truy vấn thực nghiệm. Đừng chỉ đọc lướt — hãy gõ lệnh, chạy EXPLAIN ANALYZE và quan sát Execution Plan thực tế trên máy của bạn.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
