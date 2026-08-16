# Solution / Lời giải — 104. Maximum Depth of Binary Tree

## 1. Core idea / Ý tưởng chính

Dùng DFS đệ quy. Với mỗi node, maximum depth của subtree tại node đó bằng `1` cộng với depth lớn hơn giữa left subtree và right subtree.

## 2. Algorithm / Thuật toán

1. Nếu `root == null`, return `0`.
2. Tính `leftDepth = maxDepth(root.left)`.
3. Tính `rightDepth = maxDepth(root.right)`.
4. Return `1 + Math.max(leftDepth, rightDepth)`.

## 3. Why it works / Vì sao đúng

Mọi đường đi từ node hiện tại tới leaf xa nhất phải đi qua đúng một trong hai child. Đường dài nhất vì vậy là đường dài hơn giữa left và right subtree, cộng thêm node hiện tại. Base case cây rỗng có zero node nên depth `0`. Recurrence áp dụng từ leaf lên root cho kết quả đúng cho toàn cây.

## 4. Dry run / Chạy thử

Với `[3,9,20,null,null,15,7]`:

```text
depth(9) = 1
depth(15) = 1
depth(7) = 1
depth(20) = 1 + max(1,1) = 2
depth(3) = 1 + max(1,2) = 3
```

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` vì mỗi node được thăm đúng một lần.
- **Extra space:** `O(h)` cho recursion stack, với `h` là chiều cao cây; worst case `O(n)`, balanced tree `O(log n)`.

## 7. Alternative — BFS

Có thể BFS theo level và đếm số level. Time vẫn `O(n)`, extra space `O(w)` với `w` là maximum width của tree. DFS recursive ngắn và trực tiếp hơn cho bài hỏi height/depth.

## 8. Edge cases / Trường hợp biên

- Empty tree → `0`.
- Một node → `1`.
- Cây skewed chỉ có một nhánh.
- Cây balanced.

## 9. Common mistakes / Lỗi thường gặp

- Đếm số cạnh thay vì số node và trả sai base case.
- Dùng `min` thay vì `max`.
- Quên `+1` cho current node.
- Nói recursion dùng `O(1)` space.
