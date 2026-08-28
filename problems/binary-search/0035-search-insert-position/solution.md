# Solution / Lời giải — 35. Search Insert Position

## 1. Core idea

The answer is the lower bound: the first index whose value is at least `target`. This is the target index when present and the correct insertion position otherwise.

## 2. Optimal Java solution

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0, right = nums.length;

        // Search the half-open range [left,right) for the first index whose value
        // is >= target. That index is both target's position and its sorted insert slot.
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }
}
```

## 3. Correctness

All indices discarded to the left have values `< target`; all indices retained on the right may still be `>= target`. Convergence therefore occurs at the first legal insertion position.

## 4. Complexity

`O(log n)` time, `O(1)` space.
