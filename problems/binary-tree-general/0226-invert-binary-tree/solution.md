# Solution / Lời giải — 226. Invert Binary Tree

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Invert tree nghĩa là tại mọi node đổi chỗ toàn bộ left subtree và right subtree. Vì yêu cầu giống nhau ở mỗi subtree, thao tác local swap + recursion là đủ.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Không cần flatten hay collect nodes. Quan sát sau khi swap hai child references của current node, chỉ cần invert recursively hai subtrees vừa đổi; mỗi node xử lý đúng một lần.

**State / invariant / data structure cần hiểu trước code.** Contract invert(node): khi return, subtree rooted tại node là mirror của subtree ban đầu. Null là base; swap references rồi recurse giữ contract bằng induction.

**Dry run mental theo implementation.** Dry run root4 children2,7: swap thành7,2; tại7 swap children6,9 thành9,6; tại2 swap1,3 thành3,1; kết quả mirror hoàn chỉnh.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là swap values thay vì child subtrees hoặc recurse trên references bị hiểu nhầm. Khi nào dùng: tree transform áp cùng local operation ở mọi node thường là direct DFS recursion.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Recursively invert hai child subtrees rồi swap chúng tại current node. Đây là structural recursion trực tiếp theo định nghĩa mirror.

## 2. Optimal Java solution

```java
public class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {
            return null;
        }

        // Lưu kết quả của cả hai recursive calls trước khi gán để không ghi đè
        // một child reference rồi vô tình recurse/assign từ pointer đã bị thay đổi.
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);

        // Mirror tại current node là đổi chỗ hai subtrees đã được mirror hoàn chỉnh.
        root.left = right;
        root.right = left;
        return root;
    }
}
```

## 3. Correctness

Giả sử recursive calls mirror đúng hai child subtrees. Swap hai kết quả đó phản chiếu edge tại current node; induction từ null/leaf lên root cho toàn tree inverted đúng.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- Swap chỉ root.
- Ghi đè child trước khi giữ reference cần thiết.
- Nhầm invert links với đổi values.
