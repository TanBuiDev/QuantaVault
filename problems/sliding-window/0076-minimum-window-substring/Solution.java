class Solution {
    public String minWindow(String s, String t) {
        if (t.length() > s.length()) {
            return "";
        }

        int[] need = new int[128];
        int[] window = new int[128];
        int required = 0;

        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (need[c] == 0) {
                // required đếm distinct constraints, không phải tổng số ký tự của t.
                required++;
            }
            need[c]++;
        }

        int formed = 0;
        int left = 0;
        int bestStart = 0;
        int bestLength = Integer.MAX_VALUE;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window[c]++;

            // Chỉ tăng formed ở thời điểm vừa đạt quota. Các bản sao vượt quota
            // vẫn hợp lệ nhưng không đại diện cho một constraint distinct mới.
            if (need[c] > 0 && window[c] == need[c]) {
                formed++;
            }

            // Khi mọi quota đều đủ, shrink tối đa để xét shortest valid window
            // cho right hiện tại; đây là lúc tối ưu length chứ không phải lúc expand.
            while (formed == required) {
                int length = right - left + 1;
                if (length < bestLength) {
                    bestLength = length;
                    bestStart = left;
                }

                char leftChar = s.charAt(left);
                window[leftChar]--;

                // formed chỉ giảm khi removal thực sự làm một required character
                // tụt dưới quota; xóa phần dư không làm window mất tính hợp lệ.
                if (need[leftChar] > 0 && window[leftChar] < need[leftChar]) {
                    formed--;
                }
                left++;
            }
        }

        return bestLength == Integer.MAX_VALUE
                ? ""
                : s.substring(bestStart, bestStart + bestLength);
    }
}
