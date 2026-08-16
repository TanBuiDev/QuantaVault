class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        testExample();
        testEmpty();
        testSingle();
        testLeftChain();
        System.out.println("PASS 114 Flatten Binary Tree to Linked List");
    }

    private static void testExample() {
        TreeNode n1 = new TreeNode(1), n2 = new TreeNode(2), n5 = new TreeNode(5);
        TreeNode n3 = new TreeNode(3), n4 = new TreeNode(4), n6 = new TreeNode(6);
        n1.left = n2; n1.right = n5;
        n2.left = n3; n2.right = n4;
        n5.right = n6;

        new Solution().flatten(n1);
        assertChain(n1, new int[]{1, 2, 3, 4, 5, 6});
    }

    private static void testEmpty() {
        new Solution().flatten(null);
    }

    private static void testSingle() {
        TreeNode root = new TreeNode(0);
        new Solution().flatten(root);
        assertChain(root, new int[]{0});
    }

    private static void testLeftChain() {
        TreeNode n1 = new TreeNode(1), n2 = new TreeNode(2), n3 = new TreeNode(3);
        n1.left = n2;
        n2.left = n3;

        new Solution().flatten(n1);
        assertChain(n1, new int[]{1, 2, 3});
    }

    private static void assertChain(TreeNode root, int[] expected) {
        TreeNode current = root;
        for (int value : expected) {
            if (current == null) throw new AssertionError("chain ended early");
            if (current.val != value) throw new AssertionError("expected " + value + " got " + current.val);
            if (current.left != null) throw new AssertionError("left pointer must be null at " + current.val);
            current = current.right;
        }
        if (current != null) throw new AssertionError("chain has extra nodes or a cycle");
    }
}
