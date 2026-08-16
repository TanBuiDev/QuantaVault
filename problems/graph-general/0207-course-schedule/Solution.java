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
