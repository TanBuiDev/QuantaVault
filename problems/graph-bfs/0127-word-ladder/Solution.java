import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.List;
import java.util.Queue;
import java.util.Set;

class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> words = new HashSet<>(wordList);

        // Mọi transformed word (kể cả endWord) phải thuộc dictionary; nếu endWord
        // không tồn tại thì không có valid path nào để BFS tìm.
        if (!words.contains(endWord)) {
            return 0;
        }

        Queue<String> queue = new ArrayDeque<>();
        queue.offer(beginWord);
        words.remove(beginWord);

        // Đề hỏi số WORD trong sequence, nên beginWord tự nó đã tạo level length 1.
        int length = 1;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                String current = queue.poll();
                if (current.equals(endWord)) {
                    // BFS xử lý toàn bộ path dài length trước path dài hơn,
                    // nên lần đầu dequeue endWord chính là shortest sequence.
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

                        // remove() vừa test membership vừa mark visited NGAY LÚC
                        // enqueue, ngăn nhiều parent cùng level enqueue trùng next.
                        if (words.remove(next)) {
                            queue.offer(next);
                        }
                    }

                    // Mỗi position phải bắt đầu từ current word gốc; nếu không,
                    // mutation của position trước sẽ rò sang các candidate sau.
                    chars[pos] = original;
                }
            }

            length++;
        }

        return 0;
    }
}
