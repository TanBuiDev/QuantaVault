import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        boolean leftToRight = true;

        while (!queue.isEmpty()) {
            int size = queue.size();
            LinkedList<Integer> level = new LinkedList<>();

            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();

                // Chỉ đảo cách ghi OUTPUT, không đảo BFS traversal/enqueue order.
                // Nhờ đó cấu trúc queue của level kế tiếp luôn đúng left-to-right.
                if (leftToRight) level.addLast(node.val);
                else level.addFirst(node.val);

                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            result.add(level);
            // Direction đổi đúng một lần sau khi cả level đã hoàn tất.
            leftToRight = !leftToRight;
        }
        return result;
    }
}
