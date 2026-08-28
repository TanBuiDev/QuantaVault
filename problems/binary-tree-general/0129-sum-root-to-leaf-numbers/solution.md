# Solution / Lời giải — 129. Sum Root to Leaf Numbers

## 1. Core idea

DFS mang decimal prefix. Append digit `d` bằng `prefix*10+d`; chỉ khi tới leaf mới cộng số hoàn chỉnh vào kết quả.

## 2. Optimal Java solution

```java
public class Solution {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int prefix) {
        if (node == null) {
            return 0;
        }

        // Append một decimal digit d vào number prefix chính là prefix*10+d;
        // không cần String/path buffer và state truyền xuống vẫn O(1) mỗi frame.
        int value = prefix * 10 + node.val;

        // Chỉ leaf đại diện cho một root-to-leaf number hoàn chỉnh; internal prefix
        // chưa được cộng để tránh đếm một path chưa kết thúc.
        if (node.left == null && node.right == null) {
            return value;
        }

        // Left/right leaves là disjoint path sets nên tổng subtree là tổng hai kết quả.
        return dfs(node.left, value) + dfs(node.right, value);
    }
}
```

## 3. Correctness

Invariant: `prefix` là số tạo bởi path tới parent; recurrence tạo đúng số tới current node. Mỗi leaf trả đúng một root-to-leaf number, và hai subtree chứa disjoint leaves nên phép cộng đếm mỗi path đúng một lần.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- Cộng prefix tại internal node.
- Dùng string không cần thiết.
- Quên digit 0 vẫn cần nhân prefix với 10.
