# 20. Valid Parentheses — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Mỗi closing bracket phải đóng đúng opening bracket gần nhất chưa được đóng. Từ '([{}])', dấu } phải ghép với { chứ không phải ( hay [, nên thứ tự LIFO là bản chất bài toán.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Đếm số lượng từng loại không đủ vì '([)]' có counts đúng nhưng nesting sai. Quan sát stack lưu các opening brackets còn pending; closing chỉ hợp lệ nếu top là loại tương ứng.

**State / invariant / data structure cần hiểu trước code.** Stack là chuỗi opening tokens chưa matched theo thứ tự nesting. Invariant sau mỗi ký tự hợp lệ: stack top luôn là bracket bắt buộc phải được đóng tiếp trước mọi opening nằm dưới.

**Dry run mental theo implementation.** Dry run '([)]': push (, push [, gặp ) nhưng top là [ nên fail ngay. Với '([])', ] pop [, ) pop (, cuối stack rỗng nên valid.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ check stack không rỗng mà không check type hoặc quên yêu cầu stack rỗng cuối. Khi nào dùng: nested open/close scopes thường là stack pending-context.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
