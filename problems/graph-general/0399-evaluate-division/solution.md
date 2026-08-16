# Solution / Lời giải — 399. Evaluate Division

## 1. Core idea / Ý tưởng chính

Biến mỗi equation thành hai weighted directed edges. Với `a / b = v`, thêm `a -> b` weight `v` và `b -> a` weight `1/v`. Mỗi query chạy DFS từ source tới target và nhân các weight dọc path.

## 2. Algorithm / Thuật toán

1. Xây adjacency list weighted từ toàn bộ equations.
2. Với query `(source, target)`:
   - nếu một variable không có trong graph, trả `-1.0`;
   - DFS với `product = 1.0` và visited set;
   - khi tới target, trả product;
   - nếu không có path, trả `-1.0`.
3. Lặp cho mọi query.

## 3. Why it works / Vì sao đúng

Mỗi edge biểu diễn đúng một tỷ số. Khi đi qua path `a -> b -> c`, product là `(a/b) * (b/c) = a/c`; các variable trung gian triệt tiêu. Vì DFS xét mọi path reachable mà không lặp cycle, nếu target reachable thì một path cho đúng tỷ số; nếu không reachable thì query không thể xác định.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.*;

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
            double v = values[i];
            graph.computeIfAbsent(a, k -> new ArrayList<>()).add(new Edge(b, v));
            graph.computeIfAbsent(b, k -> new ArrayList<>()).add(new Edge(a, 1.0 / v));
        }

        double[] answer = new double[queries.size()];
        for (int i = 0; i < queries.size(); i++) {
            String source = queries.get(i).get(0);
            String target = queries.get(i).get(1);
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
                double result = dfs(edge.to, target, product * edge.weight, graph, visited);
                if (result != -1.0) return result;
            }
        }
        return -1.0;
    }
}
```

## 5. Complexity / Độ phức tạp

- Build graph: `O(E)`.
- Mỗi query: worst-case `O(V + E)`.
- Tổng: `O(Q * (V + E))` worst-case.
- Space: `O(V + E)` cho graph và `O(V)` visited/DFS stack mỗi query.

## 6. Common mistakes / Lỗi thường gặp

- Quên reverse edge `1/v`.
- Cộng weight thay vì nhân.
- Cho `x/x = 1` ngay cả khi `x` chưa từng xuất hiện trong graph.
- Không dùng visited và bị cycle recursion.
