# 54. Spiral Matrix — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I keep four boundaries for the unvisited rectangle. I traverse its top row, right column, bottom row, and left column in clockwise order, moving each boundary inward after use. Before traversing the bottom or left edge I re-check that the rectangle still exists, which prevents duplicates for a single remaining row or column. Every cell is visited once, so the solution is `O(mn)` time.

**VI:** Em giữ bốn biên của rectangle chưa đọc, đi top → right → bottom → left rồi co biên. Trước bottom và left phải check vùng còn tồn tại để không duplicate ở single row/column. Mỗi cell đọc một lần nên `O(mn)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why are the second pair of boundary checks necessary?

**Q (VI):** Vì sao cần check lại boundary trước bottom row và left column?

### Short answer (EN)

The last layer may contain only one row or one column; without the checks, that layer can be emitted twice.

### Trả lời ngắn (VI)

Layer cuối có thể chỉ còn một hàng hoặc một cột; nếu không check thì layer đó có thể bị đọc hai lần.

### Standard answer (EN)

After reading the top row I increment `top`, and after reading the right column I decrement `right`. Those updates may empty the remaining rectangle. Therefore the bottom and left traversals must use the updated boundaries before they run.

### Trả lời chuẩn (VI)

Sau khi đọc top row ta tăng `top`, sau right column ta giảm `right`. Các update này có thể làm rectangle còn lại rỗng, nên bottom và left traversal phải kiểm tra boundary mới trước khi chạy.

### Deep answer (EN)

The guards preserve the invariant that every cell is emitted exactly once. They are specifically what handles degenerate final layers where height or width becomes one.

### Trả lời sâu (VI)

Các guard bảo toàn invariant mỗi cell chỉ được output đúng một lần, đặc biệt ở final layer suy biến chỉ còn một hàng hoặc một cột.

---

### Q2

**Q (EN):** What invariant do you maintain?

**Q (VI):** Bạn duy trì invariant gì?

### Short answer (EN)

The current boundaries enclose exactly the cells that have not yet been appended to the answer.

### Trả lời ngắn (VI)

Bốn boundary hiện tại bao đúng các cell chưa được đưa vào answer.

### Standard answer (EN)

At the beginning of every loop, all cells outside `[top..bottom] x [left..right]` have already been emitted exactly once in spiral order, while every cell inside is still unvisited.

### Trả lời chuẩn (VI)

Đầu mỗi vòng, mọi cell ngoài rectangle `[top..bottom] x [left..right]` đã được output đúng một lần theo spiral order, còn mọi cell bên trong vẫn chưa đọc.

---

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(mn)` time and `O(1)` auxiliary space excluding the output list.

### Trả lời ngắn (VI)

`O(mn)` thời gian và `O(1)` bộ nhớ phụ, không tính output list.

### Standard answer (EN)

Each matrix cell is appended exactly once. The four integer boundaries are the only auxiliary state, so the extra space does not grow with the matrix dimensions.

### Trả lời chuẩn (VI)

Mỗi cell được append đúng một lần. Chỉ có bốn biến boundary là auxiliary state nên extra space không tăng theo kích thước ma trận.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Duplicate center row or center column.
- Assume the matrix is square.
- Use a visited matrix when boundaries are sufficient.
- Update a boundary before consuming the corresponding edge.

---

## 4. Useful vocabulary / Từ vựng hữu ích

- boundary — biên
- perimeter — chu vi/lớp ngoài
- clockwise — theo chiều kim đồng hồ
- degenerate rectangle — hình chữ nhật suy biến
- unvisited region — vùng chưa duyệt
