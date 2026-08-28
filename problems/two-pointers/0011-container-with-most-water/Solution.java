class Solution {
    public int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int best = 0;

        while (left < right) {
            int width = right - left;
            int containerHeight = Math.min(height[left], height[right]);
            best = Math.max(best, width * containerHeight);

            // Width chắc chắn giảm ở bước kế tiếp. Nếu giữ cạnh thấp hơn thì
            // bottleneck không thể tăng, nên mọi cặp còn lại dùng cạnh đó đều bị dominated.
            // Chỉ bỏ cạnh thấp hơn mới còn cơ hội tìm một bottleneck cao hơn.
            if (height[left] <= height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return best;
    }
}
