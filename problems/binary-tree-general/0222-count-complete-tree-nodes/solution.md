# Solution / Lời giải — 222. Count Complete Tree Nodes

## 1. Core idea / Ý tưởng chính

Không cần duyệt mọi node. Với complete tree, đo leftmost height của `root.left` và `root.right`. Nếu bằng nhau thì left subtree là perfect; root + left subtree đóng góp đúng `2^h`, rồi chỉ cần đếm right subtree. Nếu khác nhau thì right subtree là perfect với height nhỏ hơn; root + right subtree cũng tính bằng lũy thừa hai, rồi recurse left.

## 2. Algorithm / Thuật toán

1. Nếu `root == null`, trả `0`.
2. Tính `leftHeight = leftHeight(root.left)` và `rightHeight = leftHeight(root.right)`.
3. Nếu hai height bằng nhau, trả `(1 << leftHeight) + countNodes(root.right)`.
4. Nếu khác nhau, trả `(1 << rightHeight) + countNodes(root.left)`.

## 3. Why it works / Vì sao đúng

Trong complete tree, nếu right subtree có cùng leftmost height với left subtree thì level cuối đã lấp đủ phần left subtree, nên left subtree là perfect. Ngược lại right subtree thiếu một level so với left, và do last level được lấp từ trái sang phải, right subtree phải là perfect ở height nhỏ hơn. Mỗi bước tính chính xác một perfect subtree + root và recurse chỉ vào side còn chưa biết.

## 4. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) return 0;

        int leftHeight = leftHeight(root.left);
        int rightHeight = leftHeight(root.right);

        if (leftHeight == rightHeight) {
            return (1 << leftHeight) + countNodes(root.right);
        }
        return (1 << rightHeight) + countNodes(root.left);
    }

    private int leftHeight(TreeNode node) {
        int height = 0;
        while (node != null) {
            height++;
            node = node.left;
        }
        return height;
    }
}
```

## 5. Complexity / Độ phức tạp

Tree height là `O(log n)`. Mỗi recursive level đo height trong `O(log n)`, và chỉ recurse một side, nên **time `O(log² n)`**, stack **`O(log n)`**.

## 6. Common mistakes / Lỗi thường gặp

- Duyệt DFS toàn bộ tree, không đạt yêu cầu nhanh hơn `O(n)`.
- Dùng công thức perfect-tree nhưng áp dụng cho tree không complete.
- Sai off-by-one giữa height và số node `2^h - 1`.
