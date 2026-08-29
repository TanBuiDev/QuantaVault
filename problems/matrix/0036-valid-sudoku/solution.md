# 36. Valid Sudoku — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Sudoku board hợp lệ khi mỗi digit không lặp trong row, column và 3x3 box. Mỗi cell cần được kiểm tra đồng thời trong ba nhóm đó.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Quét lại cả row/column/box cho từng cell gây công lặp. Quan sát có thể lưu seen sets/bit masks cho 9 rows, 9 columns và 9 boxes, rồi mỗi digit chỉ cần ba lookup O(1).

**State / invariant / data structure cần hiểu trước code.** rowSeen[r], colSeen[c], boxSeen[b] đại diện digits đã gặp trước cell hiện tại. Box index thường b=(r/3)*3+c/3. Invariant: trước mỗi cell, ba structures phản ánh đúng prefix cells đã scan.

**Dry run mental theo implementation.** Dry run cell (4,7): box index=(4/3)*3+7/3=5. Nếu digit '6' đã có trong boxSeen[5] dù row/column chưa có, board vẫn invalid ngay.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là tính box index sai hoặc coi '.' như digit. Khi nào dùng: constraint uniqueness trên nhiều overlapping groups thường giải bằng một seen structure cho mỗi group.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Mỗi digit đã điền tạo ba constraint độc lập:

- unique trong row hiện tại;
- unique trong column hiện tại;
- unique trong sub-box `3 x 3` hiện tại.

Ta scan toàn bộ `9 x 9` board đúng một lần và lưu trạng thái đã thấy.

---

## 2. State representation

Dùng ba bảng boolean:

```text
rows[9][9]
cols[9][9]
boxes[9][9]
```

Digit `'1'..'9'` được map về index `0..8` bằng:

```text
digit = board[r][c] - '1'
```

Sub-box:

```text
box = (r / 3) * 3 + (c / 3)
```

---

## 3. Algorithm

Với mỗi cell:

1. Nếu là `'.'`, bỏ qua.
2. Tính `digit` và `box`.
3. Nếu digit đã xuất hiện trong row, column hoặc box → `false`.
4. Đánh dấu digit vào cả ba bảng.
5. Scan hết mà không conflict → `true`.

---

## 4. Optimal Java solution

```java
class Solution {
    public boolean isValidSudoku(char[][] board) {
        boolean[][] rows = new boolean[9][9];
        boolean[][] cols = new boolean[9][9];
        boolean[][] boxes = new boolean[9][9];

        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char ch = board[r][c];
                if (ch == '.') {
                    continue;
                }

                // '1'..'9' được nén thành 0..8 để dùng trực tiếp làm index boolean.
                int digit = ch - '1';

                // r/3 và c/3 cho tọa độ box 0..2; flatten theo row-major
                // tạo đúng một id 0..8 cho mỗi sub-box 3x3.
                int box = (r / 3) * 3 + (c / 3);

                // Một occurrence trước đó trong bất kỳ phạm vi nào đã đủ chứng minh
                // board invalid; không cần đợi scan hết ba cấu trúc.
                if (rows[r][digit] || cols[c][digit] || boxes[box][digit]) {
                    return false;
                }

                rows[r][digit] = true;
                cols[c][digit] = true;
                boxes[box][digit] = true;
            }
        }

        return true;
    }
}
```

---

## 5. Why the box formula works

`r / 3` cho box-row `0,1,2`; `c / 3` cho box-column `0,1,2`.

Flatten cặp `(boxRow, boxCol)` thành index `0..8`:

```text
boxRow * 3 + boxCol
```

Ví dụ cell `(4,7)`:

```text
boxRow = 4/3 = 1
boxCol = 7/3 = 2
box = 1*3+2 = 5
```

---

## 6. Correctness / Vì sao đúng

Khi xử lý một filled cell, ba bảng chứa chính xác các digit đã xuất hiện trước đó trong row, column và box tương ứng. Nếu một bảng đã chứa digit hiện tại, tồn tại repetition nên board invalid. Nếu chưa có, đánh dấu cell bảo toàn invariant cho các cell sau.

Nếu scan hoàn tất mà không phát hiện repetition, mọi filled cell đều unique trong cả ba phạm vi, đúng chính xác ba rule của đề, nên board valid.

---

## 7. Complexity

Board luôn cố định `9 x 9`, nên theo constraint của đề:

```text
Time: O(1)
Space: O(1)
```

Nếu tổng quát hóa thành board kích thước biến đổi thì scan là tuyến tính theo số cell.

---

## 8. Common mistakes

1. Chỉ kiểm tra row và column mà quên box.
2. Tính sai box index.
3. Xử lý `'.'` như một digit và báo duplicate sai.
4. Cố giải Sudoku; đề chỉ hỏi **valid**, không hỏi **solvable**.
5. Dùng string key phức tạp khi boolean tables đơn giản hơn.
