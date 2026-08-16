public class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) return 0;

        int leftHeight = leftHeight(root.left);
        int rightHeight = leftHeight(root.right);

        if (leftHeight == rightHeight) {
            return (1 << leftHeight) + countNodes(root.right);
        }
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
