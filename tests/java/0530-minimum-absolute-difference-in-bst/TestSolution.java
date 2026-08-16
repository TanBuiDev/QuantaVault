class TreeNode {
    int val; TreeNode left; TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        TreeNode r = new TreeNode(4); r.left = new TreeNode(2); r.right = new TreeNode(6); r.left.left = new TreeNode(1); r.left.right = new TreeNode(3);
        check(new Solution().getMinimumDifference(r) == 1, "example 1");

        TreeNode a = new TreeNode(1); a.left = new TreeNode(0); a.right = new TreeNode(48); a.right.left = new TreeNode(12); a.right.right = new TreeNode(49);
        check(new Solution().getMinimumDifference(a) == 1, "example 2");

        TreeNode b = new TreeNode(10); b.left = new TreeNode(5); b.right = new TreeNode(20); b.left.right = new TreeNode(9);
        check(new Solution().getMinimumDifference(b) == 1, "inorder neighbors need not be parent-child");
        System.out.println("PASS 530 Minimum Absolute Difference in BST");
    }

    private static void check(boolean condition, String message) { if (!condition) throw new AssertionError(message); }
}
