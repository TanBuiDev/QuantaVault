class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;

        // Xoay thêm nguyên n bước không đổi mảng, nên modulo loại các vòng dư
        // và biến k thành đúng kích thước block cuối cần đưa lên đầu.
        k %= n;

        // Nếu mảng là A B với |B| = k, reverse toàn bộ tạo rev(B) rev(A).
        // Hai reverse cục bộ khôi phục thứ tự trong từng block, thu được B A.
        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private void reverse(int[] nums, int left, int right) {
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }
}
