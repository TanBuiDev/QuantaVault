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

        // Candidate starts có wordLength residue classes khác nhau. Quét từng offset
        // riêng giúp left/right luôn đứng đúng token boundary thay vì thử từng character.
        for (int offset = 0; offset < wordLength; offset++) {
            int left = offset;
            int count = 0;
            Map<String, Integer> seen = new HashMap<>();

            for (int right = offset; right + wordLength <= s.length(); right += wordLength) {
                String word = s.substring(right, right + wordLength);

                // Token ngoài dictionary không thể thuộc bất kỳ valid window nào bắc qua nó,
                // nên toàn bộ state trước token này có thể bỏ và restart ngay sau nó.
                if (!need.containsKey(word)) {
                    seen.clear();
                    count = 0;
                    left = right + wordLength;
                    continue;
                }

                seen.put(word, seen.getOrDefault(word, 0) + 1);
                count++;

                // Chỉ current word vừa có thể vượt quota. Shrink tới khi bỏ được một
                // occurrence thừa, giữ suffix dài nhất còn thỏa mọi frequency bound.
                while (seen.get(word) > need.get(word)) {
                    String leftWord = s.substring(left, left + wordLength);
                    seen.put(leftWord, seen.get(leftWord) - 1);
                    left += wordLength;
                    count--;
                }

                if (count == wordCount) {
                    // Mọi token đều thuộc need và không quota nào bị vượt; khi tổng token
                    // bằng tổng quota, toàn bộ frequency bắt buộc khớp chính xác.
                    answer.add(left);

                    // Bỏ một token để tiếp tục tìm các match overlapping trong cùng alignment.
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
