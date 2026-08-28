# Solution / Lời giải — 105. Construct Binary Tree from Preorder and Inorder Traversal

## 1. Core idea

Preorder cho root trước; inorder cho ranh giới left/root/right. Global `preorderIndex` consume nodes theo đúng preorder, còn map vị trí inorder cho split `O(1)`.

## 2. Optimal Java solution

```java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    private int preorderIndex;
    private int[] preorder;
    private Map<Integer, Integer> inorderIndex;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        this.preorderIndex = 0;
        this.inorderIndex = new HashMap<>();

        // Pre-index inorder để mỗi root split là O(1); scan lại mỗi recursive
        // range sẽ làm skewed tree suy biến thành O(n^2).
        for (int i = 0; i < inorder.length; i++) {
            inorderIndex.put(inorder[i], i);
        }
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int left, int right) {
        if (left > right) {
            return null;
        }

        // Preorder là root -> left -> right, nên phần tử chưa consume đầu tiên
        // luôn là root của inorder range hiện tại.
        int value = preorder[preorderIndex++];
        TreeNode root = new TreeNode(value);
        int middle = inorderIndex.get(value);

        // Phải dựng left trước right vì global preorderIndex cũng consume toàn bộ
        // left subtree trước khi tới block của right subtree.
        root.left = build(left, middle - 1);
        root.right = build(middle + 1, right);
        return root;
    }
}
```

## 3. Correctness

Trong mỗi inorder range, next preorder value là root duy nhất. Root index chia chính xác node sets của left/right subtree. Dựng left trước right khớp thứ tự consume preorder, nên induction trên range size dựng đúng toàn cây.

## 4. Complexity

```text
Time: O(n)
Space: O(n) map + O(h) stack
```

## 5. Common mistakes

- Dựng right trước left.
- Scan inorder lặp lại.
- Không giới hạn recursion bằng inorder boundaries.
