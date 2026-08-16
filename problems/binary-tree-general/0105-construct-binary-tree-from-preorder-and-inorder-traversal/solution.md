# Solution / Lời giải — 105. Construct Binary Tree from Preorder and Inorder Traversal

## 1. Core idea / Ý tưởng chính

Preorder cho biết **root trước**, còn inorder cho biết ranh giới **left subtree | root | right subtree**. Dùng một `preorderIndex` tăng dần và `HashMap` tra nhanh vị trí mỗi value trong inorder.

## 2. Algorithm / Thuật toán

1. Lưu `inorder[value] -> index` vào map.
2. `preorderIndex = 0`.
3. Helper `build(left, right)` mô tả đoạn inorder của subtree hiện tại:
   - nếu `left > right`, return `null`;
   - lấy `rootValue = preorder[preorderIndex++]`;
   - tìm `middle = inorderIndex.get(rootValue)`;
   - dựng `root.left = build(left, middle - 1)`;
   - dựng `root.right = build(middle + 1, right)`;
   - return root.
4. Gọi `build(0, n - 1)`.

## 3. Why it works / Vì sao đúng

Với mỗi subtree, preorder đảm bảo value chưa consume đầu tiên là root. Do values unique, vị trí root trong inorder là duy nhất và chia chính xác các node thuộc left/right subtree. Preorder liệt kê toàn bộ left subtree trước right subtree, nên sau khi consume root ta phải dựng left trước rồi mới dựng right. Quy nạp theo kích thước đoạn inorder cho thấy mỗi recursive call dựng đúng subtree tương ứng.

## 4. Dry run / Chạy thử

```text
preorder = [3,9,20,15,7]
inorder  = [9,3,15,20,7]
```

- Root đầu tiên = `3`, split inorder tại index 1.
- Left range `[9]` → root `9`.
- Right range `[15,20,7]` → next preorder root `20`, split thành `[15]` và `[7]`.
- Result: `[3,9,20,null,null,15,7]`.

## 5. Optimal Java solution / Java tối ưu

```java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    private int preorderIndex;
    private int[] preorder;
    private Map<Integer, Integer> inorderIndex;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        this.preorderIndex = 0;
        this.inorderIndex = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inorderIndex.put(inorder[i], i);
        }
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int left, int right) {
        if (left > right) return null;
        int value = preorder[preorderIndex++];
        TreeNode root = new TreeNode(value);
        int middle = inorderIndex.get(value);
        root.left = build(left, middle - 1);
        root.right = build(middle + 1, right);
        return root;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` — map build `O(n)`, mỗi node được tạo một lần và split lookup `O(1)` average.
- **Extra space:** `O(n)` cho map, cộng recursion stack `O(h)`.

## 7. Alternative — scan inorder each call

Có thể tìm root bằng linear scan trong mỗi recursive range, nhưng worst case skewed tree trở thành `O(n^2)`. Index map loại bỏ chi phí đó.

## 8. Common mistakes / Lỗi thường gặp

- Dựng right subtree trước left dù preorder consume left trước.
- Scan inorder lặp lại và bỏ lỡ tối ưu `O(n)`.
- Không giới hạn recursive call bằng inorder boundaries.
- Dùng value duplicate làm map key; đề đảm bảo unique nên hướng này hợp lệ.
