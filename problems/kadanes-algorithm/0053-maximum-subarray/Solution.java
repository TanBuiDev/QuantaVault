class Solution {
    public int maxSubArray(int[] nums) {
        // Starting from nums[0] (not 0) is essential when every number is negative:
        // the answer must still contain at least one element.
        int current = nums[0];
        int best = nums[0];

        for (int i = 1; i < nums.length; i++) {
            // current = best subarray sum that MUST end at i. Such a subarray either
            // starts fresh at nums[i] or extends the best ending at i-1.
            current = Math.max(nums[i], current + nums[i]);

            // Every non-empty subarray has some ending index, so taking the maximum
            // over all best-ending-here states gives the global optimum.
            best = Math.max(best, current);
        }
        return best;
    }
}
