# Solution / Lời giải — 53. Maximum Subarray

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Nếu maximum subarray bắt buộc kết thúc tại index i, chỉ có hai lựa chọn: nối nums[i] vào best subarray kết thúc ở i-1, hoặc bỏ quá khứ và bắt đầu mới tại nums[i].

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Thử mọi subarray O(n²). Observation local choice trên tạo recurrence current=max(nums[i], current+nums[i]); global best lấy max của mọi current, chính là Kadane O(n).

**State / invariant / data structure cần hiểu trước code.** current là maximum sum của subarray kết thúc đúng tại vị trí hiện tại; best là maximum trên mọi ending positions đã xử lý. Invariant current không phải arbitrary prefix sum mà có bắt buộc endpoint i.

**Dry run mental theo implementation.** Dry run [-2,1,-3,4,-1,2,1,-5,4]: tại4, current chọn bắt đầu mới4; sau -1,2,1 current tiến 4,3,5,6 và best=6 cho [4,-1,2,1].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là reset current về0 và trả0 cho array toàn âm nếu không xử lý cẩn thận. Khi nào dùng: best contiguous segment với additive score thường hỏi 'best segment ending here' để sinh Kadane recurrence.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Kadane keeps the best sum of a subarray that must end at the current index. Either extend the previous best-ending subarray or start a new one here.

## 2. Optimal Java solution

```java
class Solution {
    public int maxSubArray(int[] nums) {
        // Starting from nums[0] (not 0) is essential when every number is negative:
        // the answer must still contain at least one element.
        int current = nums[0];
        int best = nums[0];

        for (int i = 1; i < nums.length; i++) {
            // current = best subarray sum that MUST end at i. Such a subarray either
            // starts fresh at nums[i] or extends the best ending at i-1.
            current = Math.max(nums[i], current + nums[i]);

            // Every non-empty subarray has some ending index, so taking the maximum
            // over all best-ending-here states gives the global optimum.
            best = Math.max(best, current);
        }
        return best;
    }
}
```

## 3. Correctness

The recurrence considers the only two possible forms of an optimal subarray ending at each index. `best` takes the maximum of these endpoint optima, covering every non-empty subarray.

## 4. Complexity

`O(n)` time, `O(1)` extra space.
