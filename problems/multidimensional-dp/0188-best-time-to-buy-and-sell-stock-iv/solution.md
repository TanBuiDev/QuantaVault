# Solution / Lời giải — 188. Best Time to Buy and Sell Stock IV

## 1. Core idea

For each transaction count `t`, track the best balance while holding (`buy[t]`) and after selling (`sell[t]`). Process every price and decide whether to keep each state or perform its next action.

## 2. Optimal Java solution

```java
import java.util.Arrays;

class Solution {
    public int maxProfit(int k, int[] prices) {
        // buy[t] = best cash while holding stock after starting transaction t;
        // sell[t] = best cash flat after completing at most t transactions.
        int[] buy = new int[k + 1];
        int[] sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE / 4);

        for (int price : prices) {
            for (int t = 1; t <= k; t++) {
                // To enter buy[t], either keep holding or spend today's price after
                // the best state with at most t-1 completed transactions.
                buy[t] = Math.max(buy[t], sell[t - 1] - price);

                // To enter sell[t], either stay flat or sell the stock held by buy[t].
                // Updating in this order may allow same-day buy/sell, which adds zero
                // and cannot improve beyond a valid sequence with fewer effective trades.
                sell[t] = Math.max(sell[t], buy[t] + price);
            }
        }

        return sell[k];
    }
}
```

## 3. Correctness

For each day and transaction count, the arrays preserve the best legal holding/flat balance obtainable from the processed prefix. Each transition is either no action, a buy after one fewer completed transaction, or a sell from the corresponding holding state; therefore `sell[k]` is optimal after all days.

## 4. Complexity

`O(n*k)` time, `O(k)` space.
