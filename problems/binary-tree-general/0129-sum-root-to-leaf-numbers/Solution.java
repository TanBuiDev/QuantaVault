public class Solution {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int prefix) {
        if (node == null) return 0;

        int value = prefix * 10 + node.val;
        if (node.left == null && node.right == null) return value;

        return dfs(node.left, value) + dfs(node.right, value);
    }
}
