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
        test(new Integer[]{1,2,3}, new Integer[]{1,2,3}, true);
        test(new Integer[]{1,2}, new Integer[]{1,null,2}, false);
        test(new Integer[]{1,2,1}, new Integer[]{1,1,2}, false);
        test(new Integer[]{}, new Integer[]{}, true);
        test(new Integer[]{1}, new Integer[]{}, false);
        test(new Integer[]{1,2,3,4}, new Integer[]{1,2,3,5}, false);
        System.out.println("PASS 100 Same Tree");
    }

    private static void test(Integer[] p, Integer[] q, boolean expected) {
        boolean actual = new Solution().isSameTree(build(p), build(q));
        if (actual != expected) throw new AssertionError("expected=" + expected + " actual=" + actual);
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
