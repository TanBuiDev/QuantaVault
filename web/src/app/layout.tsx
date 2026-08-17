import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ProgressProvider } from "@/lib/progress/provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Top Interview 150",
    template: "%s | Top Interview 150",
  },
  description: "A focused practice companion for LeetCode Top Interview 150.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ProgressProvider>
            <AppShell>{children}</AppShell>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
