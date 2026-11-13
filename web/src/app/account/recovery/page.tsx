import type { Metadata } from "next";
import Link from "next/link";
import { InterviewCloudSync } from "@/features/interview/InterviewCloudSync";

export const metadata: Metadata = {
  title: "Khôi phục tiến độ cũ — QuantaVault",
  description: "Công cụ khôi phục tiến độ từ mã đồng bộ được sử dụng trên QuantaVault trước khi có đăng nhập Google.",
  robots: { index: false, follow: false },
};

export default function LegacyProgressRecoveryPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-3">
        <Link href="/account/" className="inline-flex text-sm font-medium text-[var(--primary-strong)] hover:underline">
          ← Về tài khoản
        </Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Khôi phục tiến độ cũ</h1>
        <p className="text-sm leading-relaxed text-[var(--muted-strong)]">
          Công cụ này chỉ dành cho người đã lưu tiến độ bằng mã đồng bộ trước đây.
          Nếu bạn đang học bằng tài khoản Google và tiến độ vẫn được lưu bình thường, bạn không cần sử dụng trang này.
        </p>
      </header>
      <section aria-label="Lưu ý trước khi khôi phục" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
        <p className="font-semibold">Lưu ý trước khi khôi phục</p>
        <p className="mt-2 text-[var(--muted-strong)]">
          Hãy kiểm tra và sao lưu tiến độ hiện tại trước khi tải dữ liệu cũ về thiết bị.
          Công cụ này không tự chuyển dữ liệu cũ vào tài khoản Google của bạn.
          Chỉ tiếp tục nếu bạn có mã đồng bộ đã lưu từ trước.
        </p>
      </section>
      <InterviewCloudSync />
    </div>
  );
}
