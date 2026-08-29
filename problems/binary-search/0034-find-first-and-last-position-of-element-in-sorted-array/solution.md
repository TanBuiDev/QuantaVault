# Solution / Lời giải — 34. Find First and Last Position of Element in Sorted Array

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Sorted array có thể chứa một block target liên tiếp. Thay vì tìm target rồi scan trái/phải, ta có thể binary-search riêng boundary đầu tiên và boundary đầu tiên lớn hơn target.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Binary search một occurrence rồi linear expand có worst-case O(n) nếu tất cả values bằng target. Observation boundary condition monotonic: nums[i] >= target chuyển false→true tại first position; nums[i] > target chuyển ở after-last.

**State / invariant / data structure cần hiểu trước code.** Lower-bound search giữ answer boundary nhỏ nhất thỏa predicate trong [left,right]. Invariant các indices bị loại trái/phải đã biết chắc predicate state; second bound minus1 cho last occurrence.

**Dry run mental theo implementation.** Dry run [5,7,7,8,8,10], target8: lower bound tìm index3; upper bound first>8 tìm index5; result [3,4]. Nếu lower index ngoài array hoặc value khác target, trả [-1,-1].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ tìm arbitrary occurrence hoặc infinite loop với left=mid. Khi nào dùng: first/last position trên sorted data thường là lower_bound/upper_bound predicates, không cần post-scan.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Find the first index `>= target` and the first index `> target`. If target exists, these boundaries are exactly `first` and `afterLast - 1`.

## 2. Optimal Java solution

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = lowerBound(nums, target);

        // lowerBound may legally return nums.length; verify existence before indexing.
        if (first == nums.length || nums[first] != target) {
            return new int[]{-1, -1};
        }

        int afterLast = upperBound(nums, target);
        return new int[]{first, afterLast - 1};
    }

    private int lowerBound(int[] nums, int target) {
        int left = 0, right = nums.length;

        // Invariant on half-open [left,right): answer is still somewhere in this
        // interval. We seek the FIRST index whose value is >= target.
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }

    private int upperBound(int[] nums, int target) {
        int left = 0, right = nums.length;

        // Same half-open search, but now seek the FIRST value > target. Therefore
        // values equal to target belong to the discarded left side as well.
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] <= target) left = mid + 1;
            else right = mid;
        }
        return left;
    }
}
```

## 3. Correctness

`lowerBound` returns the first position where target could start; `upperBound` returns the first position after all target occurrences. Their half-open invariants preserve the respective boundary until convergence.

## 4. Complexity

Two binary searches: `O(log n)` time, `O(1)` space.
