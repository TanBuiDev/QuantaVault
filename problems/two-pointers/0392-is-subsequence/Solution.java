class Solution {
    public boolean isSubsequence(String s, String t) {
        int sIndex = 0;
        int tIndex = 0;

        while (sIndex < s.length() && tIndex < t.length()) {
            // Match occurrence sớm nhất có thể là greedy-safe: dùng một vị trí
            // sớm hơn trong t luôn để lại suffix lớn hơn cho các ký tự s còn lại.
            if (s.charAt(sIndex) == t.charAt(tIndex)) {
                sIndex++;
            }

            // t luôn tiến vì mỗi vị trí chỉ có thể được dùng một lần và subsequence
            // yêu cầu các index match tăng dần theo đúng thứ tự.
            tIndex++;
        }

        return sIndex == s.length();
    }
}
