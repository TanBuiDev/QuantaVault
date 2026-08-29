# Solution / Lời giải — 637. Average of Levels in Binary Tree

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Average of Levels cần sum và số node của từng depth. BFS đã gom đúng một frontier level, nên chỉ snapshot size, cộng values của đúng size nodes rồi chia.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DFS với depth arrays cũng đúng. BFS tránh bookkeeping depth riêng; bottleneck duy nhất là không để children mới enqueue bị tính vào denominator current level.

**State / invariant / data structure cần hiểu trước code.** size=queue.size() trước loop là count cố định của current level. sum nên dùng double/long phù hợp để tránh overflow; sau exactly size polls, queue chứa level kế tiếp.

**Dry run mental theo implementation.** Dry run [3,9,20,null,null,15,7]: level0 sum3/count1=3; level1 29/2=14.5; level2 22/2=11.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dùng queue.size() sau khi enqueue children hoặc integer division. Khi nào dùng: per-level aggregate trong tree là BFS frontier-size + accumulator.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

BFS theo level; snapshot size làm mẫu số và `double` accumulator tránh overflow/integer division.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> ans = new ArrayList<>();
        if (root == null) return ans;

        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);

        while (!q.isEmpty()) {
            int size = q.size();

            // Dùng double ngay từ accumulator tránh integer overflow khi một level
            // có nhiều giá trị lớn, đồng thời phép chia sau giữ floating-point precision.
            double sum = 0;
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                sum += node.val;
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }

            // size là snapshot của current level, không phải queue.size() sau enqueue.
            ans.add(sum / size);
        }
        return ans;
    }
}
```

## 3. Correctness

Mỗi BFS batch chứa đúng một depth. `sum` cộng mọi node của batch và `size` là số node ban đầu của batch, nên `sum/size` là average chính xác của level.

## 4. Complexity

```text
Time: O(n)
Space: O(w)
```

## 5. Common mistakes

- Dùng `int` sum.
- Integer division.
- Dùng queue size đã thay đổi làm mẫu số.
