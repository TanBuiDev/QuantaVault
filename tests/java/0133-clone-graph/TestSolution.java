import java.util.ArrayList;
import java.util.List;

class Node {
    int val;
    List<Node> neighbors;
    Node() { this(0); }
    Node(int val) { this.val = val; this.neighbors = new ArrayList<>(); }
}

public class TestSolution {
    public static void main(String[] args) {
        testCycleDeepCopy();
        testSingleNode();
        testNull();
        System.out.println("PASS 133 Clone Graph");
    }

    private static void testCycleDeepCopy() {
        Node n1 = new Node(1), n2 = new Node(2), n3 = new Node(3), n4 = new Node(4);
        n1.neighbors.add(n2); n1.neighbors.add(n4);
        n2.neighbors.add(n1); n2.neighbors.add(n3);
        n3.neighbors.add(n2); n3.neighbors.add(n4);
        n4.neighbors.add(n1); n4.neighbors.add(n3);

        Node copy1 = new Solution().cloneGraph(n1);
        check(copy1 != n1, "root must be a new object");
        check(copy1.val == 1 && copy1.neighbors.size() == 2, "root shape mismatch");

        Node copy2 = copy1.neighbors.get(0);
        Node copy4 = copy1.neighbors.get(1);
        check(copy2 != n2 && copy4 != n4, "neighbors must be cloned objects");
        check(copy2.val == 2 && copy4.val == 4, "neighbor values mismatch");
        check(copy2.neighbors.get(0) == copy1, "cycle must point back to cloned root");

        Node copy3 = copy2.neighbors.get(1);
        check(copy3 != n3 && copy3.val == 3, "third node must be deep-cloned");
        check(copy3.neighbors.get(0) == copy2, "clone edge 3-2 mismatch");
        check(copy3.neighbors.get(1) == copy4, "shared clone identity for node 4 must be preserved");
        check(copy4.neighbors.get(0) == copy1 && copy4.neighbors.get(1) == copy3, "clone cycle structure mismatch");
    }

    private static void testSingleNode() {
        Node original = new Node(1);
        Node copy = new Solution().cloneGraph(original);
        check(copy != original, "single node must be cloned");
        check(copy.val == 1 && copy.neighbors.isEmpty(), "single node clone mismatch");
    }

    private static void testNull() {
        check(new Solution().cloneGraph(null) == null, "null graph must return null");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
