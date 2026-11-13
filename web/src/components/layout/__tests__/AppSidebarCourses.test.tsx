import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLearningSessionActive } from "@/lib/auth/progressAccess";
import { SidebarProvider } from "../SidebarContext";
import { AppSidebar } from "../AppSidebar";
import type { CourseNavigationItem } from "@/lib/courses";

const pathname = vi.hoisted(() => vi.fn(() => "/courses"));
vi.mock("next/navigation", () => ({ usePathname: pathname }));
vi.mock("@/components/theme/ThemeToggle", () => ({ ThemeToggle: () => null }));
vi.mock("../ProblemNavTree", () => ({ ProblemNavTree: () => null }));
vi.mock("../SidebarAccount", () => ({ SidebarAccount: () => null }));

function course(n: number): CourseNavigationItem {
  return {
    id: "course-" + n,
    slug: "course-" + n,
    title: n === 1 ? "Database & PostgreSQL cho Java Backend" :
      n === 2 ? "Redis từ cơ bản đến thực chiến với Java Spring Boot" : "Khóa số " + n,
    icon: n === 1 ? "Database" : "Server",
    totalLessons: n === 1 ? 20 : 10,
    firstLessonId: "lesson-01",
    lessonIds: ["lesson-01", "lesson-02"]
  };
}

function renderSidebar(courses: CourseNavigationItem[]) {
  return render(<SidebarProvider><AppSidebar courses={courses} /></SidebarProvider>);
}

describe("Dynamic course sidebar", () => {
  beforeEach(() => {
    pathname.mockReturnValue("/courses");
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1280 });
    localStorage.clear();
    setLearningSessionActive(true);
  });
  afterEach(() => setLearningSessionActive(false));

  it("renders the registry's only course without hardcoded menu entries", () => {
    renderSidebar([course(1)]);
    const navigation = screen.getByRole("navigation", { name: "Danh sách khóa học" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(1);
    expect(within(navigation).getByRole("link", { name: /PostgreSQL/ })).toHaveAttribute("href", "/courses/course-1/lesson-01");
    expect(within(navigation).queryByRole("link", { name: /Redis/ })).not.toBeInTheDocument();
  });

  it("renders both PostgreSQL and Redis dynamically", () => {
    renderSidebar([course(1), course(2)]);
    const navigation = screen.getByRole("navigation", { name: "Danh sách khóa học" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(2);
    expect(within(navigation).getByRole("link", { name: /Redis/ })).toHaveAttribute("href", "/courses/course-2/lesson-01");
    expect(within(navigation).queryByRole("button", { name: /Xem thêm/ })).not.toBeInTheDocument();
  });

  it("shows four of ten courses, supports show more and collapse", () => {
    renderSidebar(Array.from({ length: 10 }, (_, i) => course(i + 1)));
    const navigation = screen.getByRole("navigation", { name: "Danh sách khóa học" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(4);
    fireEvent.click(within(navigation).getByRole("button", { name: /Xem thêm 6 khóa/ }));
    expect(within(navigation).getAllByRole("link")).toHaveLength(10);
    fireEvent.click(within(navigation).getByRole("button", { name: "Thu gọn" }));
    expect(within(navigation).getAllByRole("link")).toHaveLength(4);
  });

  it("keeps the active course visible even if it is the tenth course", () => {
    pathname.mockReturnValue("/courses/course-10/lesson-01");
    renderSidebar(Array.from({ length: 10 }, (_, i) => course(i + 1)));
    const navigation = screen.getByRole("navigation", { name: "Danh sách khóa học" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(4);
    expect(within(navigation).getByRole("link", { name: /Khóa số 10/ })).toHaveAttribute("aria-current", "page");
  });

  it("resumes a valid saved lesson without deleting or rewriting progress", () => {
    const record = {
      version: 1,
      courses: { "course-2": {
        completedLessonIds: ["lesson-01"],
        lastAccessedLessonId: "lesson-02",
        updatedAt: "2026-11-08T00:00:00.000Z"
      } }
    };
    localStorage.setItem("quantavault-course-progress:v1", JSON.stringify(record));
    renderSidebar([course(1), course(2)]);
    const navigation = screen.getByRole("navigation", { name: "Danh sách khóa học" });
    expect(within(navigation).getByRole("link", { name: /Redis/ })).toHaveAttribute("href", "/courses/course-2/lesson-02");
    expect(localStorage.getItem("quantavault-course-progress:v1")).toBe(JSON.stringify(record));
  });
});
