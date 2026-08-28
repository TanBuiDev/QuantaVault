# Solution / Lời giải — 17. Letter Combinations of a Phone Number

## 1. Core idea

Backtracking depth equals the digit index. At each depth choose one mapped letter; a full path has exactly one letter per input digit.

## 2. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    private static final String[] KEYPAD = {
            "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
    };

    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits == null || digits.isEmpty()) {
            return result;
        }

        backtrack(digits, 0, new StringBuilder(), result);
        return result;
    }

    private void backtrack(String digits, int index, StringBuilder path, List<String> result) {
        // One character is chosen for every digit, so reaching digits.length()
        // means the path is a complete combination and can be emitted.
        if (index == digits.length()) {
            result.add(path.toString());
            return;
        }

        String letters = KEYPAD[digits.charAt(index) - '0'];
        for (int i = 0; i < letters.length(); i++) {
            // Choose one letter for this digit, recurse to the next digit, then undo
            // so sibling choices start from the exact same prefix state.
            path.append(letters.charAt(i));
            backtrack(digits, index + 1, path, result);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```

## 3. Correctness

Every recursion level chooses exactly one valid letter for the corresponding digit. The DFS enumerates the Cartesian product of all digit letter sets, and undoing the last choice isolates sibling branches.

## 4. Complexity

Output-sensitive: `O(number of combinations * digits.length())` time, `O(digits.length())` recursion/path space excluding output.
