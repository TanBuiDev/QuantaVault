# Solution / Lời giải — 207. Course Schedule

## 1. Core idea / Ý tưởng chính

Bài toán hỏi directed prerequisite graph có cycle hay không. Dùng Kahn topological sort: enqueue mọi node indegree `0`, lần lượt remove chúng và giảm indegree của dependent courses. Nếu xử lý được đủ `numCourses`, graph acyclic và có thể hoàn thành tất cả course.

## 2. Algorithm / Thuật toán

1. Xây adjacency list `b -> a` cho mỗi `[a,b]` và mảng indegree.
2. Enqueue mọi course có indegree `0`.
3. Poll course, tăng `completed`, giảm indegree của neighbors; neighbor về `0` thì enqueue.
4. Trả `completed == numCourses`.

## 3. Why it works / Vì sao đúng

Một DAG luôn có ít nhất một node indegree zero, nên Kahn liên tục loại được node cho tới khi hết graph. Ngược lại, nếu còn cycle thì mọi node trong cycle luôn có ít nhất một incoming edge từ cycle, nên không node nào đạt indegree zero và thuật toán dừng sớm. Vì vậy xử lý đủ mọi node khi và chỉ khi không có cycle.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.*;

public class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] prerequisite : prerequisites) {
            graph.get(prerequisite[1]).add(prerequisite[0]);
            indegree[prerequisite[0]]++;
        }

        Queue<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) queue.offer(i);

        int completed = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            completed++;
            for (int next : graph.get(course)) {
                if (--indegree[next] == 0) queue.offer(next);
            }
        }
        return completed == numCourses;
    }
}
```

## 5. Complexity / Độ phức tạp

`O(V + E)` time và `O(V + E)` space.

## 6. Common mistakes / Lỗi thường gặp

- Đảo chiều edge nhưng tính indegree không nhất quán.
- Chỉ kiểm tra một component của graph.
- Nhầm số node processed với queue size.
