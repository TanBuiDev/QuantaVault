class Solution {
    public int maxSubarraySumCircular(int[] nums) {
        int total = 0;
        int currentMax = 0, maxSum = Integer.MIN_VALUE;
        int currentMin = 0, minSum = Integer.MAX_VALUE;
        for (int x : nums) {
            currentMax = Math.max(x, currentMax + x);
            maxSum = Math.max(maxSum, currentMax);
            currentMin = Math.min(x, currentMin + x);
            minSum = Math.min(minSum, currentMin);
            total += x;
        }
        if (maxSum < 0) return maxSum;
        return Math.max(maxSum, total - minSum);
    }
}
