# Solution / Lời giải — 22. Generate Parentheses

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Một chuỗi ngoặc hợp lệ được xây từ trái sang phải với hai luật: số '(' đã dùng không vượt n, và số ')' đã dùng không bao giờ vượt số '(' trong bất kỳ prefix nào.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Sinh mọi 2^(2n) chuỗi rồi validate lãng phí hầu hết branches sai. Quan sát ta có thể prune ngay khi xây: chỉ add '(' nếu open<n; chỉ add ')' nếu close<open.

**State / invariant / data structure cần hiểu trước code.** open và close là số ngoặc đã đặt; path là prefix hiện tại. Invariant 0<=close<=open<=n luôn giữ, nên mọi prefix generated đều có khả năng hoàn thành thành chuỗi valid.

**Dry run mental theo implementation.** Dry run n=2: từ empty phải chọn '('; state (1,0) có thể '(' -> (2,0) rồi đóng hai lần tạo (()), hoặc ')' -> (1,1), rồi '(' và ')' tạo ()().

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ check validity ở cuối hoặc cho close==open rồi vẫn add ')'. Khi nào dùng: generation với prefix-validity constraint nên prune trong lúc xây thay vì sinh toàn bộ rồi lọc.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Generate only valid prefixes. Add `(` while `open < n`; add `)` only while `close < open`, so no prefix can ever have more closing than opening parentheses.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(n, 0, 0, new StringBuilder(), result);
        return result;
    }

    private void backtrack(int n, int open, int close, StringBuilder current, List<String> result) {
        if (current.length() == 2 * n) {
            // The pruning rules below guarantee every completed length-2n prefix
            // already contains exactly n pairs and is balanced.
            result.add(current.toString());
            return;
        }

        // We can open another group only while the total number of '(' stays <= n.
        if (open < n) {
            current.append('(');
            backtrack(n, open + 1, close, current, result);
            current.deleteCharAt(current.length() - 1);
        }

        // A ')' is legal only when there is an unmatched '(' to close; this keeps
        // every generated prefix valid instead of generating invalid strings then filtering.
        if (close < open) {
            current.append(')');
            backtrack(n, open, close + 1, current, result);
            current.deleteCharAt(current.length() - 1);
        }
    }
}
```

## 3. Correctness

The invariants `open <= n`, `close <= open`, and final length `2n` imply every emitted string is valid. Conversely, every valid parenthesis string follows only choices permitted by these same invariants, so none are missed.

## 4. Complexity

Output-sensitive, proportional to the `n`th Catalan number times `n`; recursion/path depth is `O(n)`.
