# Solution / Lời giải — 123. Best Time to Buy and Sell Stock III

## 1. Core idea

Compress the transaction DP into four states: best balance after first buy, first sell, second buy, and second sell. Each price either leaves a state unchanged or performs its next action.

## 2. Optimal Java solution

```java
class Solution {
    public int maxProfit(int[] prices) {
        // Each state is the best cash balance after a particular action count:
        // buy1 = holding after first buy, sell1 = flat after first sell, etc.
        int buy1 = Integer.MIN_VALUE / 4;
        int sell1 = 0;
        int buy2 = Integer.MIN_VALUE / 4;
        int sell2 = 0;

        for (int price : prices) {
            // Keep the best previous state or perform the corresponding action today.
            // Same-day transitions are harmless: buy then sell at one price adds zero
            // profit and simply represents using fewer than two effective transactions.
            buy1 = Math.max(buy1, -price);
            sell1 = Math.max(sell1, buy1 + price);
            buy2 = Math.max(buy2, sell1 - price);
            sell2 = Math.max(sell2, buy2 + price);
        }

        // sell2 represents the best profit after at most two completed transactions.
        return sell2;
    }
}
```

## 3. Correctness

Each state records the best possible cash after its action prefix. For every price the recurrence considers both not acting and performing the next legal action; induction over days therefore preserves the optimum for all four states, and `sell2` is the best result with at most two transactions.

## 4. Complexity

`O(n)` time, `O(1)` space.
