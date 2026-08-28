# Solution / Lời giải — 198. House Robber

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
