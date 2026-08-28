# Solution / Lời giải — 637. Average of Levels in Binary Tree

## 1. Core idea

BFS theo level; snapshot size làm mẫu số và `double` accumulator tránh overflow/integer division.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> ans = new ArrayList<>();
        if (root == null) return ans;

        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);

        while (!q.isEmpty()) {
            int size = q.size();

            // Dùng double ngay từ accumulator tránh integer overflow khi một level
            // có nhiều giá trị lớn, đồng thời phép chia sau giữ floating-point precision.
            double sum = 0;
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                sum += node.val;
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }

            // size là snapshot của current level, không phải queue.size() sau enqueue.
            ans.add(sum / size);
        }
        return ans;
    }
}
```

## 3. Correctness

Mỗi BFS batch chứa đúng một depth. `sum` cộng mọi node của batch và `size` là số node ban đầu của batch, nên `sum/size` là average chính xác của level.

## 4. Complexity

```text
Time: O(n)
Space: O(w)
```

## 5. Common mistakes

- Dùng `int` sum.
- Integer division.
- Dùng queue size đã thay đổi làm mẫu số.
