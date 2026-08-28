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
