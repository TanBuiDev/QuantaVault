import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.List;
import java.util.Queue;
import java.util.Set;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> words = new HashSet<>(wordList);
        if (!words.contains(endWord)) {
            return 0;
        }

        Queue<String> queue = new ArrayDeque<>();
        queue.offer(beginWord);
        words.remove(beginWord);

        int length = 1;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                String current = queue.poll();
                if (current.equals(endWord)) {
                    return length;
                }

                char[] chars = current.toCharArray();

                for (int pos = 0; pos < chars.length; pos++) {
                    char original = chars[pos];

                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        if (ch == original) {
                            continue;
                        }

                        chars[pos] = ch;
                        String next = new String(chars);

                        if (words.remove(next)) {
                            queue.offer(next);
                        }
                    }

                    chars[pos] = original;
                }
            }

            length++;
        }

        return 0;
    }
}
