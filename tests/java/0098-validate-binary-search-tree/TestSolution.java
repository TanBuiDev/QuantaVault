class TreeNode {
    int val; TreeNode left; TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        TreeNode a = new TreeNode(2); a.left = new TreeNode(1); a.right = new TreeNode(3);
        check(new Solution().isValidBST(a), "valid example");

        TreeNode b = new TreeNode(5); b.left = new TreeNode(1); b.right = new TreeNode(4); b.right.left = new TreeNode(3); b.right.right = new TreeNode(6);
        check(!new Solution().isValidBST(b), "invalid example");

        TreeNode c = new TreeNode(5); c.left = new TreeNode(4); c.right = new TreeNode(6); c.right.left = new TreeNode(3); c.right.right = new TreeNode(7);
        check(!new Solution().isValidBST(c), "ancestor violation");

        TreeNode d = new TreeNode(Integer.MIN_VALUE); d.right = new TreeNode(Integer.MAX_VALUE);
        check(new Solution().isValidBST(d), "int boundaries must be valid");
        System.out.println("PASS 98 Validate Binary Search Tree");
    }

    private static void check(boolean condition, String message) { if (!condition) throw new AssertionError(message); }
}
