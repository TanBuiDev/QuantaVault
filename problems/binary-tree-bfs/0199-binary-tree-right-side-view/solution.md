# Solution / Lời giải — 199. Binary Tree Right Side View

## 1. Core idea / Ý tưởng chính

Duyệt BFS theo từng level từ trái sang phải. Node cuối của mỗi level là node ngoài cùng bên phải, nên thêm value của nó vào answer.

## 2. Algorithm / Thuật toán

1. Root null → trả list rỗng.
2. Đưa root vào queue.
3. Mỗi level lưu `size = queue.size()` và poll đúng `size` node.
4. Enqueue left rồi right child.
5. Khi `i == size - 1`, thêm `node.val`.

## 3. Why it works / Vì sao đúng

BFS gom các node cùng depth thành một batch liên tiếp và xử lý từ trái sang phải. Vì vậy node cuối của batch chính là node phải nhất của level đó.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
                if (i == size - 1) result.add(node.val);
            }
        }
        return result;
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Space:** `O(w)` queue, với `w` là maximum width.

## 6. Common mistakes / Lỗi thường gặp

- Chỉ lấy right child thay vì rightmost node của cả level.
- Dùng queue size sau khi đã enqueue child.
- Quên empty tree.
