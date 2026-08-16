import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        while (true) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            if (--k == 0) return current.val;
            current = current.right;
        }
    }
}
