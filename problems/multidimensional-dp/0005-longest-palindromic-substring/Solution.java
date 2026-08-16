class Solution {
    public String longestPalindrome(String s) {
        int start = 0;
        int end = 0;

        for (int center = 0; center < s.length(); center++) {
            int odd = expand(s, center, center);
            int even = expand(s, center, center + 1);
            int len = Math.max(odd, even);

            if (len > end - start + 1) {
                start = center - (len - 1) / 2;
                end = center + len / 2;
            }
        }

        return s.substring(start, end + 1);
    }

    private int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length()
                && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
}
