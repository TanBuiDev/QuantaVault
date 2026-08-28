# Solution / Lời giải — 230. Kth Smallest Element in a BST

## 1. Core idea

BST inorder sinh values tăng dần. Iterative inorder có thể dừng ngay ở lần visit thứ `k` thay vì materialize toàn bộ traversal.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;

        while (true) {
            // Push left spine để stack top luôn là value nhỏ nhất chưa visit
            // trong remaining BST, tức node kế tiếp của inorder traversal.
            while (current != null) {
                stack.push(current);
                current = current.left;
            }

            current = stack.pop();

            // Inorder của BST tăng dần, nên lần pop thứ k chính là kth-smallest;
            // decrement tại thời điểm pop vì đó là lúc node thực sự được visit.
            if (--k == 0) return current.val;

            // Sau current, candidate nhỏ nhất tiếp theo nằm ở leftmost path
            // của right subtree; vòng trong sẽ chuẩn bị path đó.
            current = current.right;
        }
    }
}
```

## 3. Correctness

Stack invariant tạo đúng inorder order; BST property biến order đó thành sorted order, nên node visit thứ `k` là kth-smallest.

## 4. Complexity

`O(h+k)` tới early stop, worst-case `O(n)`; stack `O(h)`.
