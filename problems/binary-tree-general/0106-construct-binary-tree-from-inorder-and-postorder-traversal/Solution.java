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

        // Map biến mỗi inorder split thành O(1) lookup thay vì scan range lặp lại.
        for (int i = 0; i < inorder.length; i++) {
            inorderIndex.put(inorder[i], i);
        }
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int left, int right) {
        if (left > right) {
            return null;
        }

        // Đọc postorder từ phải sang trái biến left-right-root thành root-right-left.
        // Vì vậy value chưa consume đầu tiên là root của current inorder range.
        int value = postorder[postorderIndex--];
        TreeNode root = new TreeNode(value);
        int middle = inorderIndex.get(value);

        // Global index đang đi theo root-right-left nên bắt buộc dựng right trước;
        // dựng left trước sẽ consume nhầm node thuộc right subtree.
        root.right = build(middle + 1, right);
        root.left = build(left, middle - 1);
        return root;
    }
}
