class Solution {
    public int jump(int[] nums) {
        int jumps = 0;

        // Ranh giới xa nhất có thể đạt được với số bước nhảy (jumps) hiện tại (tương đương BFS level hiện tại).
        int currentEnd = 0;

        // Trong khi duyệt vùng hiện tại, lưu vị trí xa nhất mà bước nhảy tiếp theo có thể vươn tới.
        int farthest = 0;

        // Chỉ duyệt đến nums.length - 2 vì nếu đã chạm đến phần tử cuối thì không cần nhảy thêm.
        for (int i = 0; i < nums.length - 1; i++) {
            // Cập nhật tầm vươn xa nhất từ bất kỳ điểm nào trong vùng hiện tại (Greedy choice).
            farthest = Math.max(farthest, i + nums[i]);

            // Khi i chạm currentEnd: đã xét hết mọi lựa chọn của bước nhảy hiện tại.
            // Bắt buộc phải thực hiện thêm 1 bước nhảy để mở rộng ranh giới sang farthest.
            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
            }
        }

        return jumps;
    }
}
