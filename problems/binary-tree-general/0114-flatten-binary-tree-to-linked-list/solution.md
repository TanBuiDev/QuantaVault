# Solution / Lời giải — 114. Flatten Binary Tree to Linked List

## 1. Core idea / Ý tưởng chính

Với mỗi node có `left`, preorder sẽ đi toàn bộ left subtree trước khi đi original right subtree. Node cuối của left subtree trong preorder chính là node ngoài cùng bên phải khi lần theo `right` từ `current.left`. Ta nối original right subtree vào sau node đó, rồi chuyển toàn bộ left subtree sang `current.right` và xóa `current.left`.

## 2. Algorithm / Thuật toán

1. Đặt `current = root`.
2. Trong khi `current != null`:
   - nếu `current.left != null`, tìm `predecessor` là rightmost node của left subtree;
   - `predecessor.right = current.right`;
   - `current.right = current.left`;
   - `current.left = null`;
   - tiến `current = current.right`.
3. Không cần trả về gì vì tree được mutate in-place.

## 3. Why it works / Vì sao đúng

Tại mỗi node, nếu có left subtree thì preorder mong muốn là `current -> left subtree -> original right subtree`. Rewiring đặt original right subtree ngay sau node cuối của left subtree, đồng thời biến left subtree thành right chain bắt đầu ngay sau `current`. Vì không thay đổi thứ tự nội bộ của left hay right subtree, preorder toàn bộ được bảo toàn. Sau khi xử lý mọi node, tất cả left pointer đều null và right chain chính là preorder sequence.

## 4. Dry run / Chạy thử

```text
root = [1,2,5,3,4,null,6]
```

- Tại `1`, rightmost của left subtree `2` là `4`; nối `4.right = 5`, rồi `1.right = 2`, `1.left = null`.
- Tại `2`, rightmost của left subtree là `3`; nối `3.right = 4`, rồi `2.right = 3`, `2.left = null`.
- Tiếp tục theo right chain thu được `1 -> 2 -> 3 -> 4 -> 5 -> 6`.

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public void flatten(TreeNode root) {
        TreeNode current = root;

        while (current != null) {
            if (current.left != null) {
                TreeNode predecessor = current.left;
                while (predecessor.right != null) {
                    predecessor = predecessor.right;
                }

                predecessor.right = current.right;
                current.right = current.left;
                current.left = null;
            }

            current = current.right;
        }
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` amortized; mỗi edge được theo dõi số lần hữu hạn trong quá trình rewiring.
- **Extra space:** `O(1)`.

## 7. Alternative

Reverse-preorder recursion (`right -> left`) có code ngắn và dễ chứng minh nhưng dùng `O(h)` call stack. Explicit stack cũng cần `O(h)` hoặc `O(n)` trong worst case.

## 8. Common mistakes / Lỗi thường gặp

- Ghi đè `current.right` trước khi bảo toàn original right subtree.
- Quên đặt `current.left = null`.
- Tạo node mới thay vì mutate tree hiện có.
- Trả đúng preorder values nhưng tạo cycle hoặc để sót left pointer.
