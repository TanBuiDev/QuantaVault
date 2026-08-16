class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        testSplitAtRoot();
        testTargetIsAncestor();
        testRootIsTarget();
        System.out.println("PASS 236 Lowest Common Ancestor of a Binary Tree");
    }

    private static TreeNode[] buildExampleTree() {
        TreeNode[] n = new TreeNode[9];
        n[0] = new TreeNode(3);
        n[1] = new TreeNode(5);
        n[2] = new TreeNode(1);
        n[3] = new TreeNode(6);
        n[4] = new TreeNode(2);
        n[5] = new TreeNode(0);
        n[6] = new TreeNode(8);
        n[7] = new TreeNode(7);
        n[8] = new TreeNode(4);
        n[0].left = n[1]; n[0].right = n[2];
        n[1].left = n[3]; n[1].right = n[4];
        n[2].left = n[5]; n[2].right = n[6];
        n[4].left = n[7]; n[4].right = n[8];
        return n;
    }

    private static void testSplitAtRoot() {
        TreeNode[] n = buildExampleTree();
        check(new Solution().lowestCommonAncestor(n[0], n[1], n[2]) == n[0], "LCA of 5 and 1 should be 3");
    }

    private static void testTargetIsAncestor() {
        TreeNode[] n = buildExampleTree();
        check(new Solution().lowestCommonAncestor(n[0], n[1], n[8]) == n[1], "LCA of 5 and 4 should be node 5");
    }

    private static void testRootIsTarget() {
        TreeNode root = new TreeNode(1);
        TreeNode child = new TreeNode(2);
        root.left = child;
        check(new Solution().lowestCommonAncestor(root, root, child) == root, "root target should be its own LCA");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
