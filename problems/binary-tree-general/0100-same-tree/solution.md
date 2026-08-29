# Solution / Lời giải — 100. Same Tree

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Hai trees giống nhau khi tại mọi vị trí tương ứng: cả hai cùng null, hoặc cả hai non-null có cùng value và hai cặp children tương ứng cũng giống nhau.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Serialize rồi so string tạo representation trung gian. Quan sát definition của 'same tree' đã recursive sẵn, nên DFS trực tiếp theo cặp nodes là cách ngắn nhất và O(h) stack.

**State / invariant / data structure cần hiểu trước code.** Mỗi call nhận (p,q) là hai nodes ở cùng structural position. Invariant nếu call trả true thì toàn bộ subtrees rooted tại p và q giống cả shape lẫn values.

**Dry run mental theo implementation.** Dry run [1,2,3] và [1,2,3]: root values match, recurse (2,2) và (3,3), rồi các null-null true. Nếu một side null còn side kia node, fail ngay.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ so preorder values mà bỏ shape/null markers. Khi nào dùng: structural equality của recursive objects thường mirror definition bằng recursion trên paired nodes.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
