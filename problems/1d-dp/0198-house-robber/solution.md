# Solution / Lời giải — 198. House Robber

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** House Robber tại nhà i có hai lựa chọn mutually exclusive: bỏ nhà i và giữ best tới i-1, hoặc cướp i nên chỉ cộng được best tới i-2. Chọn max hai lựa chọn.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Recursion choose/skip exponential. DP recurrence best[i]=max(best[i-1],best[i-2]+nums[i]); vì chỉ cần hai values trước, rolling O(1) space.

**State / invariant / data structure cần hiểu trước code.** prev1 là best profit tới house i-1, prev2 tới i-2. Invariant trước mỗi house hai biến là optimal prefixes đã giải; current=max(prev1,prev2+money) bao phủ mọi optimal solution kết thúc decision tại i.

**Dry run mental theo implementation.** Dry run [2,7,9,3,1]: states best 2,7,11,11,12; tại house9 chọn prev2(2)+9=11, tại3 skip giữ11, tại1 chọn11+1=12.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là greedy chọn house value lớn cục bộ. Khi nào dùng: chọn items trên line với no-adjacent constraint thường là take current + dp[i-2] vs skip dp[i-1].
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

For each house choose between skipping it (`best up to previous`) or robbing it (`best up to two houses back + current money`).

## 2. Optimal Java solution

```java
class Solution {
    public int rob(int[] nums) {
        // prevOne = optimum for houses processed so far; prevTwo = optimum before
        // the immediately previous house. Only these two states are needed.
        int prevTwo = 0;
        int prevOne = 0;

        for (int money : nums) {
            // For current house, either skip it and keep prevOne, or rob it and
            // combine its money with prevTwo because adjacent houses cannot both be robbed.
            int current = Math.max(prevOne, prevTwo + money);
            prevTwo = prevOne;
            prevOne = current;
        }

        return prevOne;
    }
}
```

## 3. Correctness

Every optimal solution either excludes the current house or includes it. Those cases have values `prevOne` and `prevTwo + money` respectively, so their maximum is exactly the new optimum.

## 4. Complexity

`O(n)` time, `O(1)` space.
