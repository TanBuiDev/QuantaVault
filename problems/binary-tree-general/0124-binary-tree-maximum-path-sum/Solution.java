public class Solution {
    private int best;

    public int maxPathSum(TreeNode root) {
        // Không dùng 0 vì tree toàn số âm vẫn phải chọn ít nhất một node.
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
    }

    private int gain(TreeNode node) {
        if (node == null) {
            return 0;
        }

        // Negative child contribution chỉ làm path tệ hơn, nên optimal path có thể
        // bỏ hẳn nhánh đó bằng cách clamp contribution về 0.
        int left = Math.max(0, gain(node.left));
        int right = Math.max(0, gain(node.right));

        // Một path hoàn chỉnh có node này là highest point có thể dùng CẢ hai nhánh,
        // nên candidate global là node + left + right.
        best = Math.max(best, node.val + left + right);

        // Nhưng gain trả lên parent phải là một chain không phân nhánh, nên chỉ
        // chọn một child tốt hơn; trả cả hai sẽ tạo degree 3 khi parent nối vào.
        return node.val + Math.max(left, right);
    }
}
