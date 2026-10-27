# Quy Định Phát Triển Ứng Dụng (AGENTS.md)

Tài liệu này chứa các nguyên tắc, tiêu chuẩn thiết kế UI/UX và quy tắc bắt buộc áp dụng cho toàn bộ dự án và các AI Agents khi phát triển codebase.

---

## 🚫 1. NGUYÊN TẮC BẮT BUỘC VỀ MODAL & HỘP THOẠI XÁC NHẬN

### ❌ TUYỆT ĐỐI KHÔNG SỬ DỤNG HỘP THOẠI MẶC ĐỊNH CỦA TRÌNH DUYỆT:
- **KHÔNG ĐƯỢC** sử dụng `window.alert()`, `alert()`.
- **KHÔNG ĐƯỢC** sử dụng `window.confirm()`, `confirm()`.
- **KHÔNG ĐƯỢC** sử dụng `window.prompt()`, `prompt()`.

### ✅ BẮT BUỘC SỬ DỤNG HỆ THỐNG SHARED UI COMPONENT CỦA DỰ ÁN:
Tất cả các tính năng mới hoặc nâng cấp giao diện bắt buộc phải dùng các component dùng chung (`@/components/ui/*`):
1. **Thông báo nhanh (Toast Notification)**: Sử dụng hook `useToast()` từ `@/components/ui/Toast` (`success()`, `error()`, `info()`, `warning()`).
2. **Hộp thoại xác nhận (Confirmation Dialog)**: Sử dụng hook `useConfirm()` từ `@/components/ui/ConfirmDialog`.
3. **Cửa sổ Modal tương tác (Interactive Modal)**: Sử dụng component `<Modal />` từ `@/components/ui/Modal`.

#### Cách sử dụng chuẩn của `useConfirm()`:
```tsx
import { useConfirm } from "@/components/ui/ConfirmDialog";

function MyComponent() {
  const confirm = useConfirm();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Xác nhận xóa câu hỏi?",
      message: "Hành động này sẽ đánh dấu xóa câu hỏi. Bạn có chắc chắn muốn tiếp tục?",
      confirmText: "Xóa ngay",
      cancelText: "Hủy",
      variant: "danger", // "danger" | "warning" | "primary" | "info"
    });

    if (isConfirmed) {
      // Thực hiện logic sau khi người dùng xác nhận
    }
  };

  return <button onClick={handleDelete}>Xóa</button>;
}
```

#### Cách sử dụng chuẩn của `<Modal />`:
```tsx
import { Modal } from "@/components/ui/Modal";

function MyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tiêu đề Modal"
      description="Mô tả phụ ngắn gọn"
      maxWidth="md" // "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
    >
      <div className="space-y-4">
        {/* Nội dung modal */}
      </div>
    </Modal>
  );
}
```

---

## 🎨 2. TIÊU CHUẨN THIẾT KẾ GIAO DIỆN (UI/UX DESIGN SYSTEM)

1. **Aesthetics & Glassmorphism**:
   - Sử dụng CSS Variables chuẩn (`var(--surface)`, `var(--foreground)`, `var(--border)`, `var(--primary)`).
   - Tương thích 100% với cả **Chế độ Sáng (Light Mode)** và **Chế độ Tối (Dark Mode)**.
   - Hiệu ứng Backdrop Blur (`backdrop-blur-md`, `bg-slate-950/60`).

2. **Icons**:
   - Sử dụng vector icons từ thư viện `lucide-react`.
   - Tuyệt đối không dùng emoji văn bản thay thế cho các icon điều hướng hoặc hành động chính.

3. **Code Editor & Online Judge**:
   - Tích hợp **Monaco Editor** với template hàm rỗng chuẩn LeetCode.
   - Bố cục **Split Screen kéo thả** linh hoạt (`react-resizable-panels`) kết hợp thanh bên Mini-rail (`w-16` khi đóng, `w-72` khi mở).
