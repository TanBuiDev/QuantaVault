# Solution / Lời giải — 173. Binary Search Tree Iterator

## 1. Core idea

Lazy inorder: stack giữ left spine của phần tree chưa duyệt; top luôn là inorder successor tiếp theo. Pop một node rồi push left spine của right subtree.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

class BSTIterator {
    private final Deque<TreeNode> stack = new ArrayDeque<>();

    BSTIterator(TreeNode root) {
        // Stack giữ left spine để top luôn là inorder node nhỏ nhất chưa trả về.
        pushLeft(root);
    }

    int next() {
        TreeNode node = stack.pop();

        // Sau node trong inorder là leftmost node của right subtree nếu có;
        // pushLeft chuẩn bị chính xác successor đó cùng ancestor chain của nó.
        pushLeft(node.right);
        return node.val;
    }

    boolean hasNext() {
        // Stack rỗng iff không còn node chưa visit trong lazy inorder traversal.
        return !stack.isEmpty();
    }

    private void pushLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
    }
}
```

## 3. Correctness

Invariant: top là leftmost unvisited node trong current remaining inorder traversal. `next()` trả node đó rồi push left spine của right subtree, khôi phục invariant. Với BST, inorder values tăng dần.

## 4. Complexity

```text
next(): amortized O(1)
hasNext(): O(1)
Space: O(h)
```

Mỗi node push/pop đúng một lần.

## 5. Common mistakes

- Precompute toàn bộ inorder rồi claim O(h) space.
- Quên xử lý right subtree sau pop.
- Push toàn right subtree thay vì chỉ left spine.
