class Solution {
    public int findMin(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        // Invariant: the minimum is always inside [left,right]. We compare mid to
        // right because right belongs to the same current search interval.
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                // mid lies in the high pre-rotation segment; the pivot/minimum must
                // be strictly to its right, so mid itself can be discarded.
                left = mid + 1;
            } else {
                // mid is in the low segment (or the interval is already sorted),
                // so the minimum may be mid or to its left; keep mid in the range.
                right = mid;
            }
        }
        return nums[left];
    }
}
