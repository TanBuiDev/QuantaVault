# Solution / Lời giải — 226. Invert Binary Tree

## 1. Core idea / Ý tưởng chính

Dùng DFS đệ quy. Mỗi subtree được invert bằng cách invert hai child rồi đổi chỗ chúng. Vì thao tác cần áp dụng cho mọi node, recursion khớp trực tiếp với cấu trúc tree.

## 2. Algorithm / Thuật toán

1. Nếu `root == null`, return `null`.
2. Recursively invert `root.left` và `root.right`.
3. Gán subtree phải đã invert vào `root.left`, subtree trái đã invert vào `root.right`.
4. Return `root`.

## 3. Why it works / Vì sao đúng

Giả sử recursive call invert đúng left và right subtree. Sau khi swap hai subtree đã invert, mọi edge ngay dưới current node được phản chiếu và mọi descendant bên trong cũng đã được phản chiếu. Base tree rỗng đúng hiển nhiên; quy nạp theo structure chứng minh toàn tree được invert chính xác.

## 4. Dry run / Chạy thử

```text
      4                 4
    /   \             /   \
   2     7     ->    7     2
  / \   / \         / \   / \
 1   3 6   9       9   6 3   1
```

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(h)` recursion stack.

## 7. Alternative — BFS

Có thể dùng queue, swap children khi pop từng node. Time `O(n)`, auxiliary space `O(w)` theo maximum width.

## 8. Edge cases / Trường hợp biên

- Empty tree.
- Một node.
- Chỉ có left/right chain.
- Balanced tree.

## 9. Common mistakes / Lỗi thường gặp

- Swap chỉ ở root mà quên descendants.
- Ghi đè một child trước khi lưu reference còn lại.
- Nhầm việc invert values với invert links.
