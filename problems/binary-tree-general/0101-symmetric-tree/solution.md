# Solution / Lời giải — 101. Symmetric Tree

## 1. Core idea

Hai subtree mirror khi roots bằng nhau, **outer children** mirror nhau và **inner children** mirror nhau. Đây là Same Tree với cách ghép child chéo hướng.

## 2. Optimal Java solution

```java
public class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode left, TreeNode right) {
        // Khi một bên null, mirror chỉ đúng nếu bên kia cũng chính là null.
        if (left == null || right == null) {
            return left == right;
        }

        // Mirror không so cùng hướng: outer child phải khớp outer child đối diện,
        // inner child phải khớp inner child đối diện.
        return left.val == right.val
            && isMirror(left.left, right.right)
            && isMirror(left.right, right.left);
    }
}
```

## 3. Correctness

Helper kiểm tra đúng định nghĩa mirror tại mọi cặp node. Base case xử lý null structure; recursive cases ghép `left.left` với `right.right` và `left.right` với `right.left`, nên induction theo chiều cao chứng minh symmetry toàn cây.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- So left-left với right-left.
- Chỉ so values.
- Dùng Same Tree nguyên xi mà quên cross children.
