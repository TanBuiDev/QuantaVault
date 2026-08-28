# Solution / Lời giải — 112. Path Sum

## 1. Core idea

DFS với `remaining target`. Chỉ tại **leaf** mới được kiểm tra target đã khớp, vì path bắt buộc phải kết thúc ở leaf.

## 2. Optimal Java solution

```java
public class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return false;
        }

        // Equality chỉ có ý nghĩa tại leaf vì đề yêu cầu root-to-leaf path;
        // đạt target ở internal node không cho phép dừng sớm.
        if (root.left == null && root.right == null) {
            return targetSum == root.val;
        }

        // Sau khi dùng current node, child chỉ cần giải bài toán tương tự
        // với phần target còn lại; không cần giữ running path collection.
        int remaining = targetSum - root.val;
        return hasPathSum(root.left, remaining)
            || hasPathSum(root.right, remaining);
    }
}
```

## 3. Correctness

Recursive state hỏi “có path từ current node tới một leaf với tổng bằng remaining không?”. Leaf case trả đúng trực tiếp; internal case trừ current value và OR hai child, bao phủ mọi root-to-leaf continuation.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- Return true ở internal node khi running sum vừa bằng target.
- Empty tree với target 0 trả true sai.
- Prune theo dấu khi values có thể âm.
