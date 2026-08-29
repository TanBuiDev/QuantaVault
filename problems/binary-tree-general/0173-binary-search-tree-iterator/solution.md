# Solution / Lời giải — 173. Binary Search Tree Iterator

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** BST Iterator phải trả values theo inorder tăng dần nhưng next() không nên traverse lại tree từ root. Ta chỉ cần giữ path các ancestors mà inorder traversal chưa emit.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Precompute toàn inorder array cho O(n) space. Lazy stack giữ chỉ left spine O(h): constructor pushLeft(root); next pop smallest node rồi pushLeft(node.right) để chuẩn bị successor.

**State / invariant / data structure cần hiểu trước code.** Stack top luôn là node nhỏ nhất chưa trả. Invariant stack chứa một path candidates; mọi left descendants của relevant right subtree đã được push trước khi next lần sau.

**Dry run mental theo implementation.** Dry run BST 7(left3,right15 with9,20): stack [7,3], next pop3; next pop7 rồi push left spine of15 => [15,9], tiếp pop9,15,20 theo sorted order.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là push cả subtree hoặc quên push left chain của right child. Khi nào dùng: lazy traversal iterator thường lưu explicit recursion stack thay vì materialize toàn output.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
