# Solution / Lời giải — 230. Kth Smallest Element in a BST

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** BST inorder traversal trả values tăng dần, nên kth smallest chính là node thứ k được visit theo inorder. Không cần sort lại vì tree ordering đã encode thứ tự.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Collect toàn inorder O(n) space/time rồi index là đơn giản. Iterative stack có thể dừng ngay node thứ k, dùng O(h) space và không visit phần tree sau đáp án.

**State / invariant / data structure cần hiểu trước code.** Stack mô phỏng recursion và chứa path ancestors chưa visit. Sau push-left spine, pop luôn cho next smallest; decrement k mỗi pop, rồi chuyển sang right subtree và push left spine mới.

**Dry run mental theo implementation.** Dry run BST [3,1,4,null,2], k=1: push3,1; pop1 làm k=0 nên trả1 ngay. Với k=3, sequence pops 1,2,3 rồi trả3.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là count khi push thay vì khi inorder visit/pop. Khi nào dùng: order-statistics đơn query trên BST có thể khai thác inorder; nhiều queries cần subtree sizes augmentation.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

BST inorder sinh values tăng dần. Iterative inorder có thể dừng ngay ở lần visit thứ `k` thay vì materialize toàn bộ traversal.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;

        while (true) {
            // Push left spine để stack top luôn là value nhỏ nhất chưa visit
            // trong remaining BST, tức node kế tiếp của inorder traversal.
            while (current != null) {
                stack.push(current);
                current = current.left;
            }

            current = stack.pop();

            // Inorder của BST tăng dần, nên lần pop thứ k chính là kth-smallest;
            // decrement tại thời điểm pop vì đó là lúc node thực sự được visit.
            if (--k == 0) return current.val;

            // Sau current, candidate nhỏ nhất tiếp theo nằm ở leftmost path
            // của right subtree; vòng trong sẽ chuẩn bị path đó.
            current = current.right;
        }
    }
}
```

## 3. Correctness

Stack invariant tạo đúng inorder order; BST property biến order đó thành sorted order, nên node visit thứ `k` là kth-smallest.

## 4. Complexity

`O(h+k)` tới early stop, worst-case `O(n)`; stack `O(h)`.
