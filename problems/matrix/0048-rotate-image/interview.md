# 48. Rotate Image — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch

**EN:** I rotate in place by first transposing the matrix across the main diagonal and then reversing every row. Transpose maps `(r,c)` to `(c,r)`, and row reversal maps that to `(c,n-1-r)`, which is exactly the coordinate mapping for a 90-degree clockwise rotation. Both phases are in place, so the solution uses `O(1)` extra space.

**VI:** Em transpose qua main diagonal rồi reverse từng row. `(r,c)` trở thành `(c,r)` rồi `(c,n-1-r)`, đúng coordinate của rotation clockwise 90°. Cả hai phase đều in-place.

## 2. Core practice questions

### Q1

**Q (EN):** Why does transpose plus row reversal produce a clockwise rotation?

**Q (VI):** Vì sao transpose rồi reverse row tạo clockwise rotation?

### Short answer (EN)

Together they map each cell `(r,c)` to `(c,n-1-r)`.

### Trả lời ngắn (VI)

Hai bước map mỗi cell `(r,c)` thành `(c,n-1-r)`.

### Standard answer (EN)

Transpose swaps row and column coordinates. Reversing the transposed row mirrors its column coordinate, so the final mapping is `(r,c) -> (c,n-1-r)`, exactly clockwise rotation.

### Trả lời chuẩn (VI)

Transpose đổi row/column, reverse row phản chiếu column coordinate; final mapping là `(r,c) -> (c,n-1-r)`.

### Q2

**Q (EN):** Why do you start the inner transpose loop at `r + 1`?

**Q (VI):** Vì sao inner loop transpose bắt đầu ở `r + 1`?

### Short answer (EN)

To swap each off-diagonal pair exactly once.

### Trả lời ngắn (VI)

Để mỗi cặp ngoài diagonal được swap đúng một lần.

### Standard answer (EN)

Diagonal cells do not move during transpose, and processing both `(r,c)` and `(c,r)` would swap a pair twice. Restricting to one triangle avoids both issues.

### Trả lời chuẩn (VI)

Cell trên diagonal không cần đổi; xử lý cả `(r,c)` và `(c,r)` sẽ swap hai lần. Chỉ đi một triangle là đủ.

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Complexity là gì?

### Short answer (EN)

`O(n²)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n²)` time và `O(1)` extra space.

### Standard answer (EN)

Transpose touches half the matrix and row reversal touches all rows, so the total remains quadratic; only temporary swap variables are used.

### Trả lời chuẩn (VI)

Transpose xử lý khoảng nửa matrix và reverse xử lý toàn bộ rows; tổng vẫn quadratic, chỉ dùng biến swap tạm.

## 3. Common interviewer traps

- Allocate a second matrix.
- Reverse the wrong dimension.
- Fail to distinguish clockwise and counterclockwise.
- Swap each transpose pair twice.

## 4. Useful vocabulary

- transpose — chuyển vị
- main diagonal — đường chéo chính
- clockwise — theo chiều kim đồng hồ
- in-place — tại chỗ
- coordinate mapping — ánh xạ tọa độ
