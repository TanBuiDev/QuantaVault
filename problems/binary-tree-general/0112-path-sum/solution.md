# Solution / Lời giải — 112. Path Sum

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Path Sum chỉ chấp nhận root-to-leaf path. Khi đi xuống, ta có thể trừ node.val khỏi target còn lại; tới leaf chỉ cần kiểm tra remainder có đúng leaf value/0 theo formulation.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Liệt kê mọi path thành lists dùng extra memory. Quan sát mỗi branch độc lập và chỉ cần running remaining sum, nên DFS có thể short-circuit ngay khi một child tìm được path hợp lệ.

**State / invariant / data structure cần hiểu trước code.** remaining đại diện số tổng còn phải đạt trên path từ node hiện tại xuống leaf. Invariant ancestors đã được trừ khỏi original target; chỉ tại leaf mới được kết luận equality.

**Dry run mental theo implementation.** Dry run target22 trên 5->4->11->2: remaining 22,17,13,2 rồi leaf2 làm remainder sau node thành0 nên true; node nội bộ có sum đúng nhưng chưa leaf không được accept.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là return true tại node non-leaf khi running sum đạt target. Khi nào dùng: root-to-leaf constraints thường carry accumulated/remaining state qua DFS và validate ở leaf.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
