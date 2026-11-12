import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư — QuantaVault",
  description: "Thông tin về quyền riêng tư khi đăng nhập Google và quản lý tiến độ học tập trên QuantaVault.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 leading-relaxed sm:p-8">
      <h1 className="text-2xl font-bold">Chính sách quyền riêng tư — QuantaVault</h1>
      <p className="text-sm text-[var(--muted-strong)]">Cập nhật: 12/11/2026.</p>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">1. Đăng nhập bằng Google</h2>
        <p>QuantaVault chỉ yêu cầu các quyền cơ bản <code>openid</code>, <code>email</code> và <code>profile</code> để xác thực tài khoản. Ứng dụng có thể lưu mã định danh Google (<code>sub</code>), địa chỉ email đã xác minh và tên hiển thị. QuantaVault không nhận mật khẩu Google của bạn và không yêu cầu quyền xem Gmail, Drive hoặc danh bạ.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">2. Phiên đăng nhập</h2>
        <p>Sau khi đăng nhập, hệ thống tạo một phiên riêng bằng cookie <code>HttpOnly</code>, <code>Secure</code> và <code>SameSite=Lax</code>. Máy chủ chỉ lưu giá trị băm của mã phiên trong Cloudflare D1; phiên hết hạn sau tối đa 14 ngày hoặc khi bạn đăng xuất. Dữ liệu OAuth token của Google không được lưu để truy cập các dịch vụ Google khác.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">3. Tiến độ học tập</h2>
        <p>Trạng thái Nắm vững, Cần ôn và Đã lưu được giữ trên thiết bị. Nếu bạn chủ động chọn lưu tiến độ vào tài khoản Google, QuantaVault sẽ ghi một bản dữ liệu riêng trong Cloudflare D1. Việc đăng nhập không tự chuyển, xóa hoặc ghi đè tiến độ có sẵn. Mã đồng bộ riêng từ phiên bản trước vẫn hoạt động độc lập.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">4. Mục đích và lưu trữ</h2>
        <p>Thông tin được sử dụng để nhận diện người học, duy trì phiên đăng nhập và hỗ trợ lưu tiến độ nếu được yêu cầu. Dữ liệu nằm trong cơ sở dữ liệu Cloudflare D1 do QuantaVault quản lý. QuantaVault không yêu cầu truy cập các dịch vụ cá nhân khác của Google cho tính năng này.</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">5. Kiểm soát dữ liệu</h2>
        <p>Bạn có thể đăng xuất mà không xóa tiến độ trên máy. Hiện chưa có nút xóa tài khoản trực tiếp; để hỏi về dữ liệu hoặc yêu cầu xóa, hãy liên hệ chủ dự án qua trang <a className="font-semibold underline" href="https://github.com/TanBuiDev/QuantaVault">QuantaVault trên GitHub</a>. Không công khai mã đồng bộ, email cá nhân hoặc thông tin đăng nhập trong GitHub Issues.</p>
      </section>
      <p className="text-xs text-[var(--muted-strong)]">Google đăng nhập theo chính sách quyền riêng tư riêng của Google. Chính sách này áp dụng cho các chức năng QuantaVault mô tả phía trên.</p>
    </article>
  );
}
