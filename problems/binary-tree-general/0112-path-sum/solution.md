# Solution / Lời giải — 112. Path Sum

## 1. Core idea / Ý tưởng chính

Dùng DFS và mang theo `targetSum` còn lại. Khi ở một node, nếu node là leaf thì kiểm tra trực tiếp `targetSum == node.val`. Nếu chưa phải leaf, trừ `node.val` rồi tiếp tục xuống left hoặc right subtree.

## 2. Algorithm / Thuật toán

1. Nếu `root == null`, trả `false`.
2. Nếu root là leaf, trả `targetSum == root.val`.
3. Tính `remaining = targetSum - root.val`.
4. Trả `hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining)`.

## 3. Why it works / Vì sao đúng

Mỗi recursive call đại diện cho câu hỏi: có root-to-leaf path bắt đầu tại node hiện tại với tổng bằng target còn lại hay không. Tại leaf, chỉ có một path gồm chính leaf nên điều kiện chính xác là target còn lại bằng leaf value. Tại internal node, mọi path hợp lệ phải đi qua node hiện tại rồi tiếp tục vào đúng một child; sau khi trừ node value, phép OR của hai subtree bao phủ toàn bộ khả năng. Theo induction theo chiều cao subtree, thuật toán trả đúng kết quả.

## 4. Dry run / Chạy thử

Với path `5 -> 4 -> 11 -> 2` và target `22`:

```text
22 - 5 = 17
17 - 4 = 13
13 - 11 = 2
leaf value = 2 -> true
```

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) return false;
        if (root.left == null && root.right == null) return targetSum == root.val;

        int remaining = targetSum - root.val;
        return hasPathSum(root.left, remaining)
            || hasPathSum(root.right, remaining);
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` trong worst case.
- **Extra space:** `O(h)` cho recursion stack, với `h` là tree height.

## 7. Alternative

Có thể dùng iterative DFS/BFS và lưu `(node, runningSum)` trong stack/queue. Cách đó tránh recursion nhưng dùng explicit `O(w)` hoặc `O(h)` auxiliary storage.

## 8. Common mistakes / Lỗi thường gặp

- Trả `true` ngay khi running sum bằng target tại internal node.
- Quên empty tree phải là `false`, kể cả `targetSum = 0`.
- Chỉ kiểm tra một child.
- Giả định value luôn dương và dùng pruning không hợp lệ khi có số âm.
