# Solution / Lời giải — 102. Binary Tree Level Order Traversal

## 1. Core idea

BFS với queue. Snapshot `queue.size()` ở đầu mỗi vòng để đóng băng boundary của current level; children được enqueue cho vòng kế tiếp.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            // Snapshot size TRƯỚC khi enqueue children. Đây chính xác là số node
            // của current depth; dùng queue.size() động trong loop sẽ trộn level kế tiếp.
            int size = queue.size();
            List<Integer> level = new ArrayList<>(size);

            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);

                // Enqueue left trước right giữ thứ tự từ trái sang phải cho level sau.
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}
```

## 3. Correctness

Tại đầu mỗi vòng, queue prefix có đúng toàn bộ nodes của một depth. Poll đúng `size` nodes tạo current level; children được append sau boundary đó nên trở thành chính batch của depth tiếp theo.

## 4. Complexity

```text
Time: O(n)
Space: O(w)
```

## 5. Common mistakes

- Dùng queue size động trong for-loop.
- Không tách output theo level.
- Enqueue thứ tự không nhất quán nếu cần left-to-right output.
