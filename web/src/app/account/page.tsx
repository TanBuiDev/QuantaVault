import type { Metadata } from "next";
import { AccountTabs } from "@/features/interview/AccountTabs";

export const metadata: Metadata = {
  title: "Tài khoản & đồng bộ — QuantaVault",
  description: "Quản lý tài khoản Google, tự đồng bộ tiến độ học tập và bảo mật.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tài khoản & đồng bộ</h1>
        <p className="text-sm text-[var(--muted-strong)]">Đăng nhập Google một lần để tự động khôi phục và đồng bộ tiến độ phỏng vấn, khóa học và Top Interview 150.</p>
      </header>
      <AccountTabs />
    </div>
  );
}
