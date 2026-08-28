# Solution / Lời giải — 124. Binary Tree Maximum Path Sum

## 1. Core idea

Postorder DFS có hai khái niệm khác nhau: `best` xét path hoàn chỉnh qua node có thể dùng **hai** child; giá trị `gain` trả lên parent chỉ được dùng **một** child để vẫn là một simple chain.

## 2. Optimal Java solution

```java
public class Solution {
    private int best;

    public int maxPathSum(TreeNode root) {
        // Không dùng 0 vì tree toàn số âm vẫn phải chọn ít nhất một node.
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
    }

    private int gain(TreeNode node) {
        if (node == null) {
            return 0;
        }

        // Negative child contribution chỉ làm path tệ hơn, nên optimal path có thể
        // bỏ hẳn nhánh đó bằng cách clamp contribution về 0.
        int left = Math.max(0, gain(node.left));
        int right = Math.max(0, gain(node.right));

        // Một path hoàn chỉnh có node này là highest point có thể dùng CẢ hai nhánh,
        // nên candidate global là node + left + right.
        best = Math.max(best, node.val + left + right);

        // Nhưng gain trả lên parent phải là một chain không phân nhánh, nên chỉ
        // chọn một child tốt hơn; trả cả hai sẽ tạo degree 3 khi parent nối vào.
        return node.val + Math.max(left, right);
    }
}
```

## 3. Correctness

Mọi simple path có một highest node. Khi DFS xử lý node đó, best candidate dùng optimal downward contributions từ cả hai sides và xét đúng path tốt nhất có highest node này. Gain trả lên chỉ một side nên mọi candidate parent tạo vẫn là simple path. Max qua mọi nodes bao phủ mọi path.

## 4. Complexity

```text
Time: O(n)
Space: O(h)
```

## 5. Common mistakes

- Trả left+right lên parent.
- Khởi tạo best bằng 0.
- Không bỏ negative gain.
- Giả định optimum đi qua root.
