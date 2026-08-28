# Solution / Lời giải — 153. Find Minimum in Rotated Sorted Array

## 1. Core idea

Compare `nums[mid]` with the current right endpoint. If `mid` is larger, it lies before the rotation pivot; otherwise the minimum is at `mid` or to its left.

## 2. Optimal Java solution

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        // Invariant: the minimum is always inside [left,right]. We compare mid to
        // right because right belongs to the same current search interval.
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                // mid lies in the high pre-rotation segment; the pivot/minimum must
                // be strictly to its right, so mid itself can be discarded.
                left = mid + 1;
            } else {
                // mid is in the low segment (or the interval is already sorted),
                // so the minimum may be mid or to its left; keep mid in the range.
                right = mid;
            }
        }
        return nums[left];
    }
}
```

## 3. Correctness

Each comparison identifies whether `mid` is on the high side before the pivot or the low side containing/after the pivot, and shrinks the interval without removing the minimum. One index remains, so it is the minimum.

## 4. Complexity

`O(log n)` time, `O(1)` space.
