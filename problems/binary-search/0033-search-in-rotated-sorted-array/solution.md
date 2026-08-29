# Solution / Lời giải — 33. Search in Rotated Sorted Array

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Rotated sorted array như [4,5,6,7,0,1,2] vẫn có tính chất: tại bất kỳ mid, ít nhất một nửa [left..mid] hoặc [mid..right] còn sorted hoàn toàn. Ta dùng nửa sorted để biết target có nằm trong range giá trị đó không.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Linear scan O(n) bỏ phí gần-sorted structure. Binary search vẫn dùng được nhưng decision không dựa đơn thuần nums[mid] với target; phải xác định nửa nào sorted trước.

**State / invariant / data structure cần hiểu trước code.** Search interval [left,right] luôn chứa target nếu target tồn tại. Nếu left half sorted và target nằm trong [nums[left],nums[mid]), giữ left half; không thì bỏ nó. Symmetric cho right half.

**Dry run mental theo implementation.** Dry run target0: mid index3 value7, left half 4..7 sorted nhưng target0 không thuộc range nên left=4; mid5 value1, left half 0..1 sorted và target0 thuộc nên right=4; tìm0.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là boundary inequalities làm mất target ở endpoints. Khi nào dùng: binary search trên rotated monotonic data thường nhận diện phần sorted chắc chắn rồi dùng range membership để loại nửa.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

At every midpoint, one side is still normally sorted. Determine that side, then use ordinary interval membership to decide whether the target can be there or must lie in the other half.

## 2. Optimal Java solution

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;

            // With distinct values, at least one half around mid is normally sorted.
            // If left <= mid, the rotation pivot cannot lie inside [left, mid].
            if (nums[left] <= nums[mid]) {
                // Target inside the sorted left interval => discard right half;
                // otherwise it must be on the other side if it exists at all.
                if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                // Here [mid, right] is the sorted half, so interval membership gives
                // the symmetric safe elimination rule.
                if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
}
```

## 3. Correctness

Distinct values guarantee a sorted half at each step. On that half, ordinary sorted interval bounds tell exactly whether the target can occur there, so the algorithm discards only a half that cannot contain the target.

## 4. Complexity

`O(log n)` time, `O(1)` space.
