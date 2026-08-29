# Solution / Lời giải — 17. Letter Combinations of a Phone Number

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Mỗi digit 2–9 mở ra một nhóm letters, ví dụ 23 nghĩa là chọn một letter trong abc rồi một letter trong def. Mỗi output là một đường đi dài đúng bằng số digits qua cây lựa chọn này.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Có thể tạo product bằng nhiều vòng lặp nhưng số digit thay đổi nên không tổng quát. Quan sát mỗi vị trí có một tập choices độc lập; backtracking chọn một letter, recurse sang digit kế, rồi undo để thử choice khác.

**State / invariant / data structure cần hiểu trước code.** State gồm index digit hiện tại và path/StringBuilder đang chứa prefix letters đã chọn. Invariant path.length()==index; khi index==digits.length, path là một combination hoàn chỉnh và được copy vào result.

**Dry run mental theo implementation.** Dry run 23: chọn a rồi d/e/f tạo ad,ae,af; undo a, chọn b rồi d/e/f; tiếp c. Mỗi return xóa đúng letter vừa append nên sibling branch không dính state của nhau.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là quên undo StringBuilder hoặc xử lý digits rỗng thành một empty combination. Khi nào dùng: Cartesian product có số lớp thay đổi thường là choose → recurse → undo backtracking.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
