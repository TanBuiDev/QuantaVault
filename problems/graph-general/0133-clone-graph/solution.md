# Solution / Lời giải — 133. Clone Graph

## 1. Core idea

DFS với map `original -> clone`. Tạo và lưu clone trước khi đi neighbors để vừa giữ object identity vừa chặn recursion vô hạn trên cycle.

## 2. Optimal Java solution

```java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    private final Map<Node, Node> copies = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;

        // Map vừa là visited state vừa là identity mapping original -> clone.
        // Nếu quay lại node do cycle/shared edge, phải reuse đúng clone đã tạo.
        Node existing = copies.get(node);
        if (existing != null) return existing;

        Node copy = new Node(node.val);

        // Quan trọng: publish clone TRƯỚC khi recurse neighbors. Nếu graph có
        // cycle A -> B -> A, lần quay lại A sẽ dừng tại map thay vì recurse vô hạn.
        copies.put(node, copy);
        for (Node neighbor : node.neighbors) {
            copy.neighbors.add(cloneGraph(neighbor));
        }
        return copy;
    }
}
```

## 3. Correctness

Mỗi original node có đúng một clone trong map. Mỗi original edge `u -> v` được rebuild thành `copy(u) -> copy(v)`, kể cả cycle và shared neighbors, nên cấu trúc được bảo toàn mà không reuse original objects.

## 4. Complexity

`O(V + E)` time, `O(V)` map cộng recursion stack.
