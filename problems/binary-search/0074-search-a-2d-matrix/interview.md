# 74. Search a 2D Matrix — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** The cross-row ordering makes the matrix one globally sorted row-major sequence. I binary-search virtual indices and map each midpoint to `row = mid / n`, `col = mid % n`, achieving O(log(m*n)) time and O(1) space.

**VI:** Tôi binary search mảng ảo row-major và ánh xạ midpoint về tọa độ ma trận.

## 2. Core approach questions
**Q (EN):** Why can the matrix be treated as one sorted array?

**Q (VI):** Vì sao xem như một sorted array?

### Short answer (EN)
Each row is sorted and every next row starts above the previous row's last value.

### Trả lời ngắn (VI)
Mỗi hàng sorted và boundary giữa hàng cũng tăng.

### Standard answer (EN)
Together those conditions impose a strict global order on row-major positions.

### Trả lời chuẩn (VI)
Hai điều kiện tạo total order theo row-major.

## 3. Why / correctness questions
**Q (EN):** How do virtual indices map to cells?

**Q (VI):** Index ảo map thế nào?

### Short answer (EN)
`row = p/n`, `col = p%n`.

### Trả lời ngắn (VI)
Chia nguyên lấy row, modulo lấy column.

### Standard answer (EN)
Every block of n consecutive virtual indices corresponds to one row.

### Trả lời chuẩn (VI)
Mỗi block n index liên tiếp chính là một hàng.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(log(m*n)) time, O(1) space.

### Trả lời ngắn (VI)
O(log(m*n)), O(1).

### Standard answer (EN)
Binary search halves a domain of m*n virtual positions.

### Trả lời chuẩn (VI)
Search trên m*n vị trí ảo và giảm nửa mỗi vòng.

## 5. Edge-case questions
**Q (EN):** What about one row?

**Q (VI):** Nếu chỉ một hàng?

### Short answer (EN)
It reduces to ordinary binary search.

### Trả lời ngắn (VI)
Trở thành binary search thường.

### Standard answer (EN)
The same mapping remains valid because every virtual index has row zero.

### Trả lời chuẩn (VI)
Mapping vẫn đúng với row luôn bằng 0.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Could you binary-search rows first?

**Q (VI):** Có thể tìm hàng trước không?

### Short answer (EN)
Yes, then search within that row.

### Trả lời ngắn (VI)
Có, tìm candidate row rồi search trong row.

### Standard answer (EN)
That is also logarithmic but requires two search phases and more boundary logic.

### Trả lời chuẩn (VI)
Cùng asymptotic nhưng nhiều logic hơn.

## 7. Code walkthrough questions
**Q (EN):** Why not build a flattened array?

**Q (VI):** Vì sao không tạo array flatten thật?

### Short answer (EN)
It would waste O(m*n) space and time.

### Trả lời ngắn (VI)
Tốn bộ nhớ và copy không cần thiết.

### Standard answer (EN)
Index arithmetic provides random access to the same logical sequence for free.

### Trả lời chuẩn (VI)
Phép toán index cho access tương đương mà không copy.

## 8. Follow-up variations
**Q (EN):** What if rows are sorted but cross-row order is absent?

**Q (VI):** Nếu không có cross-row order?

### Short answer (EN)
The flattened sequence is no longer sorted.

### Trả lời ngắn (VI)
Sequence row-major không còn sorted.

### Standard answer (EN)
You would need another strategy, such as row-wise searches or staircase search depending on column ordering.

### Trả lời chuẩn (VI)
Cần strategy khác theo các invariant còn lại.

## 9. Common interviewer traps
Wrong index mapping, overlooking global ordering, allocating a flattened copy.

## 10. Useful phrases and vocabulary
`virtual flattened array`, `row-major order`, `global sorted order`, `index mapping`.
