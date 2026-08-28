import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Solution {
    private static class Edge {
        String to;
        double weight;
        Edge(String to, double weight) { this.to = to; this.weight = weight; }
    }

    public double[] calcEquation(List<List<String>> equations, double[] values,
                                 List<List<String>> queries) {
        Map<String, List<Edge>> graph = new HashMap<>();
        for (int i = 0; i < equations.size(); i++) {
            String a = equations.get(i).get(0);
            String b = equations.get(i).get(1);
            double value = values[i];

            // a / b = value tương đương hai directed ratios. Reverse edge phải
            // là reciprocal để đi ngược vẫn biểu diễn đúng phép chia.
            graph.computeIfAbsent(a, key -> new ArrayList<>()).add(new Edge(b, value));
            graph.computeIfAbsent(b, key -> new ArrayList<>()).add(new Edge(a, 1.0 / value));
        }

        double[] answer = new double[queries.size()];
        for (int i = 0; i < queries.size(); i++) {
            String source = queries.get(i).get(0);
            String target = queries.get(i).get(1);

            // Kể cả source == target, variable chưa từng xuất hiện vẫn là unknown,
            // nên phải reject trước khi DFS có thể trả product ban đầu là 1.0.
            if (!graph.containsKey(source) || !graph.containsKey(target)) {
                answer[i] = -1.0;
            } else {
                answer[i] = dfs(source, target, 1.0, graph, new HashSet<>());
            }
        }
        return answer;
    }

    private double dfs(String current, String target, double product,
                       Map<String, List<Edge>> graph, Set<String> visited) {
        if (current.equals(target)) return product;
        visited.add(current);

        for (Edge edge : graph.get(current)) {
            if (!visited.contains(edge.to)) {
                // Multiplying path weights telescopes intermediate variables:
                // (a/b) * (b/c) * ... = a/target.
                double result = dfs(edge.to, target, product * edge.weight, graph, visited);
                if (result != -1.0) return result;
            }
        }
        return -1.0;
    }
}
