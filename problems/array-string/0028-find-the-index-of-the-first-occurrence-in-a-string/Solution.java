class Solution {
    public int strStr(String haystack, String needle) {
        // lps cho biết phần prefix nào của needle vẫn còn có thể tái sử dụng sau mismatch.
        int[] lps = buildLps(needle);
        // j luôn là số ký tự đầu needle đang match liên tiếp với suffix của phần haystack đã đọc.
        int j = 0;

        for (int i = 0; i < haystack.length(); i++) {
            // Không lùi i: nếu mismatch sau j ký tự đã match, border dài lps[j-1]
            // là candidate dài nhất còn hợp lệ; các start ở giữa đã được cấu trúc prefix/suffix loại trừ.
            while (j > 0 && haystack.charAt(i) != needle.charAt(j)) {
                j = lps[j - 1];
            }

            if (haystack.charAt(i) == needle.charAt(j)) {
                j++;
            }

            // j đạt toàn bộ pattern nghĩa là match vừa kết thúc tại i,
            // nên start index được suy ra bằng cách lùi đúng needle.length() - 1 vị trí.
            if (j == needle.length()) {
                return i - needle.length() + 1;
            }
        }

        return -1;
    }

    private int[] buildLps(String pattern) {
        int[] lps = new int[pattern.length()];
        // length là độ dài border tốt nhất của prefix kết thúc ngay trước i.
        int length = 0;

        for (int i = 1; i < pattern.length(); ) {
            if (pattern.charAt(i) == pattern.charAt(length)) {
                // Match này mở rộng border hiện tại thêm một ký tự.
                lps[i++] = ++length;
            } else if (length > 0) {
                // Không tăng i: border hiện tại thất bại nhưng một border ngắn hơn của chính nó
                // vẫn có thể match tại cùng i, nên fallback qua lps thay vì làm lại từ đầu.
                length = lps[length - 1];
            } else {
                // Không còn border nào để thử, nên prefix kết thúc tại i có LPS bằng 0.
                lps[i++] = 0;
            }
        }

        return lps;
    }
}
