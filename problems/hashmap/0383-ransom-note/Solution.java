class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] frequency = new int[26];

        for (char c : magazine.toCharArray()) {
            frequency[c - 'a']++;
        }

        for (char c : ransomNote.toCharArray()) {
            if (--frequency[c - 'a'] < 0) {
                return false;
            }
        }

        return true;
    }
}
