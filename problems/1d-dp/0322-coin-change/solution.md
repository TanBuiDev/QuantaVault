# Solution / Lời giải — 322. Coin Change

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Coin Change: dp[a] là ít coins nhất để tạo amount a. Nếu coin c là đồng cuối cùng của một solution cho a, phần trước phải là optimal solution cho a-c; vậy candidate dp[a-c]+1.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Backtracking combinations exponential và lặp same remaining amounts. DP bottom-up tính mỗi amount một lần; initialize unreachable bằng sentinel lớn, dp[0]=0 là base không cần coin.

**State / invariant / data structure cần hiểu trước code.** dp[a] sau khi xét transitions là min số coins cho exact amount a hoặc INF nếu impossible. Invariant mọi candidate chỉ dùng state smaller amount đã biết; min qua all coins bao phủ mọi lựa chọn đồng cuối.

**Dry run mental theo implementation.** Coins [1,2,5], amount11: dp values dần tạo dp5=1, dp10=2, dp11=min(dp10+1=3,dp9+1,...)=3 cho 5+5+1.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là greedy chọn coin lớn nhất, sai với hệ coin tùy ý như [1,3,4], amount6. Khi nào dùng: unbounded minimum pieces để đạt exact sum thường là 1D DP over amounts.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Let `dp[a]` be the minimum number of coins to make amount `a`. Try each coin as the final coin: `dp[a] = min(dp[a], dp[a-coin] + 1)`.

## 2. Optimal Java solution

```java
import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];

        // amount+1 is a safe "unreachable" sentinel: using positive integer coins,
        // any reachable amount needs at most amount coins (all denomination 1 in worst case).
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        // dp[current] = minimum number of coins needed to make exactly current.
        for (int current = 1; current <= amount; current++) {
            for (int coin : coins) {
                if (coin <= current) {
                    // If the final coin is 'coin', the preceding amount must be
                    // current-coin; adding one coin gives this complete candidate.
                    dp[current] = Math.min(dp[current], dp[current - coin] + 1);
                }
            }
        }

        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```

## 3. Correctness

Every solution for amount `a` has some final coin `c`, leaving an optimal solution for `a-c`; conversely every reachable `a-c` plus coin `c` forms a valid solution. Taking the minimum over all possible final coins therefore gives the optimum.

## 4. Complexity

`O(amount * numberOfCoins)` time, `O(amount)` space.
