# Solution / Lời giải — 100. Same Tree

## 1. Core idea

DFS hai tree song song. Mỗi vị trí phải giống cả **structure** lẫn value; sau khi current pair khớp thì left pair và right pair đều phải khớp.

## 2. Optimal Java solution

```java
public class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // Hai null tại cùng vị trí là một structural match, không phải failure.
        if (p == null && q == null) {
            return true;
        }

        // Chỉ một null chứng minh structure khác; nếu cả hai tồn tại thì value
        // khác nhau cũng đủ fail ngay mà không cần duyệt descendants.
        if (p == null || q == null || p.val != q.val) {
            return false;
        }

        // Same tree đòi hỏi đồng thời cả hai subtree tương ứng giống nhau;
        // short-circuit AND dừng sớm khi một phía đã chứng minh khác biệt.
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
```

## 3. Correctness

Base cases quyết định chính xác structural equality tại current position. Khi cả hai nodes tồn tại và value bằng nhau, subtree chỉ giống khi cả left và right pairs cùng giống. Structural induction cho kết quả đúng tại root.

## 4. Complexity

```text
Time: O(n)
Space: O(h) recursion stack
```

## 5. Common mistakes

- Chỉ so values mà bỏ null structure.
- Dùng OR thay AND.
- Đọc `.val` trước null checks.
