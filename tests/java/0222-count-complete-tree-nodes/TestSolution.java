class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        testSix();
        testEmpty();
        testSingle();
        testPerfectSeven();
        testCompleteFive();
        System.out.println("PASS 222 Count Complete Tree Nodes");
    }

    private static void testSix() {
        TreeNode[] n = nodes(6);
        linkComplete(n);
        check(new Solution().countNodes(n[1]) == 6, "six-node complete tree");
    }

    private static void testEmpty() {
        check(new Solution().countNodes(null) == 0, "empty tree should be zero");
    }

    private static void testSingle() {
        check(new Solution().countNodes(new TreeNode(1)) == 1, "single node should be one");
    }

    private static void testPerfectSeven() {
        TreeNode[] n = nodes(7);
        linkComplete(n);
        check(new Solution().countNodes(n[1]) == 7, "perfect seven-node tree");
    }

    private static void testCompleteFive() {
        TreeNode[] n = nodes(5);
        linkComplete(n);
        check(new Solution().countNodes(n[1]) == 5, "complete five-node tree");
    }

    private static TreeNode[] nodes(int count) {
        TreeNode[] result = new TreeNode[count + 1];
        for (int i = 1; i <= count; i++) result[i] = new TreeNode(i);
        return result;
    }

    private static void linkComplete(TreeNode[] n) {
        for (int i = 1; i < n.length; i++) {
            int left = i * 2, right = left + 1;
            if (left < n.length) n[i].left = n[left];
            if (right < n.length) n[i].right = n[right];
        }
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
