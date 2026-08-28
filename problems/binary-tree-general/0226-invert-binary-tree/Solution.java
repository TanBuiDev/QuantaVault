public class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }

        // Lưu kết quả của cả hai recursive calls trước khi gán để không ghi đè
        // một child reference rồi vô tình recurse/assign từ pointer đã bị thay đổi.
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);

        // Mirror tại current node là đổi chỗ hai subtrees đã được mirror hoàn chỉnh.
        root.left = right;
        root.right = left;
        return root;
    }
}
