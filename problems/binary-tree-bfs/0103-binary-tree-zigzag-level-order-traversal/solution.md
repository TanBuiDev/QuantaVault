# Solution / Lời giải — 103. Binary Tree Zigzag Level Order Traversal

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Zigzag level order vẫn duyệt tree theo levels như BFS; chỉ hướng ghi output đổi trái->phải rồi phải->trái luân phiên. Không cần thay cách enqueue children để hiểu đúng levels.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Reverse cả list sau mỗi odd level đúng nhưng thêm pass. Có thể dùng deque/list addFirst cho odd levels hoặc fill index ngược; observation quan trọng là traversal order và presentation order là hai concerns tách biệt.

**State / invariant / data structure cần hiểu trước code.** Queue giữ frontier BFS bình thường; boolean leftToRight quyết định cách thêm value vào level result. Invariant children luôn enqueue left rồi right, còn output direction chỉ ảnh hưởng container của level hiện tại.

**Dry run mental theo implementation.** Dry run [3,9,20,null,null,15,7]: level0 [3]; level1 values 9,20 nhưng addFirst tạo [20,9]; level2 lại addLast thành [15,7].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là đổi cả enqueue order rồi khó reasoning levels. Khi nào dùng: traversal và output formatting khác nhau nên giữ traversal invariant ổn định, biến đổi chỉ ở bước collect.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Giữ BFS traversal luôn trái→phải để queue invariant không đổi; chỉ thay cách ghi values của current level: `addLast` khi thuận, `addFirst` khi ngược.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        boolean leftToRight = true;

        while (!queue.isEmpty()) {
            int size = queue.size();
            LinkedList<Integer> level = new LinkedList<>();

            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();

                // Chỉ đảo cách ghi OUTPUT, không đảo BFS traversal/enqueue order.
                // Nhờ đó cấu trúc queue của level kế tiếp luôn đúng left-to-right.
                if (leftToRight) level.addLast(node.val);
                else level.addFirst(node.val);

                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            result.add(level);
            // Direction đổi đúng một lần sau khi cả level đã hoàn tất.
            leftToRight = !leftToRight;
        }
        return result;
    }
}
```

## 3. Correctness

Queue vẫn phân level đúng như BFS thường. `addFirst` đảo đúng thứ tự values trong một level mà không tác động thứ tự children trong queue, nên các level sau không bị phá cấu trúc.

## 4. Complexity

```text
Time: O(n)
Space: O(w)
```

## 5. Common mistakes

- Đảo thứ tự enqueue child và làm hỏng traversal level sau.
- Reverse cả list sau mỗi level dù có thể ghi trực tiếp hai đầu.
- Quên toggle direction.
