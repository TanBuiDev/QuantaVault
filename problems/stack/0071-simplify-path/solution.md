# 71. Simplify Path — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Unix path gồm các segments: tên folder đi vào một level, '.' không đổi gì, '..' quay lại một level nếu có. Multiple slashes chỉ là separator dư và không tạo folder.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Xử lý ký tự từng char dễ tạo nhiều edge cases. Quan sát split theo '/' biến input thành tokens có semantic rõ; stack/deque giữ canonical path segments chưa bị '..' hủy.

**State / invariant / data structure cần hiểu trước code.** Deque chứa folder names của simplified path từ root tới current. Invariant sau mỗi token: deque chính là canonical path của prefix đã đọc; '..' pop nếu nonempty, '.'/empty bỏ qua, name push/add.

**Dry run mental theo implementation.** Dry run '/a/./b/../../c/': tokens a push, . skip, b push, .. pop b, .. pop a, c push; join deque thành '/c'.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là cho '..' đi trên root hoặc giữ empty tokens. Khi nào dùng: hierarchical navigation với enter/stay/back semantics thường là stack of path components.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Intuition

Tách path thành directory components. Empty token và `.` không đổi vị trí; `..` hủy component gần nhất; token khác là tên thật cần giữ. Deque lưu canonical path từ root tới leaf.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public String simplifyPath(String path) {
        Deque<String> directories = new ArrayDeque<>();

        for (String part : path.split("/")) {
            // Empty token chỉ do repeated/edge slash, còn "." không đổi location;
            // bỏ chúng tương đương normalize mà không thêm component vào canonical path.
            if (part.isEmpty() || part.equals(".")) {
                continue;
            }

            if (part.equals("..")) {
                // Parent navigation chỉ hủy directory gần nhất; tại root thì không
                // có parent để đi lên nên ".." trở thành no-op.
                if (!directories.isEmpty()) {
                    directories.removeLast();
                }
            } else {
                // Chỉ exact "." và ".." là special; tên như "..." phải giữ nguyên.
                directories.addLast(part);
            }
        }

        // addLast/removeLast giữ deque theo thứ tự root -> leaf nên có thể join trực tiếp.
        return "/" + String.join("/", directories);
    }
}
```

## 3. Correctness

Sau mỗi token, deque là canonical directory sequence của prefix đã xử lý. `..` pop đúng parent gần nhất, empty/`.` không đổi state, tên khác append vào leaf. Join bằng một slash tạo đúng canonical form.

## 4. Complexity

```text
Time: O(n)
Space: O(n)
```

## 5. Common mistakes

- Treat `...` như `..`.
- Pop khi đang ở root.
- Giữ repeated/trailing slash.
- Rebuild path sai thứ tự stack.
