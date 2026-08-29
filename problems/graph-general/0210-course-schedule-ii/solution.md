# Solution / Lời giải — 210. Course Schedule II

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Course Schedule II không chỉ hỏi có thể học hết không mà cần một ordering. Topological sort chính là quá trình liên tục chọn course không còn prerequisite chưa hoàn thành.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Brute-force permutations quá lớn. Kahn BFS đã xây ordering trong lúc cycle-check: enqueue all indegree0, pop vào answer, decrement neighbors; neighbor vừa về0 trở thành choice tiếp theo.

**State / invariant / data structure cần hiểu trước code.** indegree là số dependency còn chưa được xử lý; result chứa topo prefix hợp lệ. Invariant mọi edge từ một course đã output tới neighbor được remove đúng một lần; queue chỉ chứa nodes hiện có indegree0.

**Dry run mental theo implementation.** Dry run num4, prerequisites [1,0],[2,0],[3,1],[3,2]: start0; process0 mở1,2; process1/2 cuối cùng làm indegree3 về0; result có thể [0,1,2,3].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là trả partial ordering khi cycle; phải kiểm result size==numCourses. Khi nào dùng: cần linear ordering tôn trọng directed prerequisites = topological sort.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Kahn topological sort giống Course Schedule, nhưng ghi mỗi node indegree `0` vào output tại thời điểm nó được remove. Nếu không ghi đủ mọi course thì graph có cycle.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indegree = new int[numCourses];

        for (int[] p : prerequisites) {
            // Edge prerequisite -> dependent khiến indegree phản ánh chính xác
            // số prerequisite còn chưa xuất hiện trước course đó trong order.
            graph.get(p[1]).add(p[0]);
            indegree[p[0]]++;
        }

        Queue<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) queue.offer(i);
        }

        int[] order = new int[numCourses];
        int index = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();

            // Khi course được lấy ra, mọi prerequisite của nó đã nằm trước nó,
            // nên append tại đây luôn giữ topological-order invariant.
            order[index++] = course;
            for (int next : graph.get(course)) {
                if (--indegree[next] == 0) queue.offer(next);
            }
        }

        // Nếu còn node chưa ghi thì chúng bị khóa trong/đằng sau một cycle;
        // partial order không phải đáp án hợp lệ nên phải trả empty array.
        return index == numCourses ? order : new int[0];
    }
}
```

## 3. Correctness

Một course được append chỉ khi toàn bộ incoming prerequisite đã bị remove, nên mọi edge `u -> v` có `u` đứng trước `v`. Nếu cycle tồn tại, không thể append đủ mọi node và thuật toán trả empty array.

## 4. Complexity

`O(V + E)` time và `O(V + E)` space.
