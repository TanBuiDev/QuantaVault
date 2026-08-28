class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0, right = nums.length;

        // Search the half-open range [left,right) for the first index whose value
        // is >= target. That index is both target's position and its sorted insert slot.
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }
}
