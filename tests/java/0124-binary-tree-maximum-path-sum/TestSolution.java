class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        testExample1();
        testExample2();
        testSingleNegative();
        testBestPathWithoutRoot();
        System.out.println("PASS 124 Binary Tree Maximum Path Sum");
    }

    private static void testExample1() {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        check(new Solution().maxPathSum(root) == 6, "example 1 should be 6");
    }

    private static void testExample2() {
        TreeNode root = new TreeNode(-10);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        check(new Solution().maxPathSum(root) == 42, "example 2 should be 42");
    }

    private static void testSingleNegative() {
        check(new Solution().maxPathSum(new TreeNode(-3)) == -3, "single negative node should be selected");
    }

    private static void testBestPathWithoutRoot() {
        TreeNode root = new TreeNode(-2);
        root.left = new TreeNode(-1);
        check(new Solution().maxPathSum(root) == -1, "best path need not include root");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
