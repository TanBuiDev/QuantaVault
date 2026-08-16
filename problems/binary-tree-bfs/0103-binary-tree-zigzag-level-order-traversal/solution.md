# Solution / Lời giải — 103. Binary Tree Zigzag Level Order Traversal

## 1. Core idea / Ý tưởng chính

BFS vẫn duyệt node trái sang phải. Với mỗi level, nếu direction là left-to-right thì append value ở cuối; nếu right-to-left thì add value vào đầu `LinkedList`. Sau mỗi level đảo direction.

## 2. Algorithm / Thuật toán

1. Root null → trả list rỗng.
2. Enqueue root, đặt `leftToRight = true`.
3. Với mỗi level:
   - lưu `size`;
   - tạo `LinkedList<Integer> level`;
   - poll đúng `size` node;
   - addLast hoặc addFirst tùy direction;
   - enqueue left rồi right child.
4. Append `level`, đảo direction.

## 3. Why it works / Vì sao đúng

Queue vẫn giữ đúng grouping theo depth. Khi direction thuận, addLast bảo toàn thứ tự BFS. Khi direction ngược, addFirst đảo đúng thứ tự value của cùng level mà không làm thay đổi thứ tự enqueue children, vì vậy level sau vẫn được tạo chính xác.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.*;

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
                if (leftToRight) level.addLast(node.val);
                else level.addFirst(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
            leftToRight = !leftToRight;
        }
        return result;
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(w)` ngoài output.

## 6. Common mistakes / Lỗi thường gặp

- Đảo luôn thứ tự enqueue child, làm sai grouping của các level sau.
- Quên toggle direction.
- Reverse list bằng thao tác `O(k)` không cần thiết ở mỗi level.
