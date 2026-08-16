import java.util.ArrayList;
import java.util.List;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{9,3,15,20,7}, new int[]{9,15,7,20,3});
        test(new int[]{-1}, new int[]{-1});
        test(new int[]{1,2,3,4}, new int[]{1,2,3,4});
        test(new int[]{1,2,3,4}, new int[]{4,3,2,1});
        System.out.println("PASS 106 Construct Binary Tree from Inorder and Postorder Traversal");
    }

    private static void test(int[] inorder, int[] postorder) {
        TreeNode root = new Solution().buildTree(inorder, postorder);
        List<Integer> actualInorder = new ArrayList<>();
        List<Integer> actualPostorder = new ArrayList<>();
        collectInorder(root, actualInorder);
        collectPostorder(root, actualPostorder);
        if (!actualInorder.equals(toList(inorder))) throw new AssertionError("inorder mismatch: " + actualInorder);
        if (!actualPostorder.equals(toList(postorder))) throw new AssertionError("postorder mismatch: " + actualPostorder);
    }

    private static void collectInorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        collectInorder(node.left, out);
        out.add(node.val);
        collectInorder(node.right, out);
    }

    private static void collectPostorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        collectPostorder(node.left, out);
        collectPostorder(node.right, out);
        out.add(node.val);
    }

    private static List<Integer> toList(int[] values) {
        List<Integer> result = new ArrayList<>();
        for (int value : values) result.add(value);
        return result;
    }
}
