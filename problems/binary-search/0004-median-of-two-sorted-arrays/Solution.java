class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Binary-search the shorter array so partition i always ranges over
        // [0, min(m,n)], giving O(log min(m,n)) and keeping j within valid bounds.
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length, n = nums2.length;
        int left = 0, right = m;

        // The left partition receives one extra element when total length is odd,
        // so its maximum is directly the odd-length median.
        int half = (m + n + 1) / 2;

        while (left <= right) {
            int i = left + (right - left) / 2;
            int j = half - i;

            // Sentinels make partitions at array boundaries obey the same comparisons
            // as interior partitions without separate empty-side cases.
            int leftA = i == 0 ? Integer.MIN_VALUE : nums1[i - 1];
            int rightA = i == m ? Integer.MAX_VALUE : nums1[i];
            int leftB = j == 0 ? Integer.MIN_VALUE : nums2[j - 1];
            int rightB = j == n ? Integer.MAX_VALUE : nums2[j];

            // A partition is correct iff every value on the combined left side is
            // <= every value on the combined right side; these two cross-checks suffice.
            if (leftA <= rightB && leftB <= rightA) {
                int maxLeft = Math.max(leftA, leftB);
                if (((m + n) & 1) == 1) return maxLeft;

                int minRight = Math.min(rightA, rightB);
                // Cast before addition so two large int endpoints cannot overflow.
                return ((long) maxLeft + minRight) / 2.0;
            }

            // leftA too large means i took too many elements from A; otherwise
            // leftB > rightA means i must move right and take more from A.
            if (leftA > rightB) right = i - 1;
            else left = i + 1;
        }

        throw new IllegalArgumentException("Inputs must be sorted");
    }
}
