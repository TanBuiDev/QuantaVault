class Solution {
    public int removeDuplicates(int[] nums) {
        // Prefix nums[0..write-1] luôn chứa đúng các giá trị unique đã giữ.
        // Vì phần tử đầu chắc chắn unique, vị trí ghi tiếp theo bắt đầu từ 1.
        int write = 1;

        for (int read = 1; read < nums.length; read++) {
            // Mảng đã sort nên chỉ cần so với unique value cuối cùng đã giữ.
            // Nếu khác, nums[read] chưa thể xuất hiện trong prefix kết quả.
            if (nums[read] != nums[write - 1]) {
                // write không vượt quá read, nên ghi đè tại đây không thể phá dữ liệu chưa đọc.
                nums[write++] = nums[read];
            }
        }

        return write;
    }
}
