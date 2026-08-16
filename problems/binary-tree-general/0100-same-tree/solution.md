# Solution / Lời giải — 100. Same Tree

## 1. Core idea / Ý tưởng chính

Duyệt hai tree song song bằng DFS. Ở mỗi cặp node `(p, q)`:

- cả hai `null` → subtree giống nhau;
- chỉ một `null` → khác cấu trúc;
- value khác nhau → khác;
- còn lại phải đồng thời giống ở left và right subtree.

## 2. Algorithm / Thuật toán

```text
if p == null && q == null: true
if p == null || q == null: false
if p.val != q.val: false
return isSameTree(p.left,q.left) && isSameTree(p.right,q.right)
```

## 3. Why it works / Vì sao đúng

Base cases kiểm tra đầy đủ sự tồn tại của node ở cùng vị trí. Khi cả hai node tồn tại và value bằng nhau, hai subtree tại vị trí đó chỉ có thể giống nhau nếu cả left pair và right pair cùng giống nhau. Quy nạp theo cấu trúc tree cho thấy kết quả tại root là chính xác.

## 4. Dry run / Chạy thử

Với `p=[1,2,3]`, `q=[1,2,3]`, root `1` bằng nhau; hai left node `2` bằng nhau và có child null tương ứng; hai right node `3` cũng vậy → `true`.

Với `p=[1,2]`, `q=[1,null,2]`, tại left child ta gặp `(2,null)` → `false` ngay vì khác cấu trúc.

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) {
            return true;
        }
        if (p == null || q == null || p.val != q.val) {
            return false;
        }
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` với `n` là số node cần so sánh trước khi kết luận; worst case hai tree giống nhau nên thăm toàn bộ node.
- **Extra space:** `O(h)` recursion stack.

## 7. Alternative — BFS/iterative

Có thể dùng queue chứa các cặp node và kiểm tra cùng logic. Time vẫn `O(n)`, space phụ thuộc maximum width. Recursive DFS ngắn hơn cho structural equality.

## 8. Edge cases / Trường hợp biên

- Cả hai tree rỗng.
- Một tree rỗng, một tree không rỗng.
- Cùng values nhưng khác structure.
- Cùng structure nhưng khác một value sâu bên trong.

## 9. Common mistakes / Lỗi thường gặp

- Chỉ so preorder values mà bỏ qua null markers.
- Dùng OR giữa left/right comparison thay vì AND.
- Truy cập `.val` trước khi xử lý null.
