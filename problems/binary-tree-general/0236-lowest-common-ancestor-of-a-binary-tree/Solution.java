public class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Return non-null mang nghĩa subtree này đã tìm thấy p/q hoặc LCA của chúng.
        // Trả target ngay cũng xử lý case một target chính là ancestor của target kia.
        if (root == null || root == p || root == q) {
            return root;
        }

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // Evidence xuất hiện ở cả hai child nghĩa p và q tách sang hai phía;
        // current là node thấp nhất nơi hai search paths hội tụ nên chính là LCA.
        if (left != null && right != null) {
            return root;
        }

        // Một phía non-null thì LCA/target candidate vẫn nằm hoàn toàn phía đó;
        // truyền nguyên evidence lên parent thay vì thay nó bằng current.
        return left != null ? left : right;
    }
}
