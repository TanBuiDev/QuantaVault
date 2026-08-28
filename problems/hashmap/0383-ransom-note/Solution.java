class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] frequency = new int[26];

        for (char c : magazine.toCharArray()) {
            frequency[c - 'a']++;
        }

        for (char c : ransomNote.toCharArray()) {
            // Counter là inventory còn lại. Decrement trước rồi kiểm tra âm giúp
            // phát hiện đúng thời điểm demand vượt supply của ký tự này.
            if (--frequency[c - 'a'] < 0) {
                // Thiếu hụt đã xảy ra trong toàn bộ magazine; ký tự phía sau
                // không thể bổ sung lại inventory nên có thể fail ngay.
                return false;
            }
        }

        return true;
    }
}
