import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ");
        if (words.length != pattern.length()) {
            return false;
        }

        Map<Character, String> charToWord = new HashMap<>();
        Map<String, Character> wordToChar = new HashMap<>();

        for (int i = 0; i < words.length; i++) {
            char c = pattern.charAt(i);
            String word = words[i];

            // Forward map bảo đảm một pattern char không đổi target word.
            if (charToWord.containsKey(c) && !charToWord.get(c).equals(word)) {
                return false;
            }

            // Reverse map là phần bắt buộc để bảo đảm one-to-one: hai char khác nhau
            // không được cùng map vào một word dù forward map riêng lẻ vẫn nhất quán.
            if (wordToChar.containsKey(word) && wordToChar.get(word) != c) {
                return false;
            }

            charToWord.put(c, word);
            wordToChar.put(word, c);
        }

        return true;
    }
}
