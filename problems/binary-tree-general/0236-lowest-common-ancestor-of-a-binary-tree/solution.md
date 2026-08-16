# Solution / Lời giải — 236. Lowest Common Ancestor of a Binary Tree

## 1. Core idea / Ý tưởng chính

Dùng postorder DFS. Nếu current node là null, `p`, hoặc `q`, trả ngay current node. Sau đó hỏi left và right subtree. Nếu cả hai bên đều trả non-null thì hai target nằm ở hai phía (hoặc đã được đại diện bởi kết quả subtree), nên current node là LCA. Nếu chỉ một bên non-null, truyền kết quả đó lên trên.

## 2. Algorithm / Thuật toán

1. Nếu `root == null || root == p || root == q`, trả `root`.
2. `left = lowestCommonAncestor(root.left, p, q)`.
3. `right = lowestCommonAncestor(root.right, p, q)`.
4. Nếu `left != null && right != null`, trả `root`.
5. Nếu không, trả bên non-null.

## 3. Why it works / Vì sao đúng

Khi một recursive call trả non-null, subtree đó đã tìm thấy ít nhất một target hoặc LCA của cả hai target. Nếu current node nhận non-null từ cả hai child, đây là node thấp nhất nơi evidence của `p` và `q` tách sang hai phía, nên nó là LCA. Nếu chỉ một side có evidence, LCA phải nằm trong side đó hoặc chính evidence đó là một target ancestor; truyền nó lên giữ nguyên candidate đúng. Base case `root == p || root == q` xử lý trực tiếp trường hợp một target là ancestor của target còn lại.

## 4. Dry run / Chạy thử

Với `p = 5`, `q = 1` trong root `3`, left subtree trả node `5`, right subtree trả node `1`, nên node `3` nhận hai kết quả non-null và là LCA.

Với `p = 5`, `q = 4`, DFS tại node `5` trả ngay `5`; vì `4` nằm bên dưới `5`, candidate `5` được truyền lên và cuối cùng trả về đúng ancestor target.

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` worst case.
- **Extra space:** `O(h)` recursion stack.

## 7. Alternative

Có thể dựng parent map rồi đi ancestor chain, nhưng cần `O(n)` extra memory. Với nhiều LCA queries trên cùng tree, preprocessing/binary lifting có thể phù hợp hơn.

## 8. Common mistakes / Lỗi thường gặp

- So sánh node theo value thay vì identity dù đề truyền trực tiếp `TreeNode` references.
- Quên trường hợp `p` là ancestor của `q` hoặc ngược lại.
- Trả root ngay khi chỉ một subtree non-null.
- Dùng parent map không cần thiết cho một query duy nhất.
