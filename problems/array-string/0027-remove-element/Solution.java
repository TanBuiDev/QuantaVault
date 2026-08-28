class Solution {
    public int removeElement(int[] nums, int val) {
        // write vừa là vị trí ghi tiếp theo, vừa là số phần tử hợp lệ đã giữ.
        // Prefix nums[0..write-1] luôn chỉ chứa các giá trị khác val.
        int write = 0;

        for (int num : nums) {
            if (num != val) {
                // write không thể vượt số phần tử đã đọc, nên compact tại chỗ
                // không làm mất phần tử nào mà vòng lặp chưa quan sát.
                nums[write++] = num;
            }
        }

        return write;
    }
}
