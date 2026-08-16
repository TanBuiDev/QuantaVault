# Solution / Lời giải — 230. Kth Smallest Element in a BST

## 1. Core idea / Ý tưởng chính

BST inorder tạo sorted order. Dùng iterative inorder; mỗi lần pop một node là gặp value kế tiếp theo thứ tự tăng dần. Giảm `k`; khi `k == 0`, trả node hiện tại.

## 2. Algorithm / Thuật toán

1. Push toàn bộ left spine từ root.
2. Pop node nhỏ nhất chưa thăm.
3. Giảm `k`; nếu bằng 0 trả `node.val`.
4. Chuyển sang right subtree và tiếp tục push left spine.

## 3. Why it works / Vì sao đúng

Invariant của inorder stack đảm bảo mỗi node được pop theo thứ tự value tăng dần. Vì vậy lần pop thứ `k` chính xác là kth-smallest value. Early return không bỏ qua candidate nào nhỏ hơn vì chúng đã được pop trước đó.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        while (true) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            current = stack.pop();
            if (--k == 0) return current.val;
            current = current.right;
        }
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(h + k)` typical bound before early stop; worst case `O(n)`.
- **Space:** `O(h)`.

## 6. Follow-up

Với frequent updates + queries, augment mỗi node bằng subtree size. Insert/delete cập nhật size dọc path; kth query chọn left/right dựa trên `leftSize`, đạt `O(h)` mỗi operation trên balanced tree.

## 7. Common mistakes / Lỗi thường gặp

- Duyệt preorder thay vì inorder.
- Build toàn bộ sorted list khi chỉ cần kth element.
- Quên `k` là 1-indexed.
