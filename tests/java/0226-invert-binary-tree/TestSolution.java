import java.util.ArrayDeque;
import java.util.Queue;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        test(new Integer[]{4,2,7,1,3,6,9}, new Integer[]{4,7,2,9,6,3,1});
        test(new Integer[]{2,1,3}, new Integer[]{2,3,1});
        test(new Integer[]{}, new Integer[]{});
        test(new Integer[]{1}, new Integer[]{1});
        test(new Integer[]{1,2,null,3}, new Integer[]{1,null,2,null,3});
        System.out.println("PASS 226 Invert Binary Tree");
    }

    private static void test(Integer[] input, Integer[] expected) {
        TreeNode actual = new Solution().invertTree(build(input));
        if (!same(actual, build(expected))) throw new AssertionError("tree mismatch");
    }

    private static boolean same(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && same(a.left, b.left) && same(a.right, b.right);
    }

    private static TreeNode build(Integer[] values) {
        if (values.length == 0 || values[0] == null) return null;
        TreeNode root = new TreeNode(values[0]);
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < values.length) {
            TreeNode parent = queue.remove();
            if (i < values.length && values[i] != null) { parent.left = new TreeNode(values[i]); queue.add(parent.left); }
            i++;
            if (i < values.length && values[i] != null) { parent.right = new TreeNode(values[i]); queue.add(parent.right); }
            i++;
        }
        return root;
    }
}
