public class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode left, TreeNode right) {
        // Khi một bên null, mirror chỉ đúng nếu bên kia cũng chính là null.
        if (left == null || right == null) {
            return left == right;
        }

        // Mirror không so cùng hướng: outer child phải khớp outer child đối diện,
        // inner child phải khớp inner child đối diện.
        return left.val == right.val
            && isMirror(left.left, right.right)
            && isMirror(left.right, right.left);
    }
}
