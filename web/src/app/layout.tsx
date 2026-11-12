import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { getAllCourses } from "@/lib/courses";
import type { CourseNavigationItem } from "@/lib/courses";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ProgressProvider } from "@/lib/progress/provider";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";

import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-next-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-next-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QuantaVault — Architecture & Engineering Knowledge Engine",
    template: "%s | QuantaVault",
  },
  description: "QuantaVault – Kho kiến thức kiến trúc phần mềm và luyện thuật toán Java. Củng cố Java Backend, Distributed Systems và kỹ năng phỏng vấn qua bài học, lời giải và workspace cục bộ.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // Serialize only minimal navigation metadata to the client, never course lesson content.
  const courseNavigation: CourseNavigationItem[] = getAllCourses().map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    icon: course.icon,
    totalLessons: course.totalLessons,
    firstLessonId: course.lessons[0]?.id ?? "lesson-01",
    lessonIds: course.lessons.map((lesson) => lesson.id)
  }));
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ProgressProvider>
            <ToastProvider>
              <ConfirmProvider>
                <AppShell courses={courseNavigation}>{children}</AppShell>
              </ConfirmProvider>
            </ToastProvider>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
