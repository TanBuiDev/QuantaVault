# Solution / Lời giải — 35. Search Insert Position

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Search Insert Position hỏi index target nếu có, hoặc vị trí nhỏ nhất mà chèn target vẫn sorted. Đây chính là first index có value >= target, kể cả boundary n nếu mọi value nhỏ hơn target.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Linear scan O(n) đúng nhưng sorted order cho monotonic predicate nums[i]>=target. Binary search boundary này trong O(log n) và không cần special case target absent.

**State / invariant / data structure cần hiểu trước code.** Search half-open [left,right) hoặc inclusive tùy code; invariant answer luôn nằm trong interval. Khi nums[mid]<target, mid và mọi bên trái không thể là insertion point; ngược lại giữ/move về trái.

**Dry run mental theo implementation.** Dry run [1,3,5,6], target2: mid5 quá lớn dịch trái; compare1 nhỏ nên boundary tới index1, nơi value3 là first >=2. Target7 cuối cùng boundary n=4.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là return -1 khi không found dù bài cần insertion boundary. Khi nào dùng: sorted 'find or insert' là lower bound, một binary-search boundary problem.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
