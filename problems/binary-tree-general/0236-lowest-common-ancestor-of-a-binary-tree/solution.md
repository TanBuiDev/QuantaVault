# Solution / Lời giải — 236. Lowest Common Ancestor of a Binary Tree

## 1. Core idea

Postorder DFS trả một “evidence” non-null khi subtree chứa target hoặc đã tìm được LCA. Nếu left và right đều non-null tại một node, hai targets tách qua hai phía nên node đó là LCA.

## 2. Optimal Java solution

```java
public class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Return non-null mang nghĩa subtree này đã tìm thấy p/q hoặc LCA của chúng.
        // Trả target ngay cũng xử lý case một target chính là ancestor của target kia.
        if (root == null || root == p || root == q) {
            return root;
        }

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // Evidence xuất hiện ở cả hai child nghĩa p và q tách sang hai phía;
        // current là node thấp nhất nơi hai search paths hội tụ nên chính là LCA.
        if (left != null && right != null) {
            return root;
        }

        // Một phía non-null thì LCA/target candidate vẫn nằm hoàn toàn phía đó;
        // truyền nguyên evidence lên parent thay vì thay nó bằng current.
        return left != null ? left : right;
    }
}
```

## 3. Correctness

Return value của mỗi subtree biểu diễn nơi tìm thấy target/LCA. Hai child cùng non-null là lần thấp nhất evidence của hai targets hội tụ, nên current là LCA. Một child non-null thì answer vẫn nằm phía đó. Base case target tự trả về xử lý ancestor case.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- So node theo value thay identity.
- Quên target có thể là ancestor của target kia.
- Thấy một side non-null đã trả current ngay.
