import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<Integer> findSubstring(String s, String[] words) {
        List<Integer> answer = new ArrayList<>();
        int wordLength = words[0].length();
        int wordCount = words.length;
        int totalLength = wordLength * wordCount;

        if (totalLength > s.length()) {
            return answer;
        }

        Map<String, Integer> need = new HashMap<>();
        for (String word : words) {
            need.put(word, need.getOrDefault(word, 0) + 1);
        }

        for (int offset = 0; offset < wordLength; offset++) {
            int left = offset;
            int count = 0;
            Map<String, Integer> seen = new HashMap<>();

            for (int right = offset; right + wordLength <= s.length(); right += wordLength) {
                String word = s.substring(right, right + wordLength);

                if (!need.containsKey(word)) {
                    seen.clear();
                    count = 0;
                    left = right + wordLength;
                    continue;
                }

                seen.put(word, seen.getOrDefault(word, 0) + 1);
                count++;

                while (seen.get(word) > need.get(word)) {
                    String leftWord = s.substring(left, left + wordLength);
                    seen.put(leftWord, seen.get(leftWord) - 1);
                    left += wordLength;
                    count--;
                }

                if (count == wordCount) {
                    answer.add(left);
                    String leftWord = s.substring(left, left + wordLength);
                    seen.put(leftWord, seen.get(leftWord) - 1);
                    left += wordLength;
                    count--;
                }
            }
        }

        return answer;
    }
}
