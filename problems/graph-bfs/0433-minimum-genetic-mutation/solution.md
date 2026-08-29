# Solution / Lời giải — 433. Minimum Genetic Mutation

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Minimum Genetic Mutation là shortest path: mỗi gene string là state, một mutation đổi đúng một position và chỉ state nằm trong bank mới hợp lệ. Mỗi mutation cost1 nên BFS cho minimum.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DFS có thể tìm một path nhưng không đảm bảo shortest. Dựng all-pairs graph tốn O(B²L); generate neighbors on-demand bằng thử 4 chars tại mỗi vị trí và HashSet bank.

**State / invariant / data structure cần hiểu trước code.** Queue BFS giữ genes theo distance; visited/remove-from-bank khi enqueue đảm bảo mỗi gene vào queue một lần. Invariant first time reach a gene là mutation count nhỏ nhất.

**Dry run mental theo implementation.** start AACCGGTT, end AAACGGTA, bank AACCGGTA,AACCGCTA,AAACGGTA: BFS level1 AACCGGTA, level2 các valid neighbors, cuối AAACGGTA ở shortest level phù hợp.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là cho mutation tới string không trong bank hoặc mark visited quá muộn. Khi nào dùng: minimum edits với finite allowed intermediate states và unit cost là implicit-graph BFS.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
