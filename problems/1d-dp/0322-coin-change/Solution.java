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
