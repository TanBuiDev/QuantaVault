# Solution / Lời giải — 322. Coin Change

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
