# Solution / Lời giải — 70. Climbing Stairs

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
