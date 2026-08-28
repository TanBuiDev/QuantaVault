class Solution {
    public int trap(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int leftMax = 0;
        int rightMax = 0;
        int water = 0;

        while (left < right) {
            // Xử lý phía có boundary hiện tại thấp hơn: phía đối diện đã có một cột
            // ít nhất cao bằng nó, nên running max của phía này đủ để chốt lượng nước tại đây.
            if (height[left] <= height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    // leftMax là bottleneck đã được xác nhận cho vị trí left;
                    // phần chưa quét bên phải không thể làm lượng nước tại left giảm xuống.
                    water += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    // Đối xứng với phía trái: rightMax quyết định mức nước cuối cùng tại right.
                    water += rightMax - height[right];
                }
                right--;
            }
        }

        return water;
    }
}
