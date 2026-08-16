class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }
        int m = nums1.length, n = nums2.length;
        int left = 0, right = m;
        int half = (m + n + 1) / 2;

        while (left <= right) {
            int i = left + (right - left) / 2;
            int j = half - i;
            int leftA = i == 0 ? Integer.MIN_VALUE : nums1[i - 1];
            int rightA = i == m ? Integer.MAX_VALUE : nums1[i];
            int leftB = j == 0 ? Integer.MIN_VALUE : nums2[j - 1];
            int rightB = j == n ? Integer.MAX_VALUE : nums2[j];

            if (leftA <= rightB && leftB <= rightA) {
                int maxLeft = Math.max(leftA, leftB);
                if (((m + n) & 1) == 1) return maxLeft;
                int minRight = Math.min(rightA, rightB);
                return ((long) maxLeft + minRight) / 2.0;
            }
            if (leftA > rightB) right = i - 1;
            else left = i + 1;
        }
        throw new IllegalArgumentException("Inputs must be sorted");
    }
}
