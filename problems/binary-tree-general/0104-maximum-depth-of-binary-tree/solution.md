# Solution / Lời giải — 104. Maximum Depth of Binary Tree

## 1. Core idea

Depth của subtree = `1 + max(leftDepth, rightDepth)`, với empty subtree depth `0`.

## 2. Optimal Java solution

```java
public class Solution {
    public int maxDepth(TreeNode root) {
        // Empty subtree đóng góp 0 node vào mọi root-to-leaf path của parent.
        if (root == null) {
            return 0;
        }

        // Mọi path xuống leaf phải chọn đúng một child; path sâu nhất vì thế
        // là current node (+1) cộng depth lớn hơn giữa hai child subtrees.
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

## 3. Correctness

Mọi root-to-leaf path bắt đầu bằng current node rồi đi vào một child. Child có depth lớn hơn tạo path dài nhất; base case empty tree bằng `0`, nên recurrence đúng từ leaf lên root.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- Dùng `min`.
- Quên `+1`.
- Nhầm depth theo edges với definition theo number of nodes.
