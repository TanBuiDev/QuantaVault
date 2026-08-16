# 36. Valid Sudoku — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I scan each filled cell once and track whether each digit has already appeared in its row, column, and 3-by-3 box. I map digits 1 through 9 to indices 0 through 8 and map a cell to its box with `(row / 3) * 3 + col / 3`. If any of the three tracking tables already contains the digit, the board is invalid; otherwise I mark all three. Since the board is fixed at 9 by 9, both time and extra space are constant.

**VI:** Em scan mỗi filled cell một lần và track digit đã xuất hiện trong row, column, box hay chưa. Digit `1..9` map về `0..8`, box dùng `(row/3)*3+col/3`. Nếu một trong ba bảng đã có digit thì invalid; nếu chưa thì đánh dấu. Board cố định `9x9` nên time/space đều constant.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** How do you identify the 3-by-3 box of a cell?

**Q (VI):** Làm sao xác định sub-box `3 x 3` của một cell?

### Short answer (EN)

`(row / 3) * 3 + (col / 3)` gives a box index from zero to eight.

### Trả lời ngắn (VI)

`(row / 3) * 3 + (col / 3)` cho box index từ `0` tới `8`.

### Standard answer (EN)

Integer division groups rows into `0..2`, `3..5`, `6..8`, and does the same for columns. That gives a three-by-three grid of box coordinates, which I flatten into one index.

### Trả lời chuẩn (VI)

Integer division gom row thành ba nhóm `0..2`, `3..5`, `6..8`, tương tự column. Cặp box-row/box-column được flatten thành một index.

### Q2

**Q (EN):** Why does a single pass suffice?

**Q (VI):** Vì sao một pass là đủ?

**EN:** Each rule is only about whether a digit repeats within a row, column, or box. Once I remember all previously seen digits for those three scopes, the current cell can be validated immediately.

**VI:** Mỗi rule chỉ hỏi digit có lặp trong row/column/box hay không. Khi đã nhớ các digit trước đó trong ba scope, current cell có thể được validate ngay.

### Q3

**Q (EN):** Does a valid board have to be solvable?

**Q (VI):** Board valid có bắt buộc giải được không?

**EN:** No. The problem only checks local Sudoku validity constraints for filled cells; solvability is a different search problem.

**VI:** Không. Đề chỉ kiểm tra local validity constraints của filled cells; solvability là bài search khác.

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Complexity là gì?

### Short answer (EN)

For this fixed 9-by-9 board, `O(1)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

Với board cố định `9x9`, `O(1)` time và `O(1)` extra space.

### Deep answer (EN)

There are exactly 81 cells and three fixed 9-by-9 boolean tables. If generalized to an `N x N` board, the scan would be `O(N^2)` and the tracking storage would scale with the generalized symbol/region model.

### Trả lời sâu (VI)

Có đúng `81` cell và ba bảng boolean cố định. Nếu tổng quát thành `N x N`, scan sẽ là `O(N^2)` và storage tăng theo mô hình symbol/region tổng quát.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I skip empty cells, convert each digit to an array index, compute its box index, check all three scopes for a prior occurrence, and return false on the first conflict. Otherwise I mark the three scopes and continue.

**VI:** Em skip empty cell, đổi digit thành array index, tính box index, check cả ba scope và return false ngay khi conflict; nếu không thì mark rồi tiếp tục.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Nhầm validity với solvability.
- Quên box constraint.
- Tính box index sai ở middle/bottom rows.
- Nói `O(81)` mà không giải thích vì sao thường được rút gọn thành `O(1)` theo fixed constraint.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- partially filled — được điền một phần
- repetition — sự lặp lại
- sub-box — ô vuông con
- constraint tracking — theo dõi ràng buộc
- solvable — có thể giải được
- filled cell — ô đã điền
