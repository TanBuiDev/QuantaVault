public class Solution {
    public boolean isValidBST(TreeNode root) {
        // long sentinels nằm ngoài toàn bộ miền int nên node có Integer.MIN/MAX_VALUE
        // vẫn được kiểm tra bằng strict bounds mà không cần special case.
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean valid(TreeNode node, long low, long high) {
        if (node == null) return true;

        // BST constraint đến từ TOÀN BỘ ancestors, không chỉ parent; current node
        // phải nằm strict trong intersection range đang được truyền xuống.
        if (node.val <= low || node.val >= high) return false;

        // Đi left siết upper bound; đi right siết lower bound. Strict bounds
        // đồng thời loại duplicate values vì đề định nghĩa BST bằng < và >.
        return valid(node.left, low, node.val)
            && valid(node.right, node.val, high);
    }
}
