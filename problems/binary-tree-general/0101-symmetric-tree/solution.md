# Solution / Lời giải — 101. Symmetric Tree

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Symmetric tree nghĩa là left subtree là ảnh gương của right subtree: outer child của bên trái phải match outer child của bên phải và inner children cũng phải đổi chéo.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Serialize từng subtree rồi reverse dễ rối null positions. Quan sát hàm mirror(a,b) chỉ cần check values rồi recurse a.left với b.right và a.right với b.left.

**State / invariant / data structure cần hiểu trước code.** State là cặp mirror candidates. Invariant mirror(a,b) true iff subtrees có shape/value đối xứng quanh trục; null-null true, one-null false, value mismatch false.

**Dry run mental theo implementation.** Dry run root1 với children2,2: compare outer 3 với3, inner4 với4 theo cross pairs. Case [1,2,2,null,3,null,3] fail vì một cross pair là 3 với null.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là compare left.left với right.left thay vì right.right. Khi nào dùng: mirror/anti-isomorphism tree problems thường recurse trên crossed child pairs.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Hai subtree mirror khi roots bằng nhau, **outer children** mirror nhau và **inner children** mirror nhau. Đây là Same Tree với cách ghép child chéo hướng.

## 2. Optimal Java solution

```java
public class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode left, TreeNode right) {
        // Khi một bên null, mirror chỉ đúng nếu bên kia cũng chính là null.
        if (left == null || right == null) {
            return left == right;
        }

        // Mirror không so cùng hướng: outer child phải khớp outer child đối diện,
        // inner child phải khớp inner child đối diện.
        return left.val == right.val
            && isMirror(left.left, right.right)
            && isMirror(left.right, right.left);
    }
}
```

## 3. Correctness

Helper kiểm tra đúng định nghĩa mirror tại mọi cặp node. Base case xử lý null structure; recursive cases ghép `left.left` với `right.right` và `left.right` với `right.left`, nên induction theo chiều cao chứng minh symmetry toàn cây.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- So left-left với right-left.
- Chỉ so values.
- Dùng Same Tree nguyên xi mà quên cross children.
