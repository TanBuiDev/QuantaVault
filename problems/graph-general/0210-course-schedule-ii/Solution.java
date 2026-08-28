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
