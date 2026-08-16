import java.util.List;

class TreeNode {
    int val; TreeNode left; TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        List<Double> got = new Solution().averageOfLevels(root);
        check(got.size() == 3 && eq(got.get(0), 3) && eq(got.get(1), 14.5) && eq(got.get(2), 11), "example");

        TreeNode big = new TreeNode(Integer.MAX_VALUE);
        big.left = new TreeNode(Integer.MAX_VALUE);
        big.right = new TreeNode(Integer.MAX_VALUE);
        got = new Solution().averageOfLevels(big);
        check(eq(got.get(1), Integer.MAX_VALUE), "large-value level must not overflow");
        System.out.println("PASS 637 Average of Levels in Binary Tree");
    }

    private static boolean eq(double a, double b) { return Math.abs(a - b) < 1e-9; }
    private static void check(boolean condition, String message) { if (!condition) throw new AssertionError(message); }
}
