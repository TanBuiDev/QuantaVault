# Solution / Lời giải — 98. Validate Binary Search Tree

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** BST không chỉ yêu cầu node.left < node < node.right ngay tại parent; mọi node trong cả left subtree phải nhỏ hơn node và mọi node trong right subtree phải lớn hơn. Case [5,4,6,null,null,3,7] cho thấy local checks có thể bị lừa.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Chỉ so mỗi node với children là bottleneck logic sai. Quan sát mỗi node kế thừa một khoảng giá trị hợp lệ từ ancestors: đi trái hạ upper bound xuống node.val, đi phải nâng lower bound lên node.val.

**State / invariant / data structure cần hiểu trước code.** DFS state là (node, lower, upper). Invariant mọi node trong call phải thỏa lower < node.val < upper; bounds encode toàn bộ constraints từ ancestors, không chỉ parent hiện tại.

**Dry run mental theo implementation.** Dry run root5: left subtree nhận (-∞,5), right nhận (5,+∞). Node3 nằm trong right subtree của5 dù là left child của6 nhận bounds (5,6); 3<=5 nên reject đúng.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ compare direct children hoặc dùng <= sai với BST strict uniqueness. Khi nào dùng: tree ordering constraints xuyên nhiều levels thường truyền allowed range qua recursion.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Mỗi node phải thỏa range do toàn bộ ancestors tạo ra. DFS truyền strict `(low, high)` xuống hai nhánh thay vì chỉ so child với parent.

## 2. Optimal Java solution

```java
public class Solution {
    public boolean isValidBST(TreeNode root) {
        // long sentinels nằm ngoài toàn bộ miền int nên node có Integer.MIN/MAX_VALUE
        // vẫn được kiểm tra bằng strict bounds mà không cần special case.
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean valid(TreeNode node, long low, long high) {
        if (node == null) return true;

        // BST constraint đến từ TOÀN BỘ ancestors, không chỉ parent; current node
        // phải nằm strict trong intersection range đang được truyền xuống.
        if (node.val <= low || node.val >= high) return false;

        // Đi left siết upper bound; đi right siết lower bound. Strict bounds
        // đồng thời loại duplicate values vì đề định nghĩa BST bằng < và >.
        return valid(node.left, low, node.val)
            && valid(node.right, node.val, high);
    }
}
```

## 3. Correctness

Range ở mỗi call là intersection của mọi ancestor constraint. Node nằm strict trong range iff nó thỏa toàn bộ quan hệ BST phía trên; hai recursive ranges bổ sung đúng constraint của current node.

## 4. Complexity

`O(n)` time, `O(h)` recursion stack.
