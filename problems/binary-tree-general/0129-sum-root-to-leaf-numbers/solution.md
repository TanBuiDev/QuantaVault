# Solution / Lời giải — 129. Sum Root to Leaf Numbers

## 1. Core idea / Ý tưởng chính

DFS từ root và mang theo số được tạo bởi prefix hiện tại. Khi đi tới node có digit `d`, số mới là `prefix * 10 + d`. Nếu node là leaf, trả chính số đó; nếu chưa phải leaf, tổng của subtree là tổng kết quả từ left và right.

## 2. Algorithm / Thuật toán

1. Gọi `dfs(root, 0)`.
2. Trong `dfs(node, prefix)`:
   - nếu node null, trả `0`;
   - tính `value = prefix * 10 + node.val`;
   - nếu node là leaf, trả `value`;
   - ngược lại trả `dfs(left, value) + dfs(right, value)`.

## 3. Why it works / Vì sao đúng

Invariant: khi `dfs(node, prefix)` bắt đầu, `prefix` chính là số được tạo bởi path từ root đến parent của `node`. Công thức nhân `10` rồi cộng digit duy trì invariant cho node hiện tại. Tại leaf, `value` là đúng số của một root-to-leaf path. Mọi leaf thuộc chính xác một path và recursion cộng kết quả của hai subtree, nên tổng cuối chứa mỗi root-to-leaf number đúng một lần.

## 4. Dry run / Chạy thử

Với `[1,2,3]`:

```text
root 1: value = 0 * 10 + 1 = 1
left 2: value = 1 * 10 + 2 = 12 -> leaf
right 3: value = 1 * 10 + 3 = 13 -> leaf
sum = 12 + 13 = 25
```

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int prefix) {
        if (node == null) return 0;

        int value = prefix * 10 + node.val;
        if (node.left == null && node.right == null) return value;

        return dfs(node.left, value) + dfs(node.right, value);
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(h)` cho recursion stack.

## 7. Alternative

Có thể DFS iterative bằng stack chứa `(node, prefix)`. Cách này vẫn `O(n)` time nhưng dùng explicit storage thay cho call stack.

## 8. Common mistakes / Lỗi thường gặp

- Cộng prefix ở internal node thay vì chỉ tại leaf.
- Dùng string concatenation không cần thiết.
- Quên digit `0` vẫn phải làm phép `prefix * 10`.
- Reset prefix khi chuyển sang subtree khác.
