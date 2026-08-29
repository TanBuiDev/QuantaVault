# Solution / Lời giải — 102. Binary Tree Level Order Traversal

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Level-order output gom nodes theo khoảng cách từ root: root ở level0, children level1, grandchildren level2. Queue tự nhiên giữ frontier theo đúng thứ tự BFS.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** DFS với depth cũng làm được, nhưng queue cho mental model trực tiếp. Bottleneck để tách levels là biết bao nhiêu nodes thuộc frontier hiện tại; lấy queue.size() ở đầu mỗi vòng giải việc đó.

**State / invariant / data structure cần hiểu trước code.** Queue trước một level chứa đúng nodes của level đó. size cố định trước khi poll; children được offer trong lúc xử lý nhưng thuộc level kế tiếp và không được trộn vào current list.

**Dry run mental theo implementation.** Dry run [3,9,20,null,null,15,7]: queue [3], size1 -> [3]; sau đó queue [9,20], size2 -> [9,20]; rồi [15,7].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là loop theo queue.size() động khi đang offer children, làm gộp levels. Khi nào dùng: shortest layer/level grouping trong unweighted structures là BFS frontier-size pattern.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

BFS với queue. Snapshot `queue.size()` ở đầu mỗi vòng để đóng băng boundary của current level; children được enqueue cho vòng kế tiếp.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            // Snapshot size TRƯỚC khi enqueue children. Đây chính xác là số node
            // của current depth; dùng queue.size() động trong loop sẽ trộn level kế tiếp.
            int size = queue.size();
            List<Integer> level = new ArrayList<>(size);

            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);

                // Enqueue left trước right giữ thứ tự từ trái sang phải cho level sau.
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}
```

## 3. Correctness

Tại đầu mỗi vòng, queue prefix có đúng toàn bộ nodes của một depth. Poll đúng `size` nodes tạo current level; children được append sau boundary đó nên trở thành chính batch của depth tiếp theo.

## 4. Complexity

```text
Time: O(n)
Space: O(w)
```

## 5. Common mistakes

- Dùng queue size động trong for-loop.
- Không tách output theo level.
- Enqueue thứ tự không nhất quán nếu cần left-to-right output.
