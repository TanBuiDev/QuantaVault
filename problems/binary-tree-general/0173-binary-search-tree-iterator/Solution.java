import java.util.ArrayDeque;
import java.util.Deque;

class BSTIterator {
    private final Deque<TreeNode> stack = new ArrayDeque<>();

    BSTIterator(TreeNode root) {
        pushLeft(root);
    }

    int next() {
        TreeNode node = stack.pop();
        pushLeft(node.right);
        return node.val;
    }

    boolean hasNext() {
        return !stack.isEmpty();
    }

    private void pushLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
    }
}
