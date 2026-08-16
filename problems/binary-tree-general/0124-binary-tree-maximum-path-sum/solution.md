# Solution / Lời giải — 124. Binary Tree Maximum Path Sum

## 1. Core idea / Ý tưởng chính

Dùng postorder DFS. Mỗi node trả về **maximum downward gain**: tổng tốt nhất của một path bắt đầu tại node và đi xuống tối đa một child, vì path này còn phải có thể nối lên parent mà không phân nhánh. Đồng thời, tại node ta thử một path hoàn chỉnh đi qua node và có thể dùng cả left gain lẫn right gain để cập nhật global best.

## 2. Algorithm / Thuật toán

1. Khởi tạo `best = Integer.MIN_VALUE` để xử lý tree toàn số âm.
2. Với mỗi node, tính `left = max(0, gain(left))`, `right = max(0, gain(right))`.
3. Candidate path kết thúc tại node là `node.val + left + right`; dùng nó cập nhật `best`.
4. Trả về cho parent `node.val + max(left, right)`.
5. Sau DFS, trả `best`.

## 3. Why it works / Vì sao đúng

Mọi simple path có một node cao nhất nơi hai nhánh của path gặp nhau. Khi DFS xử lý node đó, `left` và `right` là contribution tốt nhất hợp lệ từ hai subtree, nên `node.val + left + right` xét đúng path tốt nhất có node đó làm điểm cao nhất. Global maximum qua tất cả node vì vậy bao phủ mọi path. Giá trị trả lên chỉ chọn một nhánh để không tạo path phân nhánh khi nối với parent.

## 4. Dry run / Chạy thử

Với `[-10,9,20,null,null,15,7]`:

```text
15 -> gain 15
7  -> gain 7
20 -> candidate = 20 + 15 + 7 = 42, gain upward = 35
9  -> gain 9
-10 -> candidate = -10 + 9 + 35 = 34
best remains 42
```

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    private int best;

    public int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
    }

    private int gain(TreeNode node) {
        if (node == null) return 0;

        int left = Math.max(0, gain(node.left));
        int right = Math.max(0, gain(node.right));

        best = Math.max(best, node.val + left + right);
        return node.val + Math.max(left, right);
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(h)` recursion stack.

## 7. Alternative

Có thể viết iterative postorder nhưng cần map/stack để lưu gain, phức tạp hơn và không cải thiện asymptotic time.

## 8. Common mistakes / Lỗi thường gặp

- Trả `left + node + right` lên parent, tạo path phân nhánh không hợp lệ.
- Khởi tạo `best = 0`, làm sai tree toàn số âm.
- Không clamp negative child gain về zero.
- Giả định optimal path phải đi qua root.
