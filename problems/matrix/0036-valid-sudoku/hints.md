# 36. Valid Sudoku — Hints / Gợi ý

## Hint 1

Mỗi ô đã điền phải thỏa đồng thời **3 constraint**: không trùng trong row, column và `3 x 3` box.

## Hint 2

Khi đọc một digit, hãy ghi nhận nó vào ba bảng trạng thái riêng:

```text
rows[row][digit]
cols[col][digit]
boxes[box][digit]
```

## Hint 3

Với `(row, col)`, index của sub-box là:

```text
box = (row / 3) * 3 + (col / 3)
```

## Hint 4

Nếu một trong ba trạng thái đã là `true` trước khi đánh dấu digit hiện tại, bảng invalid ngay lập tức. Bỏ qua các ô `'.'`.
