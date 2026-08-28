class Solution {
    public int removeDuplicates(int[] nums) {
        // Prefix nums[0..write-1] luôn là kết quả hợp lệ: sorted và mỗi giá trị xuất hiện tối đa 2 lần.
        int write = 0;

        for (int num : nums) {
            // Hai phần tử đầu luôn có thể giữ. Sau đó, nếu num == nums[write-2],
            // sorted order bảo đảm prefix đã có hai bản sao của num; giữ thêm sẽ tạo bản sao thứ ba.
            if (write < 2 || num != nums[write - 2]) {
                nums[write++] = num;
            }
        }

        return write;
    }
}
