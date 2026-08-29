# Solution / Lời giải — 104. Maximum Depth of Binary Tree

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Depth của một node là 1 cộng depth lớn hơn giữa hai children, vì path root-to-leaf dài nhất sau node hiện tại phải chọn đúng một nhánh trái hoặc phải.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** BFS đếm levels đúng; DFS recursion còn trực tiếp hơn vì definition depth tự phân rã. Null subtree có depth0 là base case tự nhiên.

**State / invariant / data structure cần hiểu trước code.** Hàm maxDepth(node) trả đúng maximum number of nodes trên path từ node xuống leaf. Invariant return value là thông tin parent cần; không cần global variable.

**Dry run mental theo implementation.** Dry run node20 có leaves15,7: hai child trả1 nên20 trả2; root3 có left9 trả1 và right20 trả2 nên root trả1+max(1,2)=3.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là cộng cả left+right như count nodes. Khi nào dùng: tree metric 'longest downward path' thường return 1 + max(child metrics).
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Depth của subtree = `1 + max(leftDepth, rightDepth)`, với empty subtree depth `0`.

## 2. Optimal Java solution

```java
public class Solution {
    public int maxDepth(TreeNode root) {
        // Empty subtree đóng góp 0 node vào mọi root-to-leaf path của parent.
        if (root == null) {
            return 0;
        }

        // Mọi path xuống leaf phải chọn đúng một child; path sâu nhất vì thế
        // là current node (+1) cộng depth lớn hơn giữa hai child subtrees.
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

## 3. Correctness

Mọi root-to-leaf path bắt đầu bằng current node rồi đi vào một child. Child có depth lớn hơn tạo path dài nhất; base case empty tree bằng `0`, nên recurrence đúng từ leaf lên root.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- Dùng `min`.
- Quên `+1`.
- Nhầm depth theo edges với definition theo number of nodes.
