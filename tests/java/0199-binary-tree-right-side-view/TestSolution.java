import java.util.Arrays;
import java.util.Collections;

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
        testRightOnly();
        testEmpty();
        System.out.println("PASS 199 Binary Tree Right Side View");
    }

    private static void testExample1() {
        TreeNode n1 = new TreeNode(1), n2 = new TreeNode(2), n3 = new TreeNode(3), n5 = new TreeNode(5), n4 = new TreeNode(4);
        n1.left = n2; n1.right = n3; n2.right = n5; n3.right = n4;
        check(new Solution().rightSideView(n1).equals(Arrays.asList(1,3,4)), "example 1");
    }

    private static void testExample2() {
        TreeNode n1 = new TreeNode(1), n2 = new TreeNode(2), n3 = new TreeNode(3), n4 = new TreeNode(4), n5 = new TreeNode(5);
        n1.left = n2; n1.right = n3; n2.left = n4; n4.left = n5;
        check(new Solution().rightSideView(n1).equals(Arrays.asList(1,3,4,5)), "example 2");
    }

    private static void testRightOnly() {
        TreeNode root = new TreeNode(1); root.right = new TreeNode(3);
        check(new Solution().rightSideView(root).equals(Arrays.asList(1,3)), "right-only");
    }

    private static void testEmpty() {
        check(new Solution().rightSideView(null).equals(Collections.emptyList()), "empty");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
