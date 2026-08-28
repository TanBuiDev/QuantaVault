class Solution {
    public String reverseWords(String s) {
        StringBuilder result = new StringBuilder();
        int i = s.length() - 1;

        while (i >= 0) {
            // Scan từ phải giúp gặp các word đúng theo thứ tự output cần có;
            // spaces của input chỉ là delimiter nên được bỏ thay vì copy sang kết quả.
            while (i >= 0 && s.charAt(i) == ' ') {
                i--;
            }

            if (i < 0) {
                break;
            }

            int end = i;
            while (i >= 0 && s.charAt(i) != ' ') {
                i--;
            }

            // Tự tạo separator thay vì giữ spaces gốc để đồng thời loại leading,
            // trailing và multiple spaces mà không cần trim/split.
            if (result.length() > 0) {
                result.append(' ');
            }
            result.append(s, i + 1, end + 1);
        }

        return result.toString();
    }
}
