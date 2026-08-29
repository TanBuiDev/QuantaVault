# Solution / Lời giải — 300. Longest Increasing Subsequence

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** LIS không cần giữ actual subsequence để biết length. Ta có thể giữ tails[len-1] = giá trị kết thúc nhỏ nhất có thể của một increasing subsequence length len; tail nhỏ hơn dễ extend hơn về sau.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DP O(n²) thử mọi predecessor. Observation tails luôn sorted, nên với mỗi x binary-search first tails[pos]>=x rồi replace; nếu x lớn hơn mọi tails thì append và tăng LIS length, đạt O(n log n).

**State / invariant / data structure cần hiểu trước code.** tails không nhất thiết là một subsequence thật hoàn chỉnh, mà là best ending value cho mỗi length. Invariant tails strictly increasing và sau prefix nó lưu minimum possible tail cho mọi achievable length.

**Dry run mental theo implementation.** Dry run [10,9,2,5,3,7,101,18]: tails [10]->[9]->[2]->[2,5]->[2,3]->[2,3,7]->[2,3,7,101]->[2,3,7,18], length4.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là coi tails content chính là LIS cần output hoặc dùng upper bound > thay lower bound >= cho strictly increasing. Khi nào dùng: LIS length thường patience-sorting tails + binary search.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

`tails[len-1]` stores the smallest possible ending value of any increasing subsequence of length `len`. Binary-search where each number can improve that frontier.

## 2. Optimal Java solution

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        // tails[len-1] = smallest possible tail value among increasing subsequences
        // of length len seen so far. Smaller tails leave more room for future extension.
        int[] tails = new int[nums.length];
        int size = 0;

        for (int x : nums) {
            int left = 0;
            int right = size;

            // Find first tail >= x. Replacing it with x preserves that subsequence
            // length while making its tail no larger; strict LIS uses lower_bound >=.
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails[mid] < x) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }

            tails[left] = x;
            if (left == size) {
                // x exceeds every existing tail, so it extends the longest known LIS.
                size++;
            }
        }

        // tails is not necessarily an actual subsequence; only its valid length matters.
        return size;
    }
}
```

## 3. Correctness

For every achievable length, keeping the minimum tail is never worse for future extension. Lower-bound replacement maintains those minimum tails, while insertion at `size` proves a longer increasing subsequence exists. Thus `size` equals LIS length.

## 4. Complexity

`O(n log n)` time, `O(n)` space.
