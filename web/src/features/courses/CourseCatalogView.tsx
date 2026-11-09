"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Server,
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
  Container,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CourseIcon } from "@/components/ui/CourseIcon";
import type { CourseManifest } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";

interface CourseCatalogViewProps {
  courses: CourseManifest[];
}

export function CourseCatalogView({ courses }: CourseCatalogViewProps) {
  const { hydrated, getCourseCompletion, getCourseRecord } = useCourseProgress();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "studying" | "completed" | "not-started">("all");

  const matchingCourses = courses.filter((course) => {
    const query = searchQuery.trim().toLocaleLowerCase("vi");
    const found = !query || [course.title, course.tagline, course.level, ...course.chapters.flatMap((ch) => [ch.title, ch.titleEn || ""]), ...course.lessons.map((lesson) => lesson.titleEn || "")]
      .some((part) => part.toLocaleLowerCase("vi").includes(query));
    if (!found) return false;
    if (statusFilter === "all" || !hydrated) return true;
    const record = getCourseRecord(course.id);
    const { completedCount, totalLessons } = getCourseCompletion(course.id, course.totalLessons);
    const completed = totalLessons > 0 && completedCount >= totalLessons;
    const studying = !completed && (completedCount > 0 || Boolean(record.lastAccessedLessonId));
    if (statusFilter === "completed") return completed;
    if (statusFilter === "studying") return studying;
    return !completed && !studying;
  });

  // Aggregate stats across all courses
  const totalAllLessons = courses.reduce((acc, c) => acc + c.totalLessons, 0);
  const totalCompletedLessons = courses.reduce((acc, c) => {
    if (!hydrated) return acc;
    const { completedCount } = getCourseCompletion(c.id, c.totalLessons);
    return acc + completedCount;
  }, 0);
  const overallPercentage =
    totalAllLessons > 0 ? Math.round((totalCompletedLessons / totalAllLessons) * 100) : 0;

  // Resume the most recently visited course instead of always PostgreSQL.
  const recentCourse = hydrated
    ? [...courses]
        .filter((course) => {
          const id = getCourseRecord(course.id).lastAccessedLessonId;
          return Boolean(id && course.lessons.some((lesson) => lesson.id === id));
        })
        .sort((a, b) => (getCourseRecord(b.id).updatedAt || "").localeCompare(getCourseRecord(a.id).updatedAt || ""))[0]
    : undefined;
  const primaryCourse = recentCourse || courses[0];
  const primaryRecord = hydrated && primaryCourse ? getCourseRecord(primaryCourse.id) : null;
  const primaryTargetLessonId =
    (primaryRecord?.lastAccessedLessonId && primaryCourse?.lessons.some((lesson) => lesson.id === primaryRecord.lastAccessedLessonId)
      ? primaryRecord.lastAccessedLessonId : primaryCourse?.lessons[0]?.id) || "lesson-01";

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

            {/* Search and status filters support large catalogs without changing saved progress. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block min-w-0 flex-1">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="search"
                  aria-label="Tìm kiếm khóa học"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Tìm theo tên, chủ đề khóa học..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-3 text-sm text-[var(--foreground)] outline-none focus:border-indigo-500"
                />
              </label>
              <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-[var(--muted-strong)]">
                <span>Trạng thái</span>
                <select
                  aria-label="Lọc trạng thái khóa học"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-indigo-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="studying">Đang học</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="not-started">Chưa bắt đầu</option>
                </select>
              </label>
              <span role="status" className="shrink-0 text-xs text-[var(--muted)]">{matchingCourses.length}/{courses.length} khóa</span>
            </div>

            {matchingCourses.length === 0 && (
              <div role="status" className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
                <p className="font-semibold text-[var(--foreground)]">Không tìm thấy khóa học phù hợp</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Thử từ khóa hoặc trạng thái khác.</p>
                <button type="button" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                  className="mt-3 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold hover:bg-[var(--surface-hover)]">
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Courses Showcase */}
            {courses.length === 1 && matchingCourses.length === 1 && primaryCourse ? (
              // Featured Hero Course Card for single primary course
              (() => {
                const { completedCount, totalLessons, percentage } = hydrated
                  ? getCourseCompletion(primaryCourse.id, primaryCourse.totalLessons)
                  : { completedCount: 0, totalLessons: primaryCourse.totalLessons, percentage: 0 };

                const totalDurationHours = (
                  primaryCourse.lessons.reduce((acc, l) => acc + (l.durationMinutes || 0), 0) /
                  60
                ).toFixed(0);
                const mermaidCount = primaryCourse.lessons.reduce((sum, lesson) => sum + (lesson.contentMarkdown.match(/```mermaid\b/g) || []).length, 0);
                const codeCount = primaryCourse.lessons.reduce((sum, lesson) => sum + (lesson.contentMarkdown.match(/```(?:sql|java|bash|shell|json|yaml|xml)\b/g) || []).length, 0);

                return (
                  <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-xs hover:border-indigo-500/40 transition-all">
                    {/* Top Badges & Title */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-xs ring-1 ring-indigo-500/20">
                          <CourseIcon name={primaryCourse.icon} className="h-7 w-7" />
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
                              <span>Nội dung thực hành</span>
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
                        <span>{percentage > 0 || Boolean(primaryRecord?.lastAccessedLessonId) ? "Vào Học Tiếp" : "Bắt Đầu Học Ngay"}</span>
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
                          {mermaidCount} sơ đồ
                        </span>
                        <span className="text-xs text-[var(--muted)] font-medium">Mermaid & {codeCount} khối mã</span>
                      </div>
                    </div>

                    {/* Chapter Breakdown Pills */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        Tổng quan {primaryCourse.chapters.length} chương trong khóa học:
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
                              {chapter.titleEn && <span className="block truncate text-[11px] text-[var(--muted)]">{chapter.titleEn}</span>}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {matchingCourses.map((course) => {
                  const { completedCount, totalLessons, percentage } = hydrated
                    ? getCourseCompletion(course.id, course.totalLessons)
                    : { completedCount: 0, totalLessons: course.totalLessons, percentage: 0 };

                  const record = hydrated ? getCourseRecord(course.id) : null;
                  const targetLessonId =
                    (record?.lastAccessedLessonId && course.lessons.some((lesson) => lesson.id === record.lastAccessedLessonId)
                      ? record.lastAccessedLessonId : course.lessons[0]?.id) || "lesson-01";

                  return (
                    <div
                      key={course.id}
                      className="group relative flex min-w-0 flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 transition-all duration-200 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                            <CourseIcon name={course.icon} className="h-6 w-6" />
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
                          <span>{percentage > 0 || Boolean(record?.lastAccessedLessonId) ? "Vào Học Tiếp" : "Bắt Đầu Học Ngay"}</span>
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
                  {primaryRecord?.lastAccessedLessonId ? "Tiếp tục bài đang học:" : "Bắt đầu bài đầu tiên:"}
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

          {/* Published courses: show actual per-course progress instead of a hardcoded checkmark. */}
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Compass className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Khóa học hiện có ({courses.length})
              </h3>
            </div>
            <div className="max-h-[340px] space-y-2 overflow-y-auto">
              {courses.map((course) => {
                const record = hydrated ? getCourseRecord(course.id) : null;
                const { completedCount, totalLessons, percentage } = hydrated
                  ? getCourseCompletion(course.id, course.totalLessons)
                  : { completedCount: 0, totalLessons: course.totalLessons, percentage: 0 };
                const completed = totalLessons > 0 && completedCount >= totalLessons;
                const started = completedCount > 0 || Boolean(record?.lastAccessedLessonId);
                const target = record?.lastAccessedLessonId
                  && course.lessons.some((lesson) => lesson.id === record.lastAccessedLessonId)
                  ? record.lastAccessedLessonId : course.lessons[0]?.id || "lesson-01";
                return (
                  <Link key={course.id} href={`/courses/${course.slug}/${target}`}
                    className="block space-y-2 rounded-2xl border border-[var(--border)] p-3 hover:border-indigo-500/40 hover:bg-[var(--surface-hover)]/50">
                    <div className="flex items-start justify-between gap-2">
                      <span className="min-w-0 text-xs font-semibold leading-relaxed text-[var(--foreground)]">{course.title}</span>
                      <span className="shrink-0 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {completed ? "Hoàn thành" : started ? "Đang học" : "Chưa học"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
                      <span>{completedCount}/{totalLessons} bài</span>
                      <span>{percentage}%</span>
                    </div>
                    <ProgressBar value={percentage} max={100} />
                  </Link>
                );
              })}
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
