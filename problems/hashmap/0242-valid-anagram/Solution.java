class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }

        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            // Cùng một counter lưu hiệu frequency(s) - frequency(t), nên không cần
            // hai mảng riêng; anagram iff mọi hiệu cuối cùng trở về 0.
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }

        for (int value : count) {
            // Một counter khác 0 chứng minh multiplicity của ít nhất một letter khác nhau.
            if (value != 0) {
                return false;
            }
        }
        return true;
    }
}
