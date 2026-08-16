import java.util.Arrays;
import java.util.Collections;
import java.util.List;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        testExample();
        testSingle();
        testEmpty();
        System.out.println("PASS 103 Binary Tree Zigzag Level Order Traversal");
    }

    private static void testExample() {
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);
        List<List<Integer>> expected = Arrays.asList(Arrays.asList(3), Arrays.asList(20,9), Arrays.asList(15,7));
        check(new Solution().zigzagLevelOrder(root).equals(expected), "zigzag example mismatch");
    }

    private static void testSingle() {
        check(new Solution().zigzagLevelOrder(new TreeNode(1)).equals(Arrays.asList(Arrays.asList(1))), "single node");
    }

    private static void testEmpty() {
        check(new Solution().zigzagLevelOrder(null).equals(Collections.emptyList()), "empty tree");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
