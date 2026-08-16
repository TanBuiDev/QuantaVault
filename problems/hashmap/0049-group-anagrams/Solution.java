import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();

        for (String word : strs) {
            int[] count = new int[26];
            for (char c : word.toCharArray()) {
                count[c - 'a']++;
            }

            StringBuilder keyBuilder = new StringBuilder();
            for (int value : count) {
                keyBuilder.append('#').append(value);
            }
            String key = keyBuilder.toString();

            groups.computeIfAbsent(key, ignored -> new ArrayList<>()).add(word);
        }

        return new ArrayList<>(groups.values());
    }
}
