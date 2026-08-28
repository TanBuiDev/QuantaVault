# Solution / Lời giải — 207. Course Schedule

## 1. Core idea

Kahn topological sort. `indegree[x]` là số prerequisite chưa được loại của course `x`; chỉ course có indegree `0` mới có thể học ngay.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indegree = new int[numCourses];

        for (int[] prerequisite : prerequisites) {
            // [course, prerequisite] trở thành edge prerequisite -> course.
            // indegree[course] chính là số prerequisite chưa được hoàn thành.
            graph.get(prerequisite[1]).add(prerequisite[0]);
            indegree[prerequisite[0]]++;
        }

        Queue<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) queue.offer(i);
        }

        int completed = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            completed++;

            // Removing a completed course removes exactly one incoming prerequisite
            // edge from each dependent. Reaching zero means that course is now unlocked.
            for (int next : graph.get(course)) {
                if (--indegree[next] == 0) queue.offer(next);
            }
        }

        // Nodes trapped in a directed cycle can never reach indegree 0, so Kahn
        // processes every course iff the prerequisite graph is acyclic.
        return completed == numCourses;
    }
}
```

## 3. Correctness

Mỗi course chỉ rời queue sau khi mọi incoming prerequisite edge đã bị loại. DAG luôn có thể tiếp tục lấy node indegree `0`; cycle thì giữ các node của nó ở indegree dương mãi. Vì vậy xử lý đủ `numCourses` iff không có cycle.

## 4. Complexity

`O(V + E)` time và `O(V + E)` space.
