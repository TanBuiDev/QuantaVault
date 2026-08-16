# Solution / Lời giải — 17. Letter Combinations of a Phone Number

## 1. Core idea / Trực giác

Mỗi chữ số tương ứng với một tập chữ cái. Ta cần chọn **một chữ cái cho mỗi vị trí** và liệt kê toàn bộ tổ hợp có thể. Đây chính là một cây quyết định tự nhiên cho **backtracking**.

## 2. Requirement recap / Tóm tắt yêu cầu

- Mỗi ký tự của `digits` nằm trong `2..9`.
- Mỗi chữ số ánh xạ tới 3 hoặc 4 chữ cái.
- Cần sinh toàn bộ tổ hợp, thứ tự kết quả không quan trọng.

## 3. Key observations / Nhận xét quan trọng

- Mỗi level của recursion tương ứng với một chữ số.
- Khi `index == digits.length()`, `path` đã là một đáp án hoàn chỉnh.
- `StringBuilder` giúp thêm/xóa ký tự ở cuối hiệu quả hơn việc tạo chuỗi mới liên tục.

## 4. Alternative approach / Cách khác

Có thể dùng iterative BFS-style expansion: bắt đầu với `""`, rồi với mỗi chữ số tạo danh sách mới bằng cách nối từng ký tự. Cách này đúng nhưng backtracking thể hiện cấu trúc bài rõ hơn và dùng ít cấu trúc trung gian hơn ngoài output.

## 5. Optimal approach / Cách tối ưu

Dùng mảng ánh xạ:

```text
2 -> abc
3 -> def
4 -> ghi
5 -> jkl
6 -> mno
7 -> pqrs
8 -> tuv
9 -> wxyz
```

Ở mỗi vị trí, thử từng chữ cái tương ứng, recurse sang vị trí tiếp theo, rồi undo lựa chọn.

## 6. Java solution overview

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
        if (index == digits.length()) {
            result.add(path.toString());
            return;
        }

        String letters = KEYPAD[digits.charAt(index) - '0'];
        for (int i = 0; i < letters.length(); i++) {
            path.append(letters.charAt(i));
            backtrack(digits, index + 1, path, result);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
```

## 7. Code explanation / Giải thích code

`index` chỉ chữ số đang xử lý. `path` chứa các chữ cái đã chọn. Mỗi vòng lặp chọn một candidate, recurse, sau đó xóa candidate để thử nhánh kế tiếp.

## 8. Dry run

Với `digits = "23"`:

- Chọn `a` từ `2` → lần lượt ghép `d`, `e`, `f` → `ad`, `ae`, `af`.
- Backtrack về vị trí đầu, chọn `b` → `bd`, `be`, `bf`.
- Chọn `c` → `cd`, `ce`, `cf`.

## 9. Complexity / Độ phức tạp

Nếu có `n` chữ số, mỗi chữ số có tối đa 4 lựa chọn:

- Time: `O(4^n * n)` nếu tính cả chi phí tạo chuỗi output dài `n`.
- Auxiliary space: `O(n)` cho recursion + current path, không tính output.

## 10. Why it is correct / Vì sao đúng

Mỗi level chọn chính xác một chữ cái hợp lệ cho chữ số tương ứng. Thuật toán thử mọi lựa chọn ở mọi level, nên mọi tổ hợp hợp lệ đều được sinh. Mỗi đường đi có đúng một chuỗi lựa chọn, nên không bỏ sót và không sinh trùng.

## 11. Edge cases / Trường hợp biên

- Một chữ số: trả đúng 3 hoặc 4 chữ cái.
- Chữ số `7` hoặc `9`: có 4 nhánh thay vì 3.
- Độ dài 4: số output lớn nhất là `4^4 = 256`.

## 12. Common mistakes / Lỗi thường gặp

- Quên `deleteCharAt` khi backtrack.
- Dùng sai mapping cho `7` (`pqrs`) hoặc `9` (`wxyz`).
- Add `path` trước khi đạt đủ số chữ số.

## 13. Pattern recognition / Khi nào dùng lại

Dùng pattern này khi cần liệt kê Cartesian product của nhiều tập lựa chọn nhỏ, ví dụ sinh code, chọn ký tự theo từng vị trí, hay cấu hình tổ hợp.

## 14. Vocabulary / Từ vựng

- **mapping**: ánh xạ
- **candidate**: lựa chọn ứng viên
- **backtracking**: quay lui
- **decision tree**: cây quyết định
- **Cartesian product**: tích Descartes / toàn bộ tổ hợp chọn một phần tử từ mỗi tập
