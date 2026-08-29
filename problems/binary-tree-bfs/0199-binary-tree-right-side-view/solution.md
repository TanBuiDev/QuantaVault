# Solution / Lời giải — 199. Binary Tree Right Side View

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Right side view cần đúng một node visible ở mỗi depth: node ngoài cùng bên phải. BFS có thể lấy phần tử cuối mỗi level, hoặc DFS đi right trước và ghi node đầu tiên khi lần đầu đạt một depth.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Collect cả levels rồi lấy cuối vẫn đúng nhưng lưu thừa. Quan sát chỉ cần một value per depth; BFS queue already knows level boundary, nên khi xử lý index size-1 append node.val.

**State / invariant / data structure cần hiểu trước code.** Queue chứa current level; size snapshot cố định. Invariant node cuối trong thứ tự left-to-right của level là rightmost visible node, kể cả tree có holes.

**Dry run mental theo implementation.** Dry run [1,2,3,null,5,null,4]: levels [1], [2,3], [5,4]; lấy last mỗi level cho [1,3,4].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ đi theo right child chain và bỏ node trái visible khi right side thiếu. Khi nào dùng: one representative per tree depth thường BFS level boundary hoặc DFS first-at-depth.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

BFS từng level từ trái sang phải; phần tử cuối của mỗi level snapshot là node ngoài cùng bên phải tại depth đó.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);

                // Với BFS left-to-right, node cuối trong snapshot của level chính là
                // node phải nhất nhìn thấy được, kể cả khi nó không phải right child.
                if (i == size - 1) result.add(node.val);
            }
        }
        return result;
    }
}
```

## 3. Correctness

Snapshot `size` khóa current depth. Vì nodes của depth này được poll left-to-right, node ở vị trí `size-1` là rightmost node thực sự của level và là node nhìn thấy từ bên phải.

## 4. Complexity

```text
Time: O(n)
Space: O(w)
```

## 5. Common mistakes

- Chỉ lấy `right` child của mỗi parent.
- Dùng queue size sau khi enqueue children.
