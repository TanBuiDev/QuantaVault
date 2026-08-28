# Solution / Lời giải — 114. Flatten Binary Tree to Linked List

## 1. Core idea

Preorder tại node là `node -> left subtree -> right subtree`. Nếu có left, nối original right vào rightmost node của left subtree rồi chuyển left sang right; lặp dọc right chain.

## 2. Optimal Java solution

```java
public class Solution {
    public void flatten(TreeNode root) {
        TreeNode current = root;

        while (current != null) {
            if (current.left != null) {
                // Rightmost node của left subtree là node cuối cùng của left subtree
                // trong preorder sau khi left subtree tự được flatten về right chain.
                TreeNode predecessor = current.left;
                while (predecessor.right != null) {
                    predecessor = predecessor.right;
                }

                // Bảo toàn original right subtree bằng cách nối nó sau predecessor
                // TRƯỚC khi ghi đè current.right bằng current.left.
                predecessor.right = current.right;
                current.right = current.left;
                current.left = null;
            }

            // Sau rewiring, current.right chính là node kế tiếp trong preorder.
            current = current.right;
        }
    }
}
```

## 3. Correctness

Rewiring biến local order thành `current -> left subtree -> original right subtree` mà không đổi internal order của hai subtrees. Lặp cho mọi node làm tất cả left pointers null và right chain đúng preorder.

## 4. Complexity

```text
Time: O(n) amortized
Space: O(1)
```

## 5. Common mistakes

- Ghi đè right trước khi bảo toàn original right subtree.
- Quên set left null.
- Tạo node mới thay vì in-place.
