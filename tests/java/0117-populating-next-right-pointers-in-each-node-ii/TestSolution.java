class Node {
    int val;
    Node left;
    Node right;
    Node next;
    Node(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        testExample();
        testEmpty();
        testSparseCrossParent();
        testSingleNode();
        System.out.println("PASS 117 Populating Next Right Pointers in Each Node II");
    }

    private static void testExample() {
        Node n1 = new Node(1), n2 = new Node(2), n3 = new Node(3);
        Node n4 = new Node(4), n5 = new Node(5), n7 = new Node(7);
        n1.left = n2; n1.right = n3;
        n2.left = n4; n2.right = n5;
        n3.right = n7;

        Node result = new Solution().connect(n1);

        check(result == n1, "must return the original root");
        check(n1.next == null, "root must end its level");
        check(n2.next == n3 && n3.next == null, "level 2 links are wrong");
        check(n4.next == n5 && n5.next == n7 && n7.next == null, "level 3 links are wrong");
    }

    private static void testEmpty() {
        check(new Solution().connect(null) == null, "empty tree must return null");
    }

    private static void testSparseCrossParent() {
        Node n1 = new Node(1), n2 = new Node(2), n3 = new Node(3);
        Node n5 = new Node(5), n7 = new Node(7);
        n1.left = n2; n1.right = n3;
        n2.right = n5;
        n3.right = n7;

        new Solution().connect(n1);

        check(n2.next == n3, "parents on the same level must be connected");
        check(n5.next == n7, "children from different parents must be connected");
        check(n7.next == null, "last node on a level must point to null");
    }

    private static void testSingleNode() {
        Node root = new Node(42);
        Node result = new Solution().connect(root);
        check(result == root, "single node root must be returned");
        check(root.next == null, "single node next must remain null");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
