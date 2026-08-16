# Solution / Lời giải — 637. Average of Levels in Binary Tree

## 1. Core idea / Ý tưởng chính

BFS từng level. Với mỗi level, lưu số node, cộng value bằng `double`, rồi thêm `sum / size` vào answer.

## 2. Algorithm / Thuật toán

1. Queue bắt đầu với root.
2. Mỗi vòng lưu `size = queue.size()` và `double sum = 0`.
3. Poll đúng `size` node, cộng value và enqueue children.
4. Append `sum / size`.

## 3. Why it works / Vì sao đúng

BFS đảm bảo batch hiện tại chứa đúng tất cả node cùng depth. Vì `sum` cộng đúng value của batch và `size` là số node trong batch, thương của chúng chính xác là average của level.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.*;
public class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> ans = new ArrayList<>();
        if (root == null) return ans;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            double sum = 0;
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                sum += node.val;
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            ans.add(sum / size);
        }
        return ans;
    }
}
```

## 5. Complexity / Độ phức tạp

`O(n)` time, `O(w)` queue space.

## 6. Common mistakes / Lỗi thường gặp

- Dùng `int` sum và overflow.
- Chia integer trước khi convert sang floating point.
- Dùng queue size đã thay đổi sau khi enqueue child.
