# Solution / Lời giải — 210. Course Schedule II

## 1. Core idea / Ý tưởng chính

Dùng Kahn topological sort. Queue chứa course indegree zero; mỗi course poll ra được append vào `order`, rồi giảm indegree của dependent courses. Nếu cuối cùng ghi đủ `numCourses`, `order` hợp lệ; nếu không, graph có cycle và trả array rỗng.

## 2. Algorithm / Thuật toán

1. Xây adjacency list `prerequisite -> dependent` và indegree.
2. Enqueue tất cả course indegree zero.
3. Poll queue, ghi vào order, giảm indegree neighbors; neighbor về zero thì enqueue.
4. Nếu số phần tử ghi được bằng `numCourses`, trả order; ngược lại trả `new int[0]`.

## 3. Why it works / Vì sao đúng

Một node chỉ được đưa vào order khi mọi prerequisite incoming edge đã được loại, nên mọi edge `u -> v` luôn có `u` đứng trước `v`. Nếu graph acyclic, Kahn xử lý được toàn bộ node. Nếu có cycle, các node trong cycle không bao giờ đạt indegree zero, khiến output thiếu node và ta trả array rỗng.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.*;

public class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
            indegree[p[0]]++;
        }
        Queue<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) queue.offer(i);

        int[] order = new int[numCourses];
        int index = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            order[index++] = course;
            for (int next : graph.get(course)) {
                if (--indegree[next] == 0) queue.offer(next);
            }
        }
        return index == numCourses ? order : new int[0];
    }
}
```

## 5. Complexity / Độ phức tạp

`O(V + E)` time và `O(V + E)` space.

## 6. Common mistakes / Lỗi thường gặp

- Đòi output phải giống duy nhất một example dù nhiều topological orders hợp lệ.
- Trả partial order khi graph có cycle.
- Đảo edge direction và indegree không đồng bộ.
