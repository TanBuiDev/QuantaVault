import type { Metadata } from "next";
import { AccountTabs } from "@/features/interview/AccountTabs";

export const metadata: Metadata = {
  title: "Tài khoản — QuantaVault",
  description: "Quản lý tài khoản Google và tiến độ học tập của bạn.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tài khoản</h1>
        <p className="text-sm text-[var(--muted-strong)]">Đăng nhập Google để lưu tiến độ học tập và tiếp tục trên các thiết bị khác.</p>
      </header>
      <AccountTabs />
    </div>
  );
}
