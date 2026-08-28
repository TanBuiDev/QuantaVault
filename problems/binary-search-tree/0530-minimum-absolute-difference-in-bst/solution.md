# Solution / Lời giải — 530. Minimum Absolute Difference in BST

## 1. Core idea

Inorder BST là sorted sequence; minimum gap toàn cục nằm giữa hai phần tử kề nhau nên chỉ cần giữ previous value.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int getMinimumDifference(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        Integer previous = null;
        int best = Integer.MAX_VALUE;

        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }

            current = stack.pop();

            // Inorder BST là sorted sequence. Minimum absolute difference của một
            // sorted sequence luôn nằm giữa hai phần tử kề nhau, nên chỉ cần previous.
            if (previous != null) {
                best = Math.min(best, current.val - previous);
            }

            previous = current.val;
            current = current.right;
        }
        return best;
    }
}
```

## 3. Correctness

Với sorted values `a < b < c`, gap `c-a` không thể nhỏ hơn cả hai adjacent gaps. Vì vậy xét mọi adjacent inorder pair là đủ để tìm minimum global.

## 4. Complexity

`O(n)` time, `O(h)` stack.
