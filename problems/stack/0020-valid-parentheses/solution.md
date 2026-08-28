# 20. Valid Parentheses — Solution

## 1. Core idea / Intuition

Closing bracket phải đóng opening bracket **gần nhất chưa được đóng**, đúng quan hệ LIFO. Ta push luôn closing bracket mong đợi để khi gặp một closer chỉ cần so với stack top.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            // Push expected closer thay vì opening bracket để stack top luôn là
            // ký tự duy nhất hợp lệ có thể xuất hiện tiếp theo ở nesting hiện tại.
            if (c == '(') {
                stack.push(')');
            } else if (c == '[') {
                stack.push(']');
            } else if (c == '{') {
                stack.push('}');
            } else if (stack.isEmpty() || stack.pop() != c) {
                // Closing bracket không thể được sửa bởi ký tự tương lai: opening
                // tương ứng phải nằm trước nó và đúng top theo quy tắc LIFO.
                return false;
            }
        }

        // Không mismatch vẫn chưa đủ: stack còn phần tử nghĩa là có opening chưa đóng.
        return stack.isEmpty();
    }
}
```

## 3. Correctness

Invariant: stack từ top xuống chứa chính xác các closing bracket cần xuất hiện để đóng các opening chưa match trong prefix. Opening push expected closer; closing phải khớp top. Cuối chuỗi stack rỗng iff mọi opening đã được đóng.

## 4. Complexity

```text
Time: O(n)
Space: O(n)
```

## 5. Common mistakes

- Chỉ đếm số lượng bracket mà không kiểm tra nesting.
- Pop khi stack rỗng.
- Quên kiểm tra stack rỗng ở cuối.
- Dùng queue thay vì stack.
