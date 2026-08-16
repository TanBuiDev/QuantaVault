# Solution / Lời giải — 106. Construct Binary Tree from Inorder and Postorder Traversal

## 1. Core idea / Ý tưởng chính

Postorder có thứ tự `left -> right -> root`. Khi consume từ cuối mảng về đầu, thứ tự trở thành `root -> right -> left`. Vì vậy dùng một `postorderIndex` giảm dần, map `value -> inorder index`, và dựng **right trước left**.

## 2. Algorithm / Thuật toán

1. Tạo map vị trí của mọi value trong inorder.
2. Đặt `postorderIndex = n - 1`.
3. Helper `build(left, right)`:
   - `left > right` → null;
   - root = `postorder[postorderIndex--]`;
   - split = inorder index của root;
   - `root.right = build(split + 1, right)`;
   - `root.left = build(left, split - 1)`;
   - return root.
4. Gọi `build(0, n-1)`.

## 3. Why it works / Vì sao đúng

Value cuối của postorder hiện tại là root. Inorder split xác định duy nhất tập node thuộc hai child subtree. Sau root, khi đọc postorder ngược, toàn bộ right subtree xuất hiện trước left subtree, nên recursion phải dựng right trước để global index consume đúng block. Induction theo inorder range chứng minh mỗi call dựng đúng subtree.

## 4. Dry run / Chạy thử

```text
inorder   = [9,3,15,20,7]
postorder = [9,15,7,20,3]
```

- Consume `3` làm root.
- Split inorder tại `3`: left `[9]`, right `[15,20,7]`.
- Consume ngược tiếp là `20`, nên dựng right subtree trước; `20` chia thành `15` và `7`.
- Sau đó consume `9` cho left subtree.

## 5. Optimal Java solution / Java tối ưu

```java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    private int postorderIndex;
    private int[] postorder;
    private Map<Integer, Integer> inorderIndex;

    public TreeNode buildTree(int[] inorder, int[] postorder) {
        this.postorder = postorder;
        this.postorderIndex = postorder.length - 1;
        this.inorderIndex = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inorderIndex.put(inorder[i], i);
        }
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int left, int right) {
        if (left > right) return null;
        int value = postorder[postorderIndex--];
        TreeNode root = new TreeNode(value);
        int middle = inorderIndex.get(value);
        root.right = build(middle + 1, right);
        root.left = build(left, middle - 1);
        return root;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(n)` cho index map, cộng `O(h)` recursion stack.

## 7. Alternative

Nếu scan inorder trong từng call, worst case thành `O(n^2)`. HashMap giữ reconstruction tuyến tính.

## 8. Common mistakes / Lỗi thường gặp

- Dựng left trước right khi đang consume postorder từ cuối.
- Quên giảm `postorderIndex` đúng một lần mỗi node.
- Không dùng inorder boundaries.
- Scan inorder lặp lại nhưng vẫn đánh giá time là `O(n)`.
