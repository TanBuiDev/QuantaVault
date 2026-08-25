import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="relative">
        <span className="text-8xl sm:text-9xl font-black text-[var(--border-strong)] opacity-50 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight">
            Không tìm thấy trang
          </span>
        </div>
      </div>

      <p className="mt-4 max-w-md text-sm text-[var(--muted)] leading-relaxed">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển trong hệ thống Top Interview 150.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary" size="md">
            Quay về Dashboard
          </Button>
        </Link>
        <Link href="/problems">
          <Button variant="secondary" size="md">
            Xem danh sách bài tập
          </Button>
        </Link>
      </div>
    </div>
  );
}

