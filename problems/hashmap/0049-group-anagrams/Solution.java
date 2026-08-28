import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();

        for (String word : strs) {
            // Anagram phụ thuộc multiset ký tự, nên vector 26 frequency là
            // canonical signature không cần sort từng word O(L log L).
            int[] count = new int[26];
            for (char c : word.toCharArray()) {
                count[c - 'a']++;
            }

            StringBuilder keyBuilder = new StringBuilder();
            for (int value : count) {
                // Delimiter giữ ranh giới giữa các count; nếu nối raw digits,
                // các vector như [1,11,...] và [11,1,...] có thể tạo key mơ hồ.
                keyBuilder.append('#').append(value);
            }
            String key = keyBuilder.toString();

            // Mọi word có cùng signature phải vào cùng bucket; computeIfAbsent
            // chỉ tạo list khi signature xuất hiện lần đầu.
            groups.computeIfAbsent(key, ignored -> new ArrayList<>()).add(word);
        }

        return new ArrayList<>(groups.values());
    }
}
