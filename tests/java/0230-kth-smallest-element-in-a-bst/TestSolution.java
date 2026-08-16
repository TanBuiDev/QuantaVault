class TreeNode {
    int val; TreeNode left; TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        TreeNode r = new TreeNode(3); r.left = new TreeNode(1); r.right = new TreeNode(4); r.left.right = new TreeNode(2);
        check(new Solution().kthSmallest(r, 1) == 1, "example 1");

        TreeNode a = new TreeNode(5); a.left = new TreeNode(3); a.right = new TreeNode(6); a.left.left = new TreeNode(2); a.left.right = new TreeNode(4); a.left.left.left = new TreeNode(1);
        check(new Solution().kthSmallest(a, 3) == 3, "example 2");

        TreeNode b = new TreeNode(2); b.left = new TreeNode(1); b.right = new TreeNode(3);
        check(new Solution().kthSmallest(b, 3) == 3, "largest k");
        System.out.println("PASS 230 Kth Smallest Element in a BST");
    }

    private static void check(boolean condition, String message) { if (!condition) throw new AssertionError(message); }
}
