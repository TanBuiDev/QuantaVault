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
