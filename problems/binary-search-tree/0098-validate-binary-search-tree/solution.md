# Solution / Lời giải — 98. Validate Binary Search Tree

## 1. Core idea / Ý tưởng chính

Mỗi node phải nằm trong một range được quyết định bởi toàn bộ ancestors, không chỉ parent. Root bắt đầu với `(Long.MIN_VALUE, Long.MAX_VALUE)`. Khi đi left, upper bound trở thành current value; khi đi right, lower bound trở thành current value.

## 2. Algorithm / Thuật toán

1. `valid(root, Long.MIN_VALUE, Long.MAX_VALUE)`.
2. Null node → true.
3. Nếu `node.val <= low || node.val >= high`, trả false.
4. Recursively validate left với `(low, node.val)` và right với `(node.val, high)`.

## 3. Why it works / Vì sao đúng

Range tại mỗi call chính là intersection của tất cả constraints do ancestors tạo ra. Nếu node nằm strict bên trong range, nó thỏa mọi ancestor relation. Việc thu hẹp upper/lower bound khi đi left/right truyền đúng BST rule xuống descendants. Vì mọi node được kiểm tra, toàn tree hợp lệ khi và chỉ khi recursion trả true.

## 4. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public boolean isValidBST(TreeNode root) {
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean valid(TreeNode node, long low, long high) {
        if (node == null) return true;
        if (node.val <= low || node.val >= high) return false;
        return valid(node.left, low, node.val)
            && valid(node.right, node.val, high);
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Space:** `O(h)` recursion stack.

## 6. Common mistakes / Lỗi thường gặp

- Chỉ kiểm tra child với parent, bỏ qua ancestor violation.
- Cho phép duplicate bằng `<=`/`>=` sai chiều.
- Dùng `int` sentinel và làm fail node ở boundary.
