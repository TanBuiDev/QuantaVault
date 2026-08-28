public class Solution {
    public int maxDepth(TreeNode root) {
        // Empty subtree đóng góp 0 node vào mọi root-to-leaf path của parent.
        if (root == null) {
            return 0;
        }

        // Mọi path xuống leaf phải chọn đúng một child; path sâu nhất vì thế
        // là current node (+1) cộng depth lớn hơn giữa hai child subtrees.
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
