# Solution / Lời giải — 153. Find Minimum in Rotated Sorted Array

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Trong rotated sorted array không duplicates, minimum là điểm 'gãy'. So nums[mid] với nums[right] cho biết mid nằm ở high sorted portion hay low portion chứa minimum.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Linear min O(n) bỏ phí rotation structure. Nếu nums[mid] > nums[right], minimum chắc ở bên phải mid; nếu nums[mid] < nums[right], mid có thể chính là minimum nên giữ mid và dịch right=mid.

**State / invariant / data structure cần hiểu trước code.** Interval [left,right] luôn chứa minimum. Predicate nums[mid] > nums[right] chứng minh đoạn từ mid thuộc phía trước pivot nên bỏ through mid; ngược lại minimum nằm left..mid.

**Dry run mental theo implementation.** Dry run [4,5,6,7,0,1,2]: mid7>right2 nên left=4; mid1<=right2 nên right=5; mid0<=1 right=4, hội tụ index4 value0.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là right=mid-1 khi mid có thể là minimum. Khi nào dùng: tìm pivot/min rotated sorted array là binary search giữ candidate mid ở nhánh đã sorted tới right.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
