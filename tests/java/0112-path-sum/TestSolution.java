class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        testExampleTrue();
        testExampleFalse();
        testEmpty();
        testInternalTargetIsNotLeaf();
        testNegativePath();
        System.out.println("PASS 112 Path Sum");
    }

    private static void testExampleTrue() {
        TreeNode root = new TreeNode(5);
        root.left = new TreeNode(4);
        root.right = new TreeNode(8);
        root.left.left = new TreeNode(11);
        root.left.left.left = new TreeNode(7);
        root.left.left.right = new TreeNode(2);
        root.right.left = new TreeNode(13);
        root.right.right = new TreeNode(4);
        root.right.right.right = new TreeNode(1);
        check(new Solution().hasPathSum(root, 22), "expected path sum 22");
    }

    private static void testExampleFalse() {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        check(!new Solution().hasPathSum(root, 5), "no path should sum to 5");
    }

    private static void testEmpty() {
        check(!new Solution().hasPathSum(null, 0), "empty tree must be false");
    }

    private static void testInternalTargetIsNotLeaf() {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        check(!new Solution().hasPathSum(root, 1), "internal node cannot terminate the path");
    }

    private static void testNegativePath() {
        TreeNode root = new TreeNode(-2);
        root.right = new TreeNode(-3);
        check(new Solution().hasPathSum(root, -5), "negative root-to-leaf path should work");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
