# Solution / Lời giải — 102. Binary Tree Level Order Traversal

## 1. Core idea / Ý tưởng chính

Dùng BFS với queue. Trước mỗi level, lưu `size = queue.size()`. Poll đúng `size` node, thêm value vào một `level` list và enqueue children. Sau đó append `level` vào result.

## 2. Algorithm / Thuật toán

1. Nếu root null, trả list rỗng.
2. Enqueue root.
3. Khi queue chưa rỗng:
   - lưu `size`;
   - tạo `level` list;
   - poll đúng `size` node, append value, enqueue left/right child;
   - append `level` vào result.
4. Trả result.

## 3. Why it works / Vì sao đúng

Tại đầu mỗi vòng, queue chứa toàn bộ node của current level trước các child chưa được enqueue. Processing đúng số lượng đã lưu nên `level` nhận chính xác mọi node cùng depth theo thứ tự trái sang phải. Children được xếp cuối queue cho vòng kế tiếp. Lặp invariant này tạo đúng level-order traversal.

## 4. Optimal Java solution / Java tối ưu

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
            int size = queue.size();
            List<Integer> level = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(w)` cho queue, ngoài output.

## 6. Common mistakes / Lỗi thường gặp

- Dùng queue size động trong for-loop sau khi enqueue child.
- Gộp tất cả value vào một list thay vì tách level.
- Quên empty tree.
