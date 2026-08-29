# Solution / Lời giải — 129. Sum Root to Leaf Numbers

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Mỗi root-to-leaf path tạo một số bằng cách append digit: nếu prefix là 12 và child value3 thì số mới là 12*10+3. Chỉ leaves đóng góp số hoàn chỉnh vào total.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Build strings/path lists rồi parse là thừa. Quan sát decimal accumulation có thể carry một integer prefix qua DFS; branches nhận copy value nên không cần backtracking mutable state.

**State / invariant / data structure cần hiểu trước code.** currentNumber trong call là số được tạo bởi path từ root tới node. Invariant update current=parent*10+node.val; nếu leaf return current, nếu internal return sum của child results.

**Dry run mental theo implementation.** Dry run tree 1 với children2,3: tại root current1; left thành12 leaf trả12; right thành13 trả13; root cộng thành25.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là cộng node values thay vì positional decimal value hoặc tính ở non-leaf. Khi nào dùng: digits trên path thường carry rolling base-B number state.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
