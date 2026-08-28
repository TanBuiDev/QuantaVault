# Solution / Lời giải — 918. Maximum Sum Circular Subarray

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
