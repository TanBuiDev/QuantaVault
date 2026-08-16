import java.util.ArrayDeque;
import java.util.Queue;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode(int val) {
        this.val = val;
    }
}

public class TestSolution {
    public static void main(String[] args) {
        test(new Integer[]{3,9,20,null,null,15,7}, 3);
        test(new Integer[]{1,null,2}, 2);
        test(new Integer[]{}, 0);
        test(new Integer[]{1}, 1);
        test(new Integer[]{1,2,null,3,null,4}, 4);
        test(new Integer[]{1,2,3,4,5,6,7}, 3);
        System.out.println("PASS 104 Maximum Depth of Binary Tree");
    }

    private static void test(Integer[] values, int expected) {
        int actual = new Solution().maxDepth(build(values));
        if (actual != expected) {
            throw new AssertionError("expected=" + expected + " actual=" + actual);
        }
    }

    private static TreeNode build(Integer[] values) {
        if (values.length == 0 || values[0] == null) {
            return null;
        }

        TreeNode root = new TreeNode(values[0]);
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        int index = 1;

        while (!queue.isEmpty() && index < values.length) {
            TreeNode parent = queue.remove();

            if (index < values.length && values[index] != null) {
                parent.left = new TreeNode(values[index]);
                queue.add(parent.left);
            }
            index++;

            if (index < values.length && values[index] != null) {
                parent.right = new TreeNode(values[index]);
                queue.add(parent.right);
            }
            index++;
        }

        return root;
    }
}
