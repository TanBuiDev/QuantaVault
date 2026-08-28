class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;

            // With distinct values, at least one half around mid is normally sorted.
            // If left <= mid, the rotation pivot cannot lie inside [left, mid].
            if (nums[left] <= nums[mid]) {
                // Target inside the sorted left interval => discard right half;
                // otherwise it must be on the other side if it exists at all.
                if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                // Here [mid, right] is the sorted half, so interval membership gives
                // the symmetric safe elimination rule.
                if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
}
