# Solution / Lời giải — 199. Binary Tree Right Side View

## 1. Core idea

BFS từng level từ trái sang phải; phần tử cuối của mỗi level snapshot là node ngoài cùng bên phải tại depth đó.

## 2. Optimal Java solution

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

                // Với BFS left-to-right, node cuối trong snapshot của level chính là
                // node phải nhất nhìn thấy được, kể cả khi nó không phải right child.
                if (i == size - 1) result.add(node.val);
            }
        }
        return result;
    }
}
```

## 3. Correctness

Snapshot `size` khóa current depth. Vì nodes của depth này được poll left-to-right, node ở vị trí `size-1` là rightmost node thực sự của level và là node nhìn thấy từ bên phải.

## 4. Complexity

```text
Time: O(n)
Space: O(w)
```

## 5. Common mistakes

- Chỉ lấy `right` child của mỗi parent.
- Dùng queue size sau khi enqueue children.
