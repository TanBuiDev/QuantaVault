public class Solution {
    public void flatten(TreeNode root) {
        TreeNode current = root;

        while (current != null) {
            if (current.left != null) {
                // Rightmost node của left subtree là node cuối cùng của left subtree
                // trong preorder sau khi left subtree tự được flatten về right chain.
                TreeNode predecessor = current.left;
                while (predecessor.right != null) {
                    predecessor = predecessor.right;
                }

                // Bảo toàn original right subtree bằng cách nối nó sau predecessor
                // TRƯỚC khi ghi đè current.right bằng current.left.
                predecessor.right = current.right;
                current.right = current.left;
                current.left = null;
            }

            // Sau rewiring, current.right chính là node kế tiếp trong preorder.
            current = current.right;
        }
    }
}
