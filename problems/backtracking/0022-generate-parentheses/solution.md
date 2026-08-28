# Solution / Lời giải — 22. Generate Parentheses

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
