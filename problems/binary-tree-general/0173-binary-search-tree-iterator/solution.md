# Solution / Lời giải — 173. Binary Search Tree Iterator

## 1. Core idea / Ý tưởng chính

Duy trì một stack chứa left spine của phần tree chưa được duyệt. Top của stack luôn là node inorder kế tiếp. Constructor push left spine từ root. `next()` pop top; sau đó nếu node đó có right subtree thì push left spine của right subtree. `hasNext()` chỉ kiểm tra stack có rỗng hay không.

## 2. Algorithm / Thuật toán

1. Constructor gọi `pushLeft(root)`.
2. `pushLeft(node)` push node rồi đi `node.left` cho tới null.
3. `next()`:
   - pop node trên top;
   - gọi `pushLeft(node.right)`;
   - trả `node.val`.
4. `hasNext()` trả `!stack.isEmpty()`.

## 3. Why it works / Vì sao đúng

Stack biểu diễn ancestors chưa được trả về cùng leftmost unvisited descendant. Vì mọi left descendant phải đứng trước ancestor trong inorder, top chính là node kế tiếp. Sau khi lấy node đó, phần inorder tiếp theo của subtree nằm trong right subtree của nó; push left spine của right subtree khôi phục invariant. Vì vậy sequence trả về đúng inorder, và với BST cũng là thứ tự tăng dần.

## 4. Dry run / Chạy thử

Với `[7,3,15,null,null,9,20]`:

```text
constructor stack top->bottom: 3, 7
next -> 3
next -> 7, then push 15 and 9 => top is 9
next -> 9
next -> 15, then push 20
next -> 20
```

## 5. Optimal Java solution / Java tối ưu

```java
import java.util.ArrayDeque;
import java.util.Deque;

class BSTIterator {
    private final Deque<TreeNode> stack = new ArrayDeque<>();

    BSTIterator(TreeNode root) {
        pushLeft(root);
    }

    int next() {
        TreeNode node = stack.pop();
        pushLeft(node.right);
        return node.val;
    }

    boolean hasNext() {
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

## 6. Complexity / Độ phức tạp

- Constructor: `O(h)` worst case.
- `hasNext()`: `O(1)`.
- `next()`: amortized `O(1)` because each node is pushed and popped once.
- **Space:** `O(h)`.

## 7. Alternative

Precompute toàn bộ inorder vào array cho `O(1)` operations nhưng tốn `O(n)` memory, không đạt follow-up `O(h)`.

## 8. Common mistakes / Lỗi thường gặp

- Push cả right subtree thay vì chỉ left spine.
- Precompute toàn bộ traversal rồi vẫn khai space là `O(h)`.
- Quên push left spine của `node.right` sau `next()`.
- Dùng queue thay vì stack.
