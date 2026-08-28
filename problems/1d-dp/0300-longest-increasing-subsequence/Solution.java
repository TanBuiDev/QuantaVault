class Solution {
    public int lengthOfLIS(int[] nums) {
        // tails[len-1] = smallest possible tail value among increasing subsequences
        // of length len seen so far. Smaller tails leave more room for future extension.
        int[] tails = new int[nums.length];
        int size = 0;

        for (int x : nums) {
            int left = 0;
            int right = size;

            // Find first tail >= x. Replacing it with x preserves that subsequence
            // length while making its tail no larger; strict LIS uses lower_bound >=.
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails[mid] < x) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }

            tails[left] = x;
            if (left == size) {
                // x exceeds every existing tail, so it extends the longest known LIS.
                size++;
            }
        }

        // tails is not necessarily an actual subsequence; only its valid length matters.
        return size;
    }
}
