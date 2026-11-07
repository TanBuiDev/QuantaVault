import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { CourseCatalogView } from "../CourseCatalogView";
import { getAllCourses } from "@/lib/courses";
import type { CourseManifest } from "@/lib/courses";

const realCourses = getAllCourses();

function saveProgress(id: string, lessonId: string, completedLessonIds: string[] = []) {
  localStorage.setItem("quantavault-course-progress:v1", JSON.stringify({
    version: 1,
    courses: {
      [id]: {
        completedLessonIds,
        lastAccessedLessonId: lessonId,
        updatedAt: "2026-11-08T00:00:00.000Z"
      }
    }
  }));
}

describe("CourseCatalogView: scalable course catalog", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders PostgreSQL and Redis in a two-course grid", () => {
    render(<CourseCatalogView courses={realCourses} />);
    const section = screen.getByRole("region", { name: "Danh sách lộ trình học tập" });
    expect(within(section).getByText("Lộ Trình Hiện Có (2)")).toBeInTheDocument();
    expect(within(section).getByRole("heading", { name: /Database & PostgreSQL/ })).toBeInTheDocument();
    expect(within(section).getByRole("heading", { name: /Redis từ cơ bản/ })).toBeInTheDocument();
    expect(within(section).getByRole("searchbox", { name: "Tìm kiếm khóa học" })).toBeInTheDocument();
  });

  it("filters by search, displays empty result and resets filters", () => {
    render(<CourseCatalogView courses={realCourses} />);
    const section = screen.getByRole("region", { name: "Danh sách lộ trình học tập" });
    const search = within(section).getByRole("searchbox", { name: "Tìm kiếm khóa học" });
    fireEvent.change(search, { target: { value: "Redis" } });
    expect(within(section).getByRole("heading", { name: /Redis từ cơ bản/ })).toBeInTheDocument();
    expect(within(section).queryByRole("heading", { name: /Database & PostgreSQL/ })).not.toBeInTheDocument();

    fireEvent.change(search, { target: { value: "khong-co-khoa-nay" } });
    expect(within(section).getByText("Không tìm thấy khóa học phù hợp")).toBeInTheDocument();
    fireEvent.click(within(section).getByRole("button", { name: "Xóa bộ lọc" }));
    expect(within(section).getByRole("heading", { name: /Database & PostgreSQL/ })).toBeInTheDocument();
  });

  it("filters studying vs not started without writing progress", () => {
    const redis = realCourses.find((course) => course.slug === "redis-for-java")!;
    saveProgress(redis.id, redis.lessons[0].id);
    const snapshot = localStorage.getItem("quantavault-course-progress:v1");
    render(<CourseCatalogView courses={realCourses} />);
    const section = screen.getByRole("region", { name: "Danh sách lộ trình học tập" });
    fireEvent.change(within(section).getByRole("combobox", { name: "Lọc trạng thái khóa học" }), {
      target: { value: "studying" }
    });
    expect(within(section).getByRole("heading", { name: /Redis từ cơ bản/ })).toBeInTheDocument();
    expect(within(section).queryByRole("heading", { name: /Database & PostgreSQL/ })).not.toBeInTheDocument();
    fireEvent.change(within(section).getByRole("combobox", { name: "Lọc trạng thái khóa học" }), {
      target: { value: "not-started" }
    });
    expect(within(section).getByRole("heading", { name: /Database & PostgreSQL/ })).toBeInTheDocument();
    expect(within(section).queryByRole("heading", { name: /Redis từ cơ bản/ })).not.toBeInTheDocument();
    expect(localStorage.getItem("quantavault-course-progress:v1")).toBe(snapshot);
  });

  it("resumes the most recently visited course rather than always PostgreSQL", () => {
    const redis = realCourses.find((course) => course.slug === "redis-for-java")!;
    saveProgress(redis.id, redis.lessons[1].id);
    render(<CourseCatalogView courses={realCourses} />);
    const resume = screen.getByRole("link", { name: /Bài 2: Cấu trúc dữ liệu Redis/ });
    expect(resume).toHaveAttribute("href", "/courses/redis-for-java/lesson-02");
  });

  it("renders ten distinct courses in a responsive grid", () => {
    const base = realCourses[1];
    const ten: CourseManifest[] = Array.from({ length: 10 }, (_, i) => ({
      ...base, id: "sample-" + i, slug: "sample-" + i, title: "Khóa số " + i
    }));
    const { container } = render(<CourseCatalogView courses={ten} />);
    const section = screen.getByRole("region", { name: "Danh sách lộ trình học tập" });
    expect(within(section).getByText("Lộ Trình Hiện Có (10)")).toBeInTheDocument();
    for (let i = 0; i < 10; i++) {
      expect(within(section).getByRole("heading", { name: "Khóa số " + i })).toBeInTheDocument();
    }
    expect(container.querySelector(".md\\:grid-cols-2")).toBeInTheDocument();
  });

  it("preserves the featured layout when a single course exists", () => {
    render(<CourseCatalogView courses={[realCourses[0]]} />);
    expect(screen.getByRole("heading", { name: /Database & PostgreSQL/ })).toBeInTheDocument();
    expect(screen.getByText("Lộ Trình Hiện Có (1)")).toBeInTheDocument();
  });
});
