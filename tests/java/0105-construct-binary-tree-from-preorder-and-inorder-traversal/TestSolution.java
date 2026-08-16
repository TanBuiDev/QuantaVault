import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        test(new int[]{3,9,20,15,7}, new int[]{9,3,15,20,7});
        test(new int[]{-1}, new int[]{-1});
        test(new int[]{4,3,2,1}, new int[]{1,2,3,4});
        test(new int[]{1,2,3,4}, new int[]{1,2,3,4});
        System.out.println("PASS 105 Construct Binary Tree from Preorder and Inorder Traversal");
    }

    private static void test(int[] preorder, int[] inorder) {
        TreeNode root = new Solution().buildTree(preorder, inorder);
        List<Integer> actualPreorder = new ArrayList<>();
        List<Integer> actualInorder = new ArrayList<>();
        collectPreorder(root, actualPreorder);
        collectInorder(root, actualInorder);
        if (!actualPreorder.equals(toList(preorder))) throw new AssertionError("preorder mismatch: " + actualPreorder);
        if (!actualInorder.equals(toList(inorder))) throw new AssertionError("inorder mismatch: " + actualInorder);
    }

    private static void collectPreorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        out.add(node.val);
        collectPreorder(node.left, out);
        collectPreorder(node.right, out);
    }

    private static void collectInorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        collectInorder(node.left, out);
        out.add(node.val);
        collectInorder(node.right, out);
    }

    private static List<Integer> toList(int[] values) {
        List<Integer> result = new ArrayList<>();
        for (int value : values) result.add(value);
        return result;
    }
}
