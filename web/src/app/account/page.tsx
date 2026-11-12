import type { Metadata } from "next";
import { GoogleAccountPanel } from "@/features/interview/GoogleAccountPanel";
import { AdminAccountPanel } from "@/features/interview/AdminAccountPanel";
import { InterviewCloudSync } from "@/features/interview/InterviewCloudSync";

export const metadata: Metadata = {
  title: "Tài khoản & đồng bộ — QuantaVault",
  description: "Đăng nhập Google, liên kết tiến độ học tập và quản lý quyền truy cập.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tài khoản & đồng bộ</h1>
        <p className="text-sm text-[var(--muted-strong)]">Đăng nhập Google, liên kết tiến độ hiện có và quản lý bảo mật QuantaVault. Bản nháp và mã đồng bộ cũ vẫn được giữ.</p>
      </header>
      <GoogleAccountPanel />
      <AdminAccountPanel />
      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Phục hồi tiến độ bằng mã cũ</h2>
        <p className="text-xs text-[var(--muted-strong)]">Mã 64 ký tự chỉ nên dùng để khôi phục khi cần. Sau khi liên kết Google, không bật hai luồng tự ghi song song. Trước khi tải dữ liệu từ mã cũ, hãy sao lưu tiến độ trên máy.</p>
        <InterviewCloudSync />
      </section>
    </div>
  );
}
