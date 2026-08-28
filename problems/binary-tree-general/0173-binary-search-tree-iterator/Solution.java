import java.util.ArrayDeque;
import java.util.Deque;

class BSTIterator {
    private final Deque<TreeNode> stack = new ArrayDeque<>();

    BSTIterator(TreeNode root) {
        // Stack giữ left spine để top luôn là inorder node nhỏ nhất chưa trả về.
        pushLeft(root);
    }

    int next() {
        TreeNode node = stack.pop();

        // Sau node trong inorder là leftmost node của right subtree nếu có;
        // pushLeft chuẩn bị chính xác successor đó cùng ancestor chain của nó.
        pushLeft(node.right);
        return node.val;
    }

    boolean hasNext() {
        // Stack rỗng iff không còn node chưa visit trong lazy inorder traversal.
        return !stack.isEmpty();
    }

    private void pushLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
    }
}
