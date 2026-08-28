# Kế hoạch triển khai Online Judge (LeetCode Clone)

Mục tiêu: Tích hợp Code Editor, bảng Testcases, giao diện Console/Output và hệ thống chấm điểm dựa trên Piston Public API vào `PracticeView.tsx`.

## 📌 Các Quyết Định Đã Chốt
1. **Layout**: Sử dụng `react-resizable-panels` để chia đôi màn hình (Trái: Đề bài, Phải: Code Editor) giống hệt LeetCode.
2. **Thư viện Editor**: Lựa chọn `@monaco-editor/react`. 
   - *Lý do*: Nó chính là core của VS Code, mang lại trải nghiệm gõ code chuyên nghiệp nhất (có minimap, auto-complete tốt). Về cấu hình, trình duyệt hiện đại nào cũng chạy được, nó chỉ làm tăng dung lượng tải trang lần đầu tiên lên một chút (~2MB), hoàn toàn phù hợp cho dự án web.
3. **Ngôn ngữ hỗ trợ**: **Java** (phiên bản đầu tiên).

---

## 📖 Giải thích Cơ chế Wrapper (Câu số 5)

Tại sao phải cần Wrapper? 

Nếu bạn nộp code trực tiếp lên Piston API (hoặc Java thông thường), chương trình bắt buộc phải có hàm `main`. Tức là người dùng sẽ phải viết đoạn code rất dài dòng như thế này:
```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Tự viết code đọc mảng input phức tạp...
        Solution sol = new Solution();
        int result = sol.hIndex(citations);
        System.out.println(result);
    }
}
class Solution {
    public int hIndex(int[] citations) { return 0; }
}
```

Tuy nhiên, **ở LeetCode**, người dùng chỉ cần viết phần lõi:
```java
class Solution {
    public int hIndex(int[] citations) { return 0; }
}
```
**Cơ chế Wrapper** chính là việc hệ thống của chúng ta sẽ tự động lấy đoạn code `class Solution {...}` của người dùng gõ, sau đó ghép nối nó (nối chuỗi string ẩn ở hậu trường) với một đoạn mã `public class Main {...}` do chúng ta tự định nghĩa. Cuối cùng, chúng ta gửi khối code hoàn chỉnh này lên Piston API. Nhờ vậy, người dùng không cần quan tâm tới việc đọc ghi file hay console, chỉ tập trung giải thuật toán. Mình sẽ thiết kế cơ chế này cho bạn.

---

## 📝 Schema cho Testcase (Câu số 4)

Thay vì mình liệt kê ra một chỗ, mình sẽ thiết kế một cấu trúc JSON chuẩn. Bạn (hoặc mình) có thể mở các file data bài tập (ví dụ `problems/h-index.json`) và thêm cục `testcases` này vào là hệ thống tự động nhận diện.

**Cấu trúc JSON đề xuất:**
```json
{
  "testcases": [
    {
      "id": "1",
      "name": "Example 1",
      "input": "[3,0,6,1,5]",
      "expectedOutput": "3"
    },
    {
      "id": "2",
      "name": "Example 2",
      "input": "[1,3,1]",
      "expectedOutput": "1"
    }
  ]
}
```
*(Nếu bạn muốn mình trực tiếp thêm vào file bài tập luôn thì báo mình nhé!)*

---

## 🚀 Proposed Changes (Các bước Code)

### 1. Cài đặt thư viện
- Cài đặt `react-resizable-panels`, `@monaco-editor/react`.

### 2. Giao diện (UI/UX)
- Chỉnh sửa `PracticeView.tsx` thành dạng Resizable Panel.
- Component `CodeEditorPanel.tsx`: Giao diện Monaco Editor gõ Java.
- Component `TestcasePanel.tsx`: Hiển thị danh sách các tabs testcase và kết quả.
- Component `ExecutionBar.tsx`: Chứa các nút "Run" và "Submit".

### 3. Tích hợp Piston API & Wrapper
- File `lib/piston.ts`: Gọi Piston API.
- File `lib/wrappers/javaWrapper.ts`: Chứa code generate class `Main` bọc lấy `class Solution`.

## Verification Plan
- Chạy thử bài H-Index bằng Java, truyền input `[3,0,6,1,5]`, kì vọng Console in ra `3`. Mọi thứ khớp nhau thì hiện Accepted.
