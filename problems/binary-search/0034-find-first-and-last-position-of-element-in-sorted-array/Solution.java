class Solution {
    public int[] searchRange(int[] nums, int target) {
        int first = lowerBound(nums, target);

        // lowerBound may legally return nums.length; verify existence before indexing.
        if (first == nums.length || nums[first] != target) {
            return new int[]{-1, -1};
        }

        int afterLast = upperBound(nums, target);
        return new int[]{first, afterLast - 1};
    }

    private int lowerBound(int[] nums, int target) {
        int left = 0, right = nums.length;

        // Invariant on half-open [left,right): answer is still somewhere in this
        // interval. We seek the FIRST index whose value is >= target.
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }

    private int upperBound(int[] nums, int target) {
        int left = 0, right = nums.length;

        // Same half-open search, but now seek the FIRST value > target. Therefore
        // values equal to target belong to the discarded left side as well.
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] <= target) left = mid + 1;
            else right = mid;
        }
        return left;
    }
}
