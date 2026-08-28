public class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // Hai null tại cùng vị trí là một structural match, không phải failure.
        if (p == null && q == null) {
            return true;
        }

        // Chỉ một null chứng minh structure khác; nếu cả hai tồn tại thì value
        // khác nhau cũng đủ fail ngay mà không cần duyệt descendants.
        if (p == null || q == null || p.val != q.val) {
            return false;
        }

        // Same tree đòi hỏi đồng thời cả hai subtree tương ứng giống nhau;
        // short-circuit AND dừng sớm khi một phía đã chứng minh khác biệt.
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
