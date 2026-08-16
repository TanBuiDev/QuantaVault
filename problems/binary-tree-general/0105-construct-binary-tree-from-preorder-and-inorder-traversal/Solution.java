import java.util.HashMap;
import java.util.Map;

public class Solution {
    private int preorderIndex;
    private int[] preorder;
    private Map<Integer, Integer> inorderIndex;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        this.preorderIndex = 0;
        this.inorderIndex = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inorderIndex.put(inorder[i], i);
        }
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int left, int right) {
        if (left > right) return null;
        int value = preorder[preorderIndex++];
        TreeNode root = new TreeNode(value);
        int middle = inorderIndex.get(value);
        root.left = build(left, middle - 1);
        root.right = build(middle + 1, right);
        return root;
    }
}
