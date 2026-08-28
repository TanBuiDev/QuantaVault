# 228. Summary Ranges — Solution

## 1. Core idea / Ý tưởng cốt lõi

Vì `nums` sorted và unique, ta chỉ cần nén từng run consecutive thành một range. Giữ `start` và `end`; số mới nối được vào run iff nó bằng `end + 1`.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> summaryRanges(int[] nums) {
        List<String> answer = new ArrayList<>();
        if (nums.length == 0) {
            return answer;
        }

        int start = nums[0];
        int end = nums[0];

        for (int i = 1; i < nums.length; i++) {
            // Cast trước phép +1 để tránh int overflow khi end == Integer.MAX_VALUE;
            // comparison cần phản ánh tính consecutive thật chứ không phải wrap-around.
            if ((long) nums[i] == (long) end + 1L) {
                end = nums[i];
            } else {
                // Có gap nghĩa là run [start,end] đã maximal vì input sorted/unique;
                // không phần tử tương lai nào có thể nối lại qua số đang bị thiếu.
                answer.add(format(start, end));
                start = nums[i];
                end = nums[i];
            }
        }

        // Run cuối không gặp gap phía sau để tự được flush trong loop.
        answer.add(format(start, end));
        return answer;
    }

    private String format(int start, int end) {
        return start == end ? String.valueOf(start) : start + "->" + end;
    }
}
```

## 3. Why the long cast matters

Nếu `end == Integer.MAX_VALUE`, biểu thức `end + 1` bằng `int` sẽ overflow. Cast sang `long` trước phép cộng giữ so sánh đúng ở biên 32-bit.

## 4. Correctness / Vì sao đúng

Invariant: `[start,end]` là maximal consecutive run của prefix chưa được output. Số kế tiếp bằng `end+1` thì mở rộng run; nếu có gap thì current run đã maximal và được flush. Sau loop flush run cuối. Mọi element thuộc đúng một maximal run.

## 5. Complexity

```text
Time: O(n)
Extra space: O(1) excluding output
```

## 6. Edge cases / Common mistakes

- Empty input.
- Single element range.
- Negative numbers.
- Integer boundaries.
- Quên flush range cuối.
