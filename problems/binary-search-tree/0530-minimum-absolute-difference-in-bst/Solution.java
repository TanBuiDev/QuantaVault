import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int getMinimumDifference(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        Integer previous = null;
        int best = Integer.MAX_VALUE;

        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            if (previous != null) best = Math.min(best, current.val - previous);
            previous = current.val;
            current = current.right;
        }
        return best;
    }
}
