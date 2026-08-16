import java.util.HashMap;
import java.util.Map;

public class Solution {
    private int postorderIndex;
    private int[] postorder;
    private Map<Integer, Integer> inorderIndex;

    public TreeNode buildTree(int[] inorder, int[] postorder) {
        this.postorder = postorder;
        this.postorderIndex = postorder.length - 1;
        this.inorderIndex = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inorderIndex.put(inorder[i], i);
        }
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int left, int right) {
        if (left > right) return null;
        int value = postorder[postorderIndex--];
        TreeNode root = new TreeNode(value);
        int middle = inorderIndex.get(value);
        root.right = build(middle + 1, right);
        root.left = build(left, middle - 1);
        return root;
    }
}
