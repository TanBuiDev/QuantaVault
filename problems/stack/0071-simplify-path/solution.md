# 71. Simplify Path — Solution

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
