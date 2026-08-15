class Solution {
    public int climbStairs(int n) {
        if (n <= 2) {
            return n;
        }

        int twoStepsBack = 1;
        int oneStepBack = 2;

        for (int step = 3; step <= n; step++) {
            int current = oneStepBack + twoStepsBack;
            twoStepsBack = oneStepBack;
            oneStepBack = current;
        }

        return oneStepBack;
    }
}
