# Solution / Lời giải — 70. Climbing Stairs

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Để đứng ở step n, bước cuối chỉ có thể từ n-1 bằng một bước hoặc n-2 bằng hai bước. Hai nhóm đường không overlap, nên ways(n)=ways(n-1)+ways(n-2).

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Recursion thuần tính cùng ways(k) nhiều lần và exponential. Memo/DP sửa được; vì recurrence chỉ cần hai state trước, rolling variables cho O(1) space giống Fibonacci.

**State / invariant / data structure cần hiểu trước code.** prev2=ways(i-2), prev1=ways(i-1) trước khi tính i. Invariant sau update hai biến dịch một bước và giữ đúng hai giá trị gần nhất; base ways(1)=1, ways(2)=2 theo convention.

**Dry run mental theo implementation.** n=5: ways1=1, ways2=2; ways3=3, ways4=5, ways5=8. Mỗi value phân chia paths theo final jump 1 hoặc2 nên không double-count.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là off-by-one bases. Khi nào dùng: đếm cách tới position với step sizes cố định thường recurrence bằng tổng ways của predecessor positions.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

A path to step `i` must end with either a one-step move from `i-1` or a two-step move from `i-2`, so `ways[i] = ways[i-1] + ways[i-2]`.

## 2. Optimal Java solution

```java
class Solution {
    public int climbStairs(int n) {
        if (n <= 2) {
            return n;
        }

        // ways(step) depends only on the previous two states, so the full DP array
        // can be compressed into two rolling values.
        int twoStepsBack = 1;
        int oneStepBack = 2;

        for (int step = 3; step <= n; step++) {
            // Every way to reach this step ends uniquely with either a 1-step move
            // from step-1 or a 2-step move from step-2.
            int current = oneStepBack + twoStepsBack;
            twoStepsBack = oneStepBack;
            oneStepBack = current;
        }

        return oneStepBack;
    }
}
```

## 3. Correctness

The two possible final moves partition all valid stair sequences into disjoint sets coming from steps `i-1` and `i-2`. The recurrence therefore counts every sequence exactly once.

## 4. Complexity

`O(n)` time, `O(1)` space.
