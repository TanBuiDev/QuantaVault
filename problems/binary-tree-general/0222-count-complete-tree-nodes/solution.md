# Solution / Lời giải — 222. Count Complete Tree Nodes

## 1. Core idea

Complete-tree structure cho phép mỗi bước nhận diện một child subtree là **perfect** từ leftmost heights, tính số node của nó bằng power of two và chỉ recurse vào side còn lại.

## 2. Optimal Java solution

```java
public class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }

        int leftHeight = leftHeight(root.left);
        int rightHeight = leftHeight(root.right);

        if (leftHeight == rightHeight) {
            // Trong complete tree, equal heights chứng minh left subtree perfect.
            // (1<<h) = 1 root + (2^h-1) nodes của perfect left subtree.
            return (1 << leftHeight) + countNodes(root.right);
        }

        // Nếu right height nhỏ hơn, last level chưa chạm tới right subtree đầy đủ;
        // right subtree vì thế perfect ở height rightHeight, còn recurse left.
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

## 3. Correctness

Trong complete tree, equal child heights nghĩa left subtree đã full/perfect; unequal heights nghĩa right subtree là perfect level thấp hơn. Mỗi branch tính chính xác root + perfect subtree và recurse vào subtree duy nhất chưa xác định.

## 4. Complexity

```text
Time: O(log^2 n)
Space: O(log n)
```

## 5. Common mistakes

- Dùng trick này cho arbitrary tree.
- Sai `2^h-1` vs `(1<<h)` khi đã cộng root chung.
- Duyệt toàn bộ nodes và bỏ follow-up.
