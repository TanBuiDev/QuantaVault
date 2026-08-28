public class Solution {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int prefix) {
        if (node == null) {
            return 0;
        }

        // Append một decimal digit d vào number prefix chính là prefix*10+d;
        // không cần String/path buffer và state truyền xuống vẫn O(1) mỗi frame.
        int value = prefix * 10 + node.val;

        // Chỉ leaf đại diện cho một root-to-leaf number hoàn chỉnh; internal prefix
        // chưa được cộng để tránh đếm một path chưa kết thúc.
        if (node.left == null && node.right == null) {
            return value;
        }

        // Left/right leaves là disjoint path sets nên tổng subtree là tổng hai kết quả.
        return dfs(node.left, value) + dfs(node.right, value);
    }
}
