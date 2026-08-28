class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0;
        int sum = 0;
        int best = Integer.MAX_VALUE;

        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];

            // Vì mọi nums[i] > 0, bỏ phần tử trái luôn làm sum giảm. Do đó khi
            // window đã valid, shrink liên tục sẽ tìm shortest valid start cho right này.
            while (sum >= target) {
                best = Math.min(best, right - left + 1);
                sum -= nums[left];
                left++;
            }
        }

        // Sentinel phân biệt "chưa từng có valid window" với một độ dài thật.
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
