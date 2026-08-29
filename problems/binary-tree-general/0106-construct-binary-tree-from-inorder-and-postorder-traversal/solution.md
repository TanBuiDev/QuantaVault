# Solution / Lời giải — 106. Construct Binary Tree from Inorder and Postorder Traversal

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Postorder đặt root ở cuối, còn inorder vẫn chia left/right subtrees. Nếu consume postorder từ phải sang trái, sau root ta gặp right subtree trước rồi mới left subtree.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Repeated inorder scans/slices là bottleneck O(n²)/allocations. Map inorder index + một postIndex đi ngược cho O(n), nhưng recursion order phải là right trước left để khớp postorder reverse.

**State / invariant / data structure cần hiểu trước code.** postIndex trỏ root chưa dùng tiếp theo từ cuối; call giữ inorder bounds. Invariant call consume đúng số nodes trong segment; sau tạo root phải build right segment trước để postIndex không lấy nhầm node.

**Dry run mental theo implementation.** Dry run inorder [9,3,15,20,7], postorder [9,15,7,20,3]: lấy3 root; postIndex kế là20 nên build right [15,20,7], rồi mới left [9].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là recurse left trước như preorder version. Khi nào dùng: reconstruction cần align recursion order với hướng đang consume traversal root positions.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Đọc postorder ngược tạo thứ tự `root -> right -> left`. Vì vậy dùng global index giảm dần, split bằng inorder map và dựng **right trước left**.

## 2. Optimal Java solution

```java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    private int postorderIndex;
    private int[] postorder;
    private Map<Integer, Integer> inorderIndex;

    public TreeNode buildTree(int[] inorder, int[] postorder) {
        this.postorder = postorder;
        this.postorderIndex = postorder.length - 1;
        this.inorderIndex = new HashMap<>();

        // Map biến mỗi inorder split thành O(1) lookup thay vì scan range lặp lại.
        for (int i = 0; i < inorder.length; i++) {
            inorderIndex.put(inorder[i], i);
        }
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int left, int right) {
        if (left > right) {
            return null;
        }

        // Đọc postorder từ phải sang trái biến left-right-root thành root-right-left.
        // Vì vậy value chưa consume đầu tiên là root của current inorder range.
        int value = postorder[postorderIndex--];
        TreeNode root = new TreeNode(value);
        int middle = inorderIndex.get(value);

        // Global index đang đi theo root-right-left nên bắt buộc dựng right trước;
        // dựng left trước sẽ consume nhầm node thuộc right subtree.
        root.right = build(middle + 1, right);
        root.left = build(left, middle - 1);
        return root;
    }
}
```

## 3. Correctness

Next value khi đọc postorder ngược là root. Inorder split xác định hai child ranges. Thứ tự ngược là root-right-left nên recursion phải dựng right trước; induction trên range size dựng đúng từng subtree.

## 4. Complexity

```text
Time: O(n)
Space: O(n) map + O(h) stack
```

## 5. Common mistakes

- Dựng left trước right.
- Scan inorder mỗi call.
- Quên decrement index đúng một lần mỗi node.
