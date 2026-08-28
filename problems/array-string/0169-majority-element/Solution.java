class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0;
        int count = 0;

        for (int num : nums) {
            // count == 0 nghĩa là các vote của nhóm trước đã bị pair-cancel hết;
            // ta có thể bắt đầu một nhóm mới mà không làm mất majority thật.
            if (count == 0) {
                candidate = num;
            }

            // Cùng candidate tạo một vote dư; khác candidate triệt tiêu một vote.
            // Majority > n/2 nên sau mọi phép ghép cặp khác nhau nó không thể bị xóa hết.
            count += (num == candidate) ? 1 : -1;
        }

        // Đề đảm bảo majority tồn tại, nên survivor không cần verification pass.
        return candidate;
    }
}
