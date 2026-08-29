# Solution / Lời giải — 162. Find Peak Element

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Peak là vị trí lớn hơn neighbors; không cần tìm global maximum. Nhìn slope giữa nums[mid] và nums[mid+1]: nếu đang đi lên, chắc chắn có một peak ở bên phải; nếu đi xuống, có peak ở mid hoặc bên trái.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Linear scan O(n) dễ. Observation discrete slope tạo monotonic elimination dù array không sorted: đi theo hướng uphill và finite boundaries -∞ đảm bảo cuối cùng chạm peak.

**State / invariant / data structure cần hiểu trước code.** Search interval luôn chứa ít nhất một peak. Nếu nums[mid]<nums[mid+1], set left=mid+1; else right=mid. Khi left==right, point duy nhất đó là peak theo invariant.

**Dry run mental theo implementation.** Dry run [1,2,1,3,5,6,4]: tùy mids, slope up dẫn sang phải segment; cuối hội tụ index5 value6, nhưng index1 value2 cũng là peak hợp lệ nếu search path khác.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là cố tìm maximum hoặc compare mid-1 gây boundary complexity. Khi nào dùng: local optimum existence với slope direction có thể binary-search bằng adjacent comparison.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Binary-search the local slope. If `nums[mid] < nums[mid+1]`, moving right is uphill and guarantees a peak on the right; otherwise a peak exists at `mid` or on the left.

## 2. Optimal Java solution

```java
class Solution {
    public int findPeakElement(int[] nums) {
        int left = 0, right = nums.length - 1;

        // Invariant: [left,right] contains at least one peak. Comparing adjacent
        // values reveals a slope direction without needing the peak value itself.
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] < nums[mid + 1]) {
                // We are climbing to the right. With conceptual -infinity outside
                // the array, some peak must exist in [mid+1,right].
                left = mid + 1;
            } else {
                // We are descending at mid->mid+1, so a peak exists in [left,mid];
                // mid itself might already be that peak and must be retained.
                right = mid;
            }
        }
        return left;
    }
}
```

## 3. Correctness

An uphill edge guarantees the right interval eventually reaches a local maximum or the `-∞` boundary; a downhill edge gives the symmetric guarantee on the left including `mid`. Thus every shrink preserves at least one peak until one index remains.

## 4. Complexity

`O(log n)` time, `O(1)` space.
