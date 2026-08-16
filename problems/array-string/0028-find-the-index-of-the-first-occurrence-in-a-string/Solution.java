class Solution {
    public int strStr(String haystack, String needle) {
        int[] lps = buildLps(needle);
        int j = 0;

        for (int i = 0; i < haystack.length(); i++) {
            while (j > 0 && haystack.charAt(i) != needle.charAt(j)) {
                j = lps[j - 1];
            }

            if (haystack.charAt(i) == needle.charAt(j)) {
                j++;
            }

            if (j == needle.length()) {
                return i - needle.length() + 1;
            }
        }

        return -1;
    }

    private int[] buildLps(String pattern) {
        int[] lps = new int[pattern.length()];
        int length = 0;

        for (int i = 1; i < pattern.length(); ) {
            if (pattern.charAt(i) == pattern.charAt(length)) {
                lps[i++] = ++length;
            } else if (length > 0) {
                length = lps[length - 1];
            } else {
                lps[i++] = 0;
            }
        }

        return lps;
    }
}
