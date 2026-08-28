class Solution {
    public boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;

        while (left < right) {
            // Skip lazily tương đương tạo một normalized string nhưng không cần
            // allocate buffer; hai pointer luôn tìm cặp alphanumeric ngoài cùng còn lại.
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }

            char leftChar = Character.toLowerCase(s.charAt(left));
            char rightChar = Character.toLowerCase(s.charAt(right));

            // Mismatch ở cặp hợp lệ ngoài cùng chứng minh ngay normalized sequence
            // không thể đối xứng, nên không cần kiểm tra phần bên trong nữa.
            if (leftChar != rightChar) {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }
}
