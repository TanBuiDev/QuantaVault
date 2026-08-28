public class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }

        int leftHeight = leftHeight(root.left);
        int rightHeight = leftHeight(root.right);

        if (leftHeight == rightHeight) {
            // Trong complete tree, equal heights chứng minh left subtree perfect.
            // (1<<h) = 1 root + (2^h-1) nodes của perfect left subtree.
            return (1 << leftHeight) + countNodes(root.right);
        }

        // Nếu right height nhỏ hơn, last level chưa chạm tới right subtree đầy đủ;
        // right subtree vì thế perfect ở height rightHeight, còn recurse left.
        return (1 << rightHeight) + countNodes(root.left);
    }

    private int leftHeight(TreeNode node) {
        int height = 0;
        while (node != null) {
            height++;
            node = node.left;
        }
        return height;
    }
}
