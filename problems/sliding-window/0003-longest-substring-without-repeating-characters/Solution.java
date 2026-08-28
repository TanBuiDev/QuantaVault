import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int left = 0;
        int best = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            Integer previous = lastSeen.get(c);

            if (previous != null) {
                // previous có thể nằm ngoài current window. Math.max ngăn left đi lùi,
                // còn khi previous >= left thì nhảy qua nó là vị trí nhỏ nhất loại duplicate.
                left = Math.max(left, previous + 1);
            }

            // Ghi occurrence mới nhất để lần lặp sau có thể bỏ thẳng toàn bộ prefix
            // không còn hữu ích thay vì shrink từng ký tự.
            lastSeen.put(c, right);
            best = Math.max(best, right - left + 1);
        }

        return best;
    }
}
