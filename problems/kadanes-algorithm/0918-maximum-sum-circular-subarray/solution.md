# Solution / Lời giải — 918. Maximum Sum Circular Subarray

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Maximum circular subarray hoặc không wrap, khi đó Kadane max bình thường; hoặc wrap qua cuối->đầu, tương đương lấy tổng toàn array trừ một subarray contiguous ở giữa bị loại có sum nhỏ nhất.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Duplicate array rồi enumerate windows có thể O(n²). Observation wrapBest=total-minSubarray; chạy Kadane song song cho max và min trong O(n). Exception: nếu mọi số âm, total-minSum=0 tương ứng chọn empty wrap không hợp lệ.

**State / invariant / data structure cần hiểu trước code.** currentMax/bestMax là Kadane maximum ending/global; currentMin/bestMin tương tự minimum; total cộng toàn array. Invariant hai Kadanes bao phủ mọi non-wrap segment và mọi middle segment có thể bị loại khỏi wrap.

**Dry run mental theo implementation.** Dry run [5,-3,5]: bestMax=7? nonwrap max is7 via 5-3+5, total7, minSum=-3, wrap=10 nên answer10 từ [5] cuối + [5] đầu. Với [-3,-2,-3], return bestMax=-2 thay0.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là luôn dùng total-minSum và trả0 cho all-negative. Khi nào dùng: circular contiguous optimum thường tách non-wrap và wrap=complement of opposite-sign optimum.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

The optimum is either an ordinary non-wrapping maximum subarray or a wrapping suffix+prefix. A wrapping choice equals `totalSum - minimumMiddleSubarray`.

## 2. Optimal Java solution

```java
class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int total = 0;
        int currentMax = 0, maxSum = Integer.MIN_VALUE;
        int currentMin = 0, minSum = Integer.MAX_VALUE;

        for (int x : nums) {
            // Ordinary Kadane gives the best non-wrapping subarray.
            currentMax = Math.max(x, currentMax + x);
            maxSum = Math.max(maxSum, currentMax);

            // A wrapping maximum keeps a suffix + prefix, equivalently removing
            // one contiguous middle segment; therefore we also need the minimum subarray.
            currentMin = Math.min(x, currentMin + x);
            minSum = Math.min(minSum, currentMin);
            total += x;
        }

        // If every value is negative, minSum == total and total-minSum would choose
        // an empty wrapped subarray, which is forbidden. The ordinary max is correct.
        if (maxSum < 0) return maxSum;

        // Every optimum is either non-wrapping (maxSum) or wrapping, whose value is
        // total minus the minimum contiguous segment excluded from the middle.
        return Math.max(maxSum, total - minSum);
    }
}
```

## 3. Correctness

A circular subarray either stays within the linear array or crosses the boundary. Any crossing subarray is exactly the complement of one contiguous excluded segment, so maximizing it means subtracting the minimum subarray. The all-negative guard prevents selecting an empty complement.

## 4. Complexity

`O(n)` time, `O(1)` extra space.
