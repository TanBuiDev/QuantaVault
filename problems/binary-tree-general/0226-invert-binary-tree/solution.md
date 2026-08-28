# Solution / Lời giải — 226. Invert Binary Tree

## 1. Core idea

Recursively invert hai child subtrees rồi swap chúng tại current node. Đây là structural recursion trực tiếp theo định nghĩa mirror.

## 2. Optimal Java solution

```java
public class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }

        // Lưu kết quả của cả hai recursive calls trước khi gán để không ghi đè
        // một child reference rồi vô tình recurse/assign từ pointer đã bị thay đổi.
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);

        // Mirror tại current node là đổi chỗ hai subtrees đã được mirror hoàn chỉnh.
        root.left = right;
        root.right = left;
        return root;
    }
}
```

## 3. Correctness

Giả sử recursive calls mirror đúng hai child subtrees. Swap hai kết quả đó phản chiếu edge tại current node; induction từ null/leaf lên root cho toàn tree inverted đúng.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- Swap chỉ root.
- Ghi đè child trước khi giữ reference cần thiết.
- Nhầm invert links với đổi values.
