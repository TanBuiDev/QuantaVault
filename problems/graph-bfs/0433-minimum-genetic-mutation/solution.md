# Solution / Lời giải — 433. Minimum Genetic Mutation

## 1. Core idea / Ý tưởng chính

Đây là shortest path trên implicit unweighted graph. Mỗi gene là node, một valid one-character mutation là edge. Dùng BFS từ `startGene`; ở mỗi gene thử 4 base cho từng position và enqueue candidate có trong bank chưa visited.

## 2. Algorithm / Thuật toán

1. Đưa bank vào `HashSet`; nếu `endGene` không có trong bank, trả `-1`.
2. Queue bắt đầu bằng start; `steps = 0`.
3. BFS theo level. Với mỗi gene, nếu bằng end thì trả steps.
4. Sinh mọi one-character candidate; candidate phải trong bank và chưa visited mới enqueue.
5. Nếu queue cạn, trả `-1`.

## 3. Why it works / Vì sao đúng

Mỗi BFS level tương ứng đúng một mutation nữa. BFS khám phá mọi gene reachable trong `k` mutations trước khi xét `k+1`, nên lần đầu gặp `endGene` là đường đi ngắn nhất.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.*;

public class Solution {
    public int minMutation(String startGene, String endGene, String[] bank) {
        Set<String> valid = new HashSet<>(Arrays.asList(bank));
        if (!valid.contains(endGene)) return -1;

        Queue<String> queue = new ArrayDeque<>();
        Set<String> seen = new HashSet<>();
        queue.offer(startGene);
        seen.add(startGene);
        char[] bases = {'A', 'C', 'G', 'T'};
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

## 5. Complexity / Độ phức tạp

Với `B` bank genes và gene length `L=8`, mỗi visited gene thử `4L` mutations: `O(B * L * 4)` time và `O(B)` auxiliary space.

## 6. Common mistakes / Lỗi thường gặp

- Cho phép intermediate gene không nằm trong bank.
- Không dùng visited và enqueue cùng gene nhiều lần.
- Dùng DFS rồi kỳ vọng tìm minimum path tự nhiên.
