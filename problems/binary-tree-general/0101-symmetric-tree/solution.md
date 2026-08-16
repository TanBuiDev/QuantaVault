# Solution / Lời giải — 101. Symmetric Tree

## 1. Core idea / Ý tưởng chính

Kiểm tra hai subtree của root có phải mirror của nhau không. Với hai node `left` và `right`, chúng mirror nếu:

- cả hai cùng null; hoặc
- cả hai tồn tại, cùng value, `left.left` mirror `right.right`, và `left.right` mirror `right.left`.

## 2. Algorithm / Thuật toán

1. Nếu `root == null`, return `true`.
2. Return `isMirror(root.left, root.right)`.
3. Trong helper:
   - cả hai null → true;
   - chỉ một null → false;
   - value khác → false;
   - recurse hai cặp outer/inner children.

## 3. Why it works / Vì sao đúng

Hai subtree là mirror khi root tương ứng bằng nhau và các nhánh ngoài phản chiếu nhau, đồng thời các nhánh trong cũng phản chiếu nhau. Helper kiểm tra đúng ba điều kiện đó tại mọi level. Base cases xử lý cấu trúc null, nên induction theo cấu trúc tree chứng minh toàn cây symmetric khi và chỉ khi helper trả true.

## 4. Dry run / Chạy thử

Với `[1,2,2,3,4,4,3]`:

- `2` trái và `2` phải bằng nhau.
- outer: `3` trái so với `3` phải → match.
- inner: `4` trái so với `4` phải → match.
- các child null cũng match → `true`.

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public boolean isSymmetric(TreeNode root) {
        return root == null || isMirror(root.left, root.right);
    }

    private boolean isMirror(TreeNode left, TreeNode right) {
        if (left == null || right == null) {
            return left == right;
        }
        return left.val == right.val
            && isMirror(left.left, right.right)
            && isMirror(left.right, right.left);
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(h)` recursion stack.

## 7. Alternative — Iterative queue

Đưa các node vào queue theo cặp mirror: `(left.left,right.right)` và `(left.right,right.left)`. Time `O(n)`, space `O(w)`. Đây là follow-up iterative tự nhiên.

## 8. Edge cases / Trường hợp biên

- Một node → symmetric.
- Same values nhưng structure khác → false.
- Một phía có null ở vị trí mirror còn phía kia có node → false.

## 9. Common mistakes / Lỗi thường gặp

- So `left.left` với `right.left` thay vì mirror direction.
- Chỉ so values mà bỏ qua null structure.
- Dùng cùng logic của Same Tree mà không đổi cặp child.
