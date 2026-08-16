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
        testSingleZero();
        testZeroDigitBranches();
        System.out.println("PASS 129 Sum Root to Leaf Numbers");
    }

    private static void testExample1() {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        check(new Solution().sumNumbers(root) == 25, "example 1 should be 25");
    }

    private static void testExample2() {
        TreeNode root = new TreeNode(4);
        root.left = new TreeNode(9);
        root.right = new TreeNode(0);
        root.left.left = new TreeNode(5);
        root.left.right = new TreeNode(1);
        check(new Solution().sumNumbers(root) == 1026, "example 2 should be 1026");
    }

    private static void testSingleZero() {
        check(new Solution().sumNumbers(new TreeNode(0)) == 0, "single zero should sum to zero");
    }

    private static void testZeroDigitBranches() {
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(0);
        root.right = new TreeNode(1);
        check(new Solution().sumNumbers(root) == 21, "10 + 11 should equal 21");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
