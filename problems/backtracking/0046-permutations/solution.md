# 46. Permutations — Solution / Lời giải

## 1. Core idea / Intuition
Dùng `backtracking` để điền từng vị trí của hoán vị. Mỗi phần tử được dùng đúng một lần trong một nhánh.

## 2. Requirement recap / Tóm tắt yêu cầu
Với `n` phần tử phân biệt, cần sinh đủ `n!` hoán vị.

## 3. Key observations / Nhận xét quan trọng
- Ở depth `k`, `current` đã chứa `k` phần tử khác nhau.
- Chỉ số chưa được đánh dấu có thể là lựa chọn tiếp theo.
- Khi `current.size() == nums.length`, ta có một hoán vị hoàn chỉnh.

## 4. Alternative approach
Có thể swap phần tử trực tiếp trong mảng theo depth; cách `used[]` dễ đọc hơn cho mục tiêu học tập.

## 5. Optimal approach
Thử mọi chỉ số chưa dùng, đánh dấu, recurse, rồi undo cả list và `used`.

## 6. Java solution overview
`used[i]` đảm bảo mỗi giá trị xuất hiện đúng một lần trong mỗi hoán vị.

## 7. Code explanation
```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> current,
                           List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current.add(nums[i]);
            backtrack(nums, used, current, result);
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }
}
```

## 8. Dry run
Với `[1,2,3]`, nhánh bắt đầu bằng `1` tiếp tục bằng `2` rồi `3`, sau đó undo `3`, thử `3` ở vị trí thứ hai và tạo `[1,3,2]`.

## 9. Time and space complexity
Có `n!` kết quả và cần copy `n` phần tử cho mỗi kết quả, nên thời gian `O(n * n!)`. Recursion và trạng thái hiện tại dùng `O(n)` ngoài output.

## 10. Why the algorithm is correct
Mỗi depth chọn đúng một phần tử chưa dùng. Vì thuật toán thử mọi lựa chọn chưa dùng ở mỗi vị trí, nó sinh mọi hoán vị; `used[]` ngăn lặp một phần tử trong cùng hoán vị.

## 11. Edge cases
Mảng một phần tử tạo đúng một hoán vị.

## 12. Common mistakes
- Quên copy `current` khi thêm vào result.
- Quên reset `used[i]` sau recursion.
- Dùng giá trị thay vì index làm trạng thái khi bài toán có thể có duplicate; ở bài này input là unique.

## 13. Pattern recognition
Mẫu này dùng cho bài yêu cầu sắp thứ tự toàn bộ các phần tử phân biệt.

## 14. Vocabulary
`permutation`, `used array`, `backtracking`, `choice`, `undo`, `recursion depth`.
