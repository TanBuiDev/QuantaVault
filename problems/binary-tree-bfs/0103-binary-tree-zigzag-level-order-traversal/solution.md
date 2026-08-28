# Solution / Lời giải — 103. Binary Tree Zigzag Level Order Traversal

## 1. Core idea

Giữ BFS traversal luôn trái→phải để queue invariant không đổi; chỉ thay cách ghi values của current level: `addLast` khi thuận, `addFirst` khi ngược.

## 2. Optimal Java solution

```java
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
```

## 3. Correctness

Queue vẫn phân level đúng như BFS thường. `addFirst` đảo đúng thứ tự values trong một level mà không tác động thứ tự children trong queue, nên các level sau không bị phá cấu trúc.

## 4. Complexity

```text
Time: O(n)
Space: O(w)
```

## 5. Common mistakes

- Đảo thứ tự enqueue child và làm hỏng traversal level sau.
- Reverse cả list sau mỗi level dù có thể ghi trực tiếp hai đầu.
- Quên toggle direction.
