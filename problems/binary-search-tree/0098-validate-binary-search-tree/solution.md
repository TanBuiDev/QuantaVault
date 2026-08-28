# Solution / Lời giải — 98. Validate Binary Search Tree

## 1. Core idea

Mỗi node phải thỏa range do toàn bộ ancestors tạo ra. DFS truyền strict `(low, high)` xuống hai nhánh thay vì chỉ so child với parent.

## 2. Optimal Java solution

```java
public class Solution {
    public boolean isValidBST(TreeNode root) {
        // long sentinels nằm ngoài toàn bộ miền int nên node có Integer.MIN/MAX_VALUE
        // vẫn được kiểm tra bằng strict bounds mà không cần special case.
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean valid(TreeNode node, long low, long high) {
        if (node == null) return true;

        // BST constraint đến từ TOÀN BỘ ancestors, không chỉ parent; current node
        // phải nằm strict trong intersection range đang được truyền xuống.
        if (node.val <= low || node.val >= high) return false;

        // Đi left siết upper bound; đi right siết lower bound. Strict bounds
        // đồng thời loại duplicate values vì đề định nghĩa BST bằng < và >.
        return valid(node.left, low, node.val)
            && valid(node.right, node.val, high);
    }
}
```

## 3. Correctness

Range ở mỗi call là intersection của mọi ancestor constraint. Node nằm strict trong range iff nó thỏa toàn bộ quan hệ BST phía trên; hai recursive ranges bổ sung đúng constraint của current node.

## 4. Complexity

`O(n)` time, `O(h)` recursion stack.
