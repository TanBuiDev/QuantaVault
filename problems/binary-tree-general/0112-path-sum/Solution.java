public class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return false;
        }

        // Equality chỉ có ý nghĩa tại leaf vì đề yêu cầu root-to-leaf path;
        // đạt target ở internal node không cho phép dừng sớm.
        if (root.left == null && root.right == null) {
            return targetSum == root.val;
        }

        // Sau khi dùng current node, child chỉ cần giải bài toán tương tự
        // với phần target còn lại; không cần giữ running path collection.
        int remaining = targetSum - root.val;
        return hasPathSum(root.left, remaining)
            || hasPathSum(root.right, remaining);
    }
}
