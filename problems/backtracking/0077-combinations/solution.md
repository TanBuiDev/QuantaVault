# 77. Combinations — Solution / Lời giải

## 1. Core idea / Intuition
Dùng `backtracking` với `start`. Mỗi lần chỉ chọn số từ `start` trở đi nên các phần tử trong một nhánh tăng dần và mỗi tổ hợp chỉ được sinh một lần.

## 2. Requirement recap / Tóm tắt yêu cầu
Liệt kê tất cả cách chọn đúng `k` số khác nhau từ `1..n`, không phân biệt thứ tự.

## 3. Key observations / Nhận xét quan trọng
- Khi `current.size() == k`, ghi nhận một đáp án.
- Sau khi chọn `value`, lần sau bắt đầu ở `value + 1`.
- Có thể giới hạn vòng lặp để đảm bảo vẫn còn đủ số lấp đầy các vị trí còn thiếu.

## 4. Alternative approach
Sinh mọi subset rồi lọc subset có kích thước `k` vẫn đúng nhưng duyệt nhiều trạng thái không cần thiết.

## 5. Optimal approach
Backtrack trực tiếp theo số lượng phần tử cần chọn, kèm pruning `value <= n - need + 1`.

## 6. Java solution overview
Mỗi recursion level thêm một số, recurse với `value + 1`, rồi remove để thử lựa chọn kế tiếp.

## 7. Code explanation
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(1, n, k, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int start, int n, int k, List<Integer> current,
                           List<List<Integer>> result) {
        if (current.size() == k) {
            result.add(new ArrayList<>(current));
            return;
        }
        int need = k - current.size();
        for (int value = start; value <= n - need + 1; value++) {
            current.add(value);
            backtrack(value + 1, n, k, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```

## 8. Dry run
Với `n = 4, k = 2`, nhánh `1` lần lượt ghép với `2,3,4`; sau đó nhánh `2` ghép với `3,4`; cuối cùng `3` ghép với `4`.

## 9. Time and space complexity
Có `C(n,k)` đáp án và cần copy `k` phần tử cho mỗi đáp án, nên thời gian `O(k * C(n,k))`. Recursion depth là `O(k)` ngoài output.

## 10. Why the algorithm is correct
Mọi tổ hợp có đúng một biểu diễn tăng dần. Thuật toán thử mọi chuỗi tăng dần độ dài `k`, vì vậy sinh đầy đủ mọi tổ hợp và không sinh duplicate.

## 11. Edge cases
- `k = 1`: mỗi số tạo một tổ hợp riêng.
- `k = n`: chỉ có `[1,2,...,n]`.

## 12. Common mistakes
- Recurse lại từ 1 và tạo duplicate.
- Dùng `value` thay vì `value + 1`, khiến một số có thể bị chọn lại.
- Prune sai cận khiến bỏ sót đáp án.

## 13. Pattern recognition
Dùng mẫu này khi cần chọn một số lượng cố định phần tử mà thứ tự không quan trọng.

## 14. Vocabulary
`combination`, `choose k`, `start index`, `pruning`, `backtracking`, `unordered`.
