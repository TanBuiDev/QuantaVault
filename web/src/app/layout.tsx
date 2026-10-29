import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
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
  description: "QuantaVault – Offline-First Software Architecture & Engineering Knowledge Engine. Củng cố kiến trúc phần mềm, Java Backend, Distributed Systems và 538+ bài toán kỹ thuật chuyên sâu.",
  icons: {
    icon: [
      { url: "/brand-logo.png", sizes: "any" },
      { url: "/favicon.ico" },
    ],
    apple: "/brand-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ProgressProvider>
            <ToastProvider>
              <ConfirmProvider>
                <AppShell>{children}</AppShell>
              </ConfirmProvider>
            </ToastProvider>
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
