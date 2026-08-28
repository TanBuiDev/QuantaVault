class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1;
        int j = n - 1;
        // Ghi từ cuối để tận dụng buffer của nums1 mà không ghi đè phần tử hợp lệ chưa đọc.
        int write = m + n - 1;

        // Chỉ cần bảo đảm nums2 được dùng hết: nếu nums2 hết trước,
        // phần nums1 còn lại vốn đã nằm đúng vị trí ở đầu mảng.
        while (j >= 0) {
            // Hai suffix chưa xử lý đều sorted, nên phần tử lớn nhất còn lại
            // phải là nums1[i] hoặc nums2[j] và có thể chốt ngay tại write.
            if (i >= 0 && nums1[i] > nums2[j]) {
                nums1[write--] = nums1[i--];
            } else {
                // Nhánh này cũng xử lý i < 0, khi mọi phần tử còn lại bắt buộc đến từ nums2.
                nums1[write--] = nums2[j--];
            }
        }
    }
}
