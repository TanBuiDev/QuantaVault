# Solution / Lời giải — 127. Word Ladder

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Mỗi word là một state; một bước đổi đúng một ký tự tạo edge cost 1 tới word hợp lệ khác. Bài hỏi ít bước nhất, nên cần xét tất cả states distance1 trước distance2: đó là BFS.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Dựng graph bằng so mọi cặp words có thể O(N²L). Quan sát từ một word ta có thể thử thay từng vị trí bằng 26 letters và lookup candidate trong HashSet O(1), sinh neighbors khi cần.

**State / invariant / data structure cần hiểu trước code.** Queue chứa frontier theo số transformations; visited/dictionary-removal đảm bảo mỗi word xử lý một lần. Invariant khi dequeue word ở level d, d là số bước nhỏ nhất để tới word đó từ beginWord.

**Dry run mental theo implementation.** Dry run hit->cog với dict hot,dot,dog,lot,log,cog: level1 hot; level2 dot,lot; level3 dog,log; level4 cog. Lần đầu gặp cog là shortest vì BFS tăng distance theo layer.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là DFS rồi lấy path đầu tiên hoặc không mark visited lúc enqueue gây duplicate frontier. Khi nào dùng: shortest transitions trong unweighted implicit graph là BFS, neighbor generation có thể on-demand.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Các word tạo thành implicit unweighted graph: một edge là đổi đúng một ký tự. BFS vì vậy cho sequence ngắn nhất mà không cần dựng toàn bộ graph.

## 2. Optimal Java solution

```java
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
```

## 3. Correctness

Mỗi BFS level tăng đúng một transformation. Mark visited khi enqueue bảo đảm mỗi word được khám phá ở khoảng cách nhỏ nhất của nó; do đó lần đầu `endWord` được dequeue cho shortest path. `length` bắt đầu từ `1` nên đếm số word đúng theo đề.

## 4. Complexity

Với `N` words, độ dài `L`: khoảng `O(N * 26 * L)` neighbor attempts (chi phí tạo String phụ thuộc `L`), space `O(N)` states ngoài string storage.
