# 39. Combination Sum — Solution / Lời giải

## 1. Core idea / Intuition
Dùng `backtracking` với một `start index`. Mỗi nhánh giữ tổ hợp hiện tại và phần `remaining` còn thiếu để đạt `target`.

## 2. Requirement recap / Tóm tắt yêu cầu
Cần liệt kê các tổ hợp duy nhất; mỗi giá trị có thể được dùng nhiều lần.

## 3. Key observations / Nhận xét quan trọng
- Nếu `remaining == 0`, đã có một đáp án.
- Nếu một lựa chọn lớn hơn `remaining`, nhánh đó không thể hoàn tất.
- Dùng `start` để không sinh hoán vị của cùng một tổ hợp.

## 4. Alternative approach
Sinh mọi chuỗi lựa chọn rồi chuẩn hóa/sort để deduplicate sẽ vừa tốn bộ nhớ vừa lặp rất nhiều trạng thái.

## 5. Optimal approach
Tại mỗi mức, thử `candidates[i]` với `i >= start`. Sau khi chọn, recurse với `i` chứ không phải `i + 1`, vì được phép dùng lại cùng số.

## 6. Java solution overview
Ta sort `candidates` để có thể `break` sớm khi một giá trị đã lớn hơn `remaining`.

## 7. Code explanation
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        Arrays.sort(candidates);
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int remaining, int start,
                           List<Integer> current, List<List<Integer>> result) {
        if (remaining == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            int value = candidates[i];
            if (value > remaining) {
                break;
            }
            current.add(value);
            backtrack(candidates, remaining - value, i, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```

## 8. Dry run
Với `[2,3,6,7]`, `target = 7`: chọn `2` nhiều lần tạo nhánh `[2,2,3]`; nhánh bắt đầu bằng `7` tạo `[7]`. `start` ngăn `[3,2,2]` xuất hiện như một đáp án khác.

## 9. Time and space complexity
Search tree là exponential theo `target`; recursion depth tối đa khoảng `target / min(candidates)`. Output tự thân cũng có thể lớn.

## 10. Why the algorithm is correct
Mỗi tổ hợp có thể được biểu diễn theo thứ tự không giảm của chỉ số ứng viên. Thuật toán duyệt đúng các chuỗi chỉ số không giảm, cho phép lặp lại cùng chỉ số, nên sinh mọi tổ hợp hợp lệ đúng một lần.

## 11. Edge cases
- Không có ứng viên nào tạo được `target` → danh sách rỗng.
- Một ứng viên bằng đúng `target` → một tổ hợp một phần tử.

## 12. Common mistakes
- Recurse với `i + 1` và vô tình cấm dùng lại số hiện tại.
- Reset `start` về 0 và tạo nhiều hoán vị trùng nhau.
- Quên copy `current` khi thêm vào result.

## 13. Pattern recognition
Dùng mẫu này cho các bài tổ hợp có lựa chọn lặp lại và cần tránh duplicate theo thứ tự.

## 14. Vocabulary
`combination`, `remaining target`, `reuse a candidate`, `backtracking`, `pruning`, `deduplicate`.
