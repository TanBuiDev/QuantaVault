class Solution {
    public int findPeakElement(int[] nums) {
        int left = 0, right = nums.length - 1;

        // Invariant: [left,right] contains at least one peak. Comparing adjacent
        // values reveals a slope direction without needing the peak value itself.
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] < nums[mid + 1]) {
                // We are climbing to the right. With conceptual -infinity outside
                // the array, some peak must exist in [mid+1,right].
                left = mid + 1;
            } else {
                // We are descending at mid->mid+1, so a peak exists in [left,mid];
                // mid itself might already be that peak and must be retained.
                right = mid;
            }
        }
        return left;
    }
}
