class Solution {
    public boolean canJump(int[] nums) {
        // Vị trí chỉ số xa nhất có thể tiếp cận được tính từ tất cả các điểm xuất phát hợp lệ đã duyệt.
        int farthest = 0;

        for (int i = 0; i < nums.length; i++) {
            // Nếu chỉ số hiện tại i vượt quá tầm với xa nhất, nghĩa là ta không thể bước tới điểm này (bị kẹt).
            if (i > farthest) {
                return false;
            }

            // Greedy choice: Mở rộng tầm vươn xa nhất có thể đạt được từ vị trí i.
            farthest = Math.max(farthest, i + nums[i]);

            // Tối ưu sớm (Early exit): Nếu tầm với đã chạm hoặc vượt qua điểm cuối cùng, chắc chắn thành công.
            if (farthest >= nums.length - 1) {
                return true;
            }
        }

        return true;
    }
}
