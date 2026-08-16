# Solution / Lời giải — 530. Minimum Absolute Difference in BST

## 1. Core idea / Ý tưởng chính

BST inorder tạo một sorted sequence. Vì minimum difference trong sorted sequence nằm giữa hai phần tử kề nhau, ta duyệt inorder và so sánh mỗi value với previous value.

## 2. Algorithm / Thuật toán

1. Dùng iterative inorder với stack.
2. Mỗi khi pop một node, nếu đã có `previous`, cập nhật `best = min(best, node.val - previous)`.
3. Gán `previous = node.val`, rồi sang right subtree.
4. Trả `best`.

## 3. Why it works / Vì sao đúng

Với mọi cặp không kề nhau `a < b < c`, ta có `c-a >= min(b-a, c-b)`. Do đó một minimum pair luôn có thể chọn là hai phần tử kề nhau trong sorted inorder sequence. Thuật toán xét đúng mọi cặp kề nhau nên tìm được global minimum.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int getMinimumDifference(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        Integer previous = null;
        int best = Integer.MAX_VALUE;

        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            if (previous != null) best = Math.min(best, current.val - previous);
            previous = current.val;
            current = current.right;
        }
        return best;
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(h)` stack.

## 6. Common mistakes / Lỗi thường gặp

- So sánh chỉ parent-child và bỏ qua các inorder neighbors không có quan hệ trực tiếp.
- Lưu toàn bộ inorder array dù chỉ cần previous value.
- Quên BST property khiến inorder được sorted.
