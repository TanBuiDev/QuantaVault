# 153. Find Minimum in Rotated Sorted Array — Hints / Gợi ý

## Hint 1
**EN:** Compare the middle element with the rightmost element.

**VI:** So sánh phần tử giữa với phần tử bên phải.

## Hint 2
**EN:** If `nums[mid] > nums[right]`, the minimum must be strictly to the right of `mid`; otherwise it is at `mid` or to its left.

**VI:** Nếu `nums[mid] > nums[right]`, minimum nằm bên phải `mid`; ngược lại minimum nằm tại `mid` hoặc bên trái.

## Hint 3
Use `while (left < right)` so the final converged index is the minimum.
