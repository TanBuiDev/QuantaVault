# 22. Generate Parentheses — Solution / Lời giải

## 1. Core idea / Intuition
Dùng `backtracking` và chỉ mở rộng các prefix vẫn có thể trở thành chuỗi ngoặc hợp lệ. Ta giữ hai bộ đếm `open` và `close`.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần sinh toàn bộ chuỗi độ dài `2n` gồm `n` dấu `(` và `n` dấu `)` sao cho mọi prefix đều không có nhiều dấu đóng hơn dấu mở.

## 3. Key observations / Nhận xét quan trọng
- Có thể thêm `(` nếu `open < n`.
- Có thể thêm `)` nếu `close < open`.
- Khi `open == close == n`, ta có một đáp án hoàn chỉnh.

## 4. Alternative approach
Sinh toàn bộ `2^(2n)` chuỗi rồi kiểm tra sẽ tạo rất nhiều trạng thái vô ích.

## 5. Optimal approach
Backtracking với invariant `0 <= close <= open <= n` cắt bỏ trạng thái sai ngay từ đầu.

## 6. Java solution overview
`StringBuilder` giữ prefix hiện tại; sau mỗi nhánh ta xóa ký tự vừa thêm để quay lui.

## 7. Code explanation
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(n, 0, 0, new StringBuilder(), result);
        return result;
    }

    private void backtrack(int n, int open, int close, StringBuilder current, List<String> result) {
        if (current.length() == 2 * n) {
            result.add(current.toString());
            return;
        }
        if (open < n) {
            current.append('(');
            backtrack(n, open + 1, close, current, result);
            current.deleteCharAt(current.length() - 1);
        }
        if (close < open) {
            current.append(')');
            backtrack(n, open, close + 1, current, result);
            current.deleteCharAt(current.length() - 1);
        }
    }
}
```

## 8. Dry run
Với `n = 2`, bắt đầu bằng `(`. Từ prefix `((` chỉ có thể đóng dần để được `(())`; từ prefix `()` có thể mở tiếp để được `()()`.

## 9. Time and space complexity
Số đáp án là Catalan `C_n`; việc tạo mỗi chuỗi tốn `O(n)`, nên thời gian `O(C_n * n)`. Recursion depth là `O(n)` ngoài output.

## 10. Why the algorithm is correct
Invariant `close <= open` đảm bảo mọi prefix hợp lệ. Hai điều kiện thêm ký tự liệt kê mọi lựa chọn hợp lệ, nên không bỏ sót đáp án; không nhánh nào sinh chuỗi sai.

## 11. Edge cases
`n = 1` chỉ có `()`.

## 12. Common mistakes
- Cho phép `close > open`.
- Quên undo `StringBuilder` sau recursive call.
- Dừng khi số dấu mở đủ nhưng chuỗi chưa đủ `2n`.

## 13. Pattern recognition
Dùng mẫu này khi cần sinh cấu hình hợp lệ dưới một invariant prefix mạnh.

## 14. Vocabulary
`well-formed parentheses`, `backtracking`, `prefix invariant`, `pruning`, `recursion`.
