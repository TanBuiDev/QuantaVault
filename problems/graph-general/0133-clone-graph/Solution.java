import java.util.HashMap;
import java.util.Map;

public class Solution {
    private final Map<Node, Node> copies = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;
        Node existing = copies.get(node);
        if (existing != null) return existing;

        Node copy = new Node(node.val);
        copies.put(node, copy);
        for (Node neighbor : node.neighbors) {
            copy.neighbors.add(cloneGraph(neighbor));
        }
        return copy;
    }
}
