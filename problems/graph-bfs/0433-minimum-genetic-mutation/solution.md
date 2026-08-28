# Solution / Lời giải — 433. Minimum Genetic Mutation

## 1. Core idea

Mỗi valid gene là một node; mutation một ký tự là unweighted edge. BFS theo level trực tiếp tối thiểu hóa số mutation.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Queue;
import java.util.Set;

public class Solution {
    public int minMutation(String startGene, String endGene, String[] bank) {
        Set<String> valid = new HashSet<>(Arrays.asList(bank));

        // Mọi mutation result phải nằm trong bank, nên endGene không có trong bank
        // đồng nghĩa không thể là endpoint của bất kỳ valid sequence nào.
        if (!valid.contains(endGene)) return -1;

        Queue<String> queue = new ArrayDeque<>();
        Set<String> seen = new HashSet<>();
        queue.offer(startGene);
        seen.add(startGene);
        char[] bases = {'A', 'C', 'G', 'T'};

        // startGene cần 0 mutation để đạt chính nó; mỗi BFS layer thêm đúng 1 step.
        int steps = 0;

        while (!queue.isEmpty()) {
            for (int size = queue.size(); size > 0; size--) {
                String current = queue.poll();
                if (current.equals(endGene)) return steps;

                char[] chars = current.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char old = chars[i];
                    for (char base : bases) {
                        if (base == old) continue;
                        chars[i] = base;
                        String next = new String(chars);

                        // seen.add(next) chỉ true lần đầu, tức candidate được mark
                        // visited lúc enqueue và không thể xuất hiện lại qua parent khác.
                        if (valid.contains(next) && seen.add(next)) queue.offer(next);
                    }
                    chars[i] = old;
                }
            }
            steps++;
        }
        return -1;
    }
}
```

## 3. Correctness

BFS xử lý toàn bộ gene reachable trong `k` mutations trước `k+1`; mọi transition được sinh chỉ khi gene mới nằm trong bank. Vì vậy lần đầu gặp `endGene` dùng minimum mutations.

## 4. Complexity

Với `B` genes và gene length `L`, thử tối đa `4L` candidates cho mỗi state: `O(B*L)` với alphabet hằng số; `O(B)` states phụ.
