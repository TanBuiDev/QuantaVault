"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Search,
  Layers,
  GraduationCap,
  BookOpen,
  Database,
  Server,
  ChevronDown,
  ChevronRight,
  Code2
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useSidebar } from "./SidebarContext";
import { ProblemNavTree } from "./ProblemNavTree";
import type { CourseNavigationItem } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";

const MAX_VISIBLE_COURSES = 4;

export function AppSidebar({ courses = [] }: { courses?: CourseNavigationItem[] }) {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, setSidebarOpen } = useSidebar();
  const { hydrated, getCourseRecord } = useCourseProgress();
  const [coursesExpanded, setCoursesExpanded] = useState(false);

  const isProblemsRoute = pathname?.startsWith("/problems");
  const isCoursesRoute = pathname?.startsWith("/courses");
  const isInterviewRoute = pathname?.startsWith("/interview");

  // Keep the current course visible; then prefer the most recently studied courses.
  // Names, links and lesson counts all come from the course registry in root layout.
  const orderedCourses = [...courses].sort((a, b) => {
    const activeA = pathname === `/courses/${a.slug}` || pathname?.startsWith(`/courses/${a.slug}/`) ? 1 : 0;
    const activeB = pathname === `/courses/${b.slug}` || pathname?.startsWith(`/courses/${b.slug}/`) ? 1 : 0;
    if (activeA !== activeB) return activeB - activeA;
    if (!hydrated) return 0;
    return (getCourseRecord(b.id).updatedAt || "").localeCompare(getCourseRecord(a.id).updatedAt || "");
  });
  const visibleCourses = coursesExpanded ? orderedCourses : orderedCourses.slice(0, MAX_VISIBLE_COURSES);

  // Accordion state for Top 150 algorithms tree
  const [problemsTreeOpen, setProblemsTreeOpen] = useState(() => {
    // Default open on problems route or home page, closed when actively on courses or interview
    return !isCoursesRoute && !isInterviewRoute;
  });

  function openSearch() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
  }

  // Tự động đóng sidebar trên mobile khi chuyển trang
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname, setSidebarOpen]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[var(--border)] bg-[var(--sidebar)] transition-all duration-300 ease-in-out ${
        isOpen
          ? "w-72 translate-x-0"
          : "-translate-x-full lg:translate-x-0 lg:w-16"
      }`}
    >
      {/* 1. Header Bar: Brand & Burger Button */}
      <div className="flex h-16 shrink-0 items-center border-b border-[var(--border)] px-3">
        {isOpen ? (
          <div className="flex w-full items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus)] min-w-0"
            >
              <img
                src="/brand-logo.png"
                alt="Logo Java"
                className="size-9 shrink-0 rounded-xl object-cover shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <span className="block truncate text-xs font-bold text-[var(--foreground)] tracking-tight">QuantaVault</span>
                <span className="block truncate text-[10px] font-medium text-[var(--muted)]">Knowledge Engine</span>
              </div>
            </Link>

            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-xl p-1.5 text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Thu gọn thanh bên (Ctrl+B)"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-1">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Mở rộng thanh bên (Ctrl+B)"
            >
              <PanelLeftOpen className="h-5 w-5 text-indigo-500" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Middle Content Area */}
      {isOpen ? (
        /* EXPANDED SIDEBAR (w-72) */
        <>
          {/* Quick Search Button */}
          <div className="px-3 pt-3">
            <button
              type="button"
              onClick={openSearch}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-2 text-xs font-medium text-[var(--muted)] shadow-2xs hover:border-[var(--border-strong)] hover:text-[var(--foreground)] transition-all"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span>Tìm kiếm bài tập...</span>
              </span>
              <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted-strong)]">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Navigation & 3 Pillars */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {/* Top Dashboard Link */}
            <div className="px-1">
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  pathname === "/"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>Dashboard Tổng Quan</span>
              </Link>
            </div>

            {/* TRỤ CỘT 2: KHÓA HỌC & LỘ TRÌNH */}
            <div className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-emerald-500" />
                <span>Khóa Học & Lộ Trình</span>
              </div>

              <Link
                href="/courses"
                aria-current={pathname === "/courses" ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  pathname === "/courses"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                <BookOpen className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Tất cả khóa học</span>
              </Link>

              <nav aria-label="Danh sách khóa học" className="space-y-1">
                {visibleCourses.map((course) => {
                  const active = pathname === `/courses/${course.slug}`
                    || pathname?.startsWith(`/courses/${course.slug}/`);
                  const record = hydrated ? getCourseRecord(course.id) : null;
                  const nextLesson = record?.lastAccessedLessonId
                    && course.lessonIds.includes(record.lastAccessedLessonId)
                    ? record.lastAccessedLessonId : course.firstLessonId;
                  const Icon = course.icon === "Database" ? Database
                    : course.icon === "Server" ? Server : BookOpen;

                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}/${nextLesson}`}
                      title={course.title}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        active
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 shadow-2xs"
                          : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="min-w-0 flex-1 line-clamp-2 leading-relaxed">{course.title}</span>
                      <span className="ml-auto shrink-0 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        {course.totalLessons} bài
                      </span>
                    </Link>
                  );
                })}
                {courses.length > MAX_VISIBLE_COURSES && (
                  <button
                    type="button"
                    onClick={() => setCoursesExpanded((prev) => !prev)}
                    aria-expanded={coursesExpanded}
                    className="flex w-full items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  >
                    {coursesExpanded ? "Thu gọn" : `Xem thêm ${courses.length - MAX_VISIBLE_COURSES} khóa`}
                    {coursesExpanded ? <ChevronDown className="h-3 w-3 rotate-180" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                )}
              </nav>
            </div>

            {/* TRỤ CỘT 3: CẨM NANG PHỎNG VẤN */}
            <div className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
                <GraduationCap className="h-3 w-3 text-indigo-400" />
                <span>Cẩm Nang Phỏng Vấn</span>
              </div>

              <Link
                href="/interview"
                aria-current={isInterviewRoute ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isInterviewRoute
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                <GraduationCap className="h-4 w-4 shrink-0 text-indigo-400" />
                <span className="truncate">Phỏng vấn Java & Microservices</span>
              </Link>
            </div>

            {/* TRỤ CỘT 1: LUYỆN GIẢI THUẬT */}
            <div className="space-y-1 border-t border-[var(--border)] pt-3">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-3 w-3 text-blue-500" />
                  <span>Luyện Giải Thuật</span>
                </span>
              </div>

              {/* Collapsible Accordion Header */}
              <button
                type="button"
                onClick={() => setProblemsTreeOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isProblemsRoute && !problemsTreeOpen
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Layers className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="truncate">Top Interview 150</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded-md bg-blue-500/15 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                    150 bài
                  </span>
                  {problemsTreeOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 text-[var(--muted)]" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-[var(--muted)]" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {problemsTreeOpen && (
                <div className="pt-1">
                  <ProblemNavTree />
                </div>
              )}
            </div>
          </div>

          {/* Expanded Footer */}
          <div className="shrink-0 border-t border-[var(--border)] p-3 space-y-2">
            <ThemeToggle />
            <p className="px-1 text-[10px] leading-relaxed text-[var(--muted)]">
              QuantaVault • Nền tảng tri thức kỹ sư toàn diện.
            </p>
          </div>
        </>
      ) : (
        /* COLLAPSED MINI-RAIL (w-16) */
        <div className="flex flex-1 flex-col items-center justify-between py-4">
          <div className="flex flex-col items-center gap-3">
            {/* Quick Logo to Home */}
            <Link
              href="/"
              className="flex size-9 items-center justify-center rounded-xl overflow-hidden shadow-sm hover:scale-105 transition-transform"
              title="QuantaVault"
            >
              <img
                src="/brand-logo.png"
                alt="Logo Java"
                className="size-8 rounded-xl object-cover"
              />
            </Link>

            {/* Mini Dashboard Icon */}
            <Link
              href="/"
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                pathname === "/"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
              title="Dashboard Tổng Quan"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Link>

            {/* Mini Courses Icon */}
            <Link
              href="/courses"
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                isCoursesRoute
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
              title="Khóa Học & Lộ Trình"
            >
              <BookOpen className="h-4 w-4 text-emerald-500" />
            </Link>

            {/* Mini Interview Icon */}
            <Link
              href="/interview"
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                isInterviewRoute
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
              title="Phỏng Vấn Java"
            >
              <GraduationCap className="h-4 w-4" />
            </Link>

            {/* Mini Algorithms Icon */}
            <Link
              href="/problems"
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                isProblemsRoute
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-[var(--muted-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
              }`}
              title="Luyện Giải Thuật 150"
            >
              <Code2 className="h-4 w-4" />
            </Link>

            {/* Mini Search Icon */}
            <button
              type="button"
              onClick={openSearch}
              className="flex size-9 items-center justify-center rounded-xl text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
              title="Tìm kiếm (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Mini Footer Theme Toggle */}
          <div className="flex flex-col items-center gap-2">
            <ThemeToggle compact />
          </div>
        </div>
      )}
    </aside>
  );
}
