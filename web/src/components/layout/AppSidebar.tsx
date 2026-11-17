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
  ChevronDown,
  ChevronRight,
  Code2
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { CourseIcon } from "@/components/ui/CourseIcon";
import { useSidebar } from "./SidebarContext";
import { ProblemNavTree } from "./ProblemNavTree";
import type { CourseNavigationItem } from "@/lib/courses";
import { useCourseProgress } from "@/lib/courses/useCourseProgress";
import { SidebarAccount } from "./SidebarAccount";
import styles from "./AppSidebar.module.css";

const MAX_VISIBLE_COURSES = 4;

export function AppSidebar({ courses = [] }: { courses?: CourseNavigationItem[] }) {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, setSidebarOpen } = useSidebar();
  const { hydrated, getCourseRecord } = useCourseProgress();
  const [coursesExpanded, setCoursesExpanded] = useState(false);

  const isProblemsRoute = pathname?.startsWith("/problems");
  const isCoursesRoute = pathname?.startsWith("/courses");
  const isCourseIndex = pathname === "/courses" || pathname === "/courses/";
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
      aria-label="Thanh bên QuantaVault"
      className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-full flex-col border-r border-[var(--border)] bg-[var(--sidebar)] transition-[width,translate,visibility] duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "invisible -translate-x-full lg:visible lg:w-16 lg:translate-x-0"
      }`}
    >
      <div className={`flex h-16 shrink-0 items-center gap-2 border-b border-[var(--border)] px-3 ${isOpen ? "justify-between" : "justify-center"}`}>
        {isOpen && (
          <Link href="/" className={`${styles.interactive} flex min-w-0 items-center gap-2.5 rounded-xl`}>
            <img
              src="/brand-icon.svg"
              alt=""
              className="size-9 shrink-0 rounded-xl object-cover shadow-md shadow-indigo-500/25"
            />
            <div className="min-w-0">
              <span className="block truncate text-xs font-bold tracking-tight text-[var(--foreground)]">QuantaVault</span>
              <span className="block truncate text-[10px] font-medium text-[var(--muted)]">Knowledge Engine</span>
            </div>
          </Link>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          className={`${styles.interactive} grid size-10 shrink-0 place-items-center rounded-xl text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]`}
          title={isOpen ? "Thu gọn thanh bên (Ctrl+B)" : "Mở rộng thanh bên (Ctrl+B)"}
        >
          {isOpen ? <PanelLeftClose aria-hidden="true" className="size-5" /> : <PanelLeftOpen aria-hidden="true" className="size-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto overscroll-contain px-2 py-3">
          <button
            type="button"
            onClick={openSearch}
            className={`${styles.interactive} flex min-h-10 w-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] px-3 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]`}
          >
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-left">Tìm kiếm bài tập...</span>
            <kbd className="shrink-0 rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--muted-strong)]">
              Ctrl K
            </kbd>
          </button>

          <nav aria-label="Điều hướng chính" className="space-y-3">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={styles.item}>
              <LayoutDashboard aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">Dashboard Tổng Quan</span>
            </Link>

            <div>
              <h2 className={styles.heading}>Khóa Học & Lộ Trình</h2>
              <Link href="/courses" aria-current={isCourseIndex ? "page" : undefined} className={styles.item}>
                <BookOpen aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">Tất cả khóa học</span>
              </Link>

              <nav aria-label="Danh sách khóa học" className="mt-0.5 space-y-0.5">
                {visibleCourses.map((course) => {
                  const active = pathname === `/courses/${course.slug}`
                    || pathname?.startsWith(`/courses/${course.slug}/`);
                  const record = hydrated ? getCourseRecord(course.id) : null;
                  const nextLesson = record?.lastAccessedLessonId
                    && course.lessonIds.includes(record.lastAccessedLessonId)
                    ? record.lastAccessedLessonId : course.firstLessonId;

                  return (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}/${nextLesson}`}
                      title={course.title}
                      aria-current={active ? "page" : undefined}
                      className={`${styles.item} ${styles.course}`}
                    >
                      <CourseIcon name={course.icon} className={`size-4 shrink-0 ${active ? "" : "text-emerald-600 dark:text-emerald-400"}`} />
                      <span className="line-clamp-2 min-w-0 flex-1 [overflow-wrap:anywhere]">{course.title}</span>
                      <span className={`shrink-0 whitespace-nowrap rounded-md px-1.5 text-[10px] font-semibold ${
                        active ? "bg-white/15" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      }`}>
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
                    className={`${styles.item} w-full justify-center`}
                  >
                    {coursesExpanded ? "Thu gọn" : `Xem thêm ${courses.length - MAX_VISIBLE_COURSES} khóa`}
                    <ChevronDown aria-hidden="true" className={`size-3 ${coursesExpanded ? "rotate-180" : ""}`} />
                  </button>
                )}
              </nav>
            </div>

            <div>
              <h2 className={styles.heading}>Cẩm Nang Phỏng Vấn</h2>
              <Link href="/interview" aria-current={isInterviewRoute ? "page" : undefined} className={styles.item}>
                <GraduationCap aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">Phỏng vấn Java & Microservices</span>
              </Link>
            </div>

            <div>
              <h2 className={styles.heading}>Luyện Giải Thuật</h2>
              <button
                type="button"
                aria-expanded={problemsTreeOpen}
                data-current={isProblemsRoute && !problemsTreeOpen}
                onClick={() => setProblemsTreeOpen((prev) => !prev)}
                className={`${styles.item} w-full`}
              >
                <Layers aria-hidden="true" className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">Top Interview 150</span>
                <span className="shrink-0 rounded-md bg-[var(--primary-soft)] px-1.5 text-[10px] font-semibold text-[var(--primary-strong)]">
                  150 bài
                </span>
                {problemsTreeOpen ? (
                  <ChevronDown aria-hidden="true" className="size-3.5 shrink-0" />
                ) : (
                  <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
                )}
              </button>
              {problemsTreeOpen && <div className="pt-1"><ProblemNavTree /></div>}
            </div>
          </nav>
        </div>
      ) : (
        <nav aria-label="Điều hướng chính" className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto overscroll-contain py-3 [scrollbar-width:none]">
          <Link href="/" className={`${styles.item} ${styles.railItem} shrink-0`} title="QuantaVault">
            <img src="/brand-icon.svg" alt="" className="size-8 rounded-xl object-cover" />
          </Link>
          {[
            { href: "/", title: "Dashboard Tổng Quan", Icon: LayoutDashboard, active: pathname === "/" },
            { href: "/courses", title: "Khóa Học & Lộ Trình", Icon: BookOpen, active: isCoursesRoute },
            { href: "/interview", title: "Phỏng Vấn Java", Icon: GraduationCap, active: isInterviewRoute },
            { href: "/problems", title: "Luyện Giải Thuật 150", Icon: Code2, active: isProblemsRoute },
          ].map(({ href, title, Icon, active }) => (
            <Link key={href} href={href} title={title} aria-current={active ? "page" : undefined}
              className={`${styles.item} ${styles.railItem} shrink-0`}>
              <Icon aria-hidden="true" className="size-4" />
            </Link>
          ))}
          <button type="button" onClick={openSearch} title="Tìm kiếm (Ctrl+K)"
            className={`${styles.item} ${styles.railItem} shrink-0`}>
            <Search aria-hidden="true" className="size-4" />
          </button>
        </nav>
      )}

      <div className={`grid shrink-0 gap-2 border-t border-[var(--border)] px-3 py-3 ${isOpen ? "grid-cols-[minmax(0,1fr)]" : "justify-center"}`}>
        <SidebarAccount compact={!isOpen} />
        <ThemeToggle compact={!isOpen} />
      </div>
    </aside>
  );
}
