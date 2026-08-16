# 52. N-Queens II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I place one queen per row and track used columns and both diagonals. For each row I try only safe columns, mark the three constraints, recurse, and undo them afterward. When I reach row `n`, I found one valid solution.

**VI:** Tôi backtrack theo hàng và dùng ba cấu trúc đánh dấu để kiểm tra xung đột trong `O(1)`.

## 2. Core approach questions
**Q (EN):** Why do you recurse row by row?

**Q (VI):** Vì sao recurse theo từng hàng?

### Short answer (EN)
A valid solution has exactly one queen in each row.

### Trả lời ngắn (VI)
Mỗi lời giải hợp lệ có đúng một hậu trên mỗi hàng.

### Standard answer (EN)
Fixing one row per level removes row conflicts automatically and leaves only column and diagonal constraints to check.

### Trả lời chuẩn (VI)
Mỗi level cố định một hàng nên tự loại xung đột hàng, chỉ còn kiểm tra cột và đường chéo.

## 3. Why / correctness questions
**Q (EN):** How do diagonal indices work?

**Q (VI):** Chỉ số đường chéo hoạt động thế nào?

### Short answer (EN)
Cells on one diagonal share `row - col`; cells on the other share `row + col`.

### Trả lời ngắn (VI)
Một loại có cùng `row - col`, loại kia có cùng `row + col`.

### Standard answer (EN)
I offset `row - col` by `n - 1` so every diagonal index is non-negative.

### Trả lời chuẩn (VI)
Tôi cộng `n - 1` vào `row - col` để chỉ số luôn không âm.

## 4. Complexity questions
**Q (EN):** What is the search complexity?

**Q (VI):** Độ phức tạp tìm kiếm là gì?

### Short answer (EN)
A common upper-bound description is `O(n!)` time with `O(n)` extra space.

### Trả lời ngắn (VI)
Có thể mô tả cận trên là `O(n!)` thời gian và `O(n)` bộ nhớ phụ.

### Standard answer (EN)
Column uniqueness sharply reduces the choices at deeper rows; diagonal pruning reduces them further.

### Trả lời chuẩn (VI)
Cột duy nhất làm số lựa chọn giảm dần, và pruning đường chéo giảm thêm.

## 5. Edge-case questions
**Q (EN):** What is the answer for `n = 1`?

**Q (VI):** Đáp án với `n = 1` là gì?

### Short answer (EN)
One.

### Trả lời ngắn (VI)
Một.

### Standard answer (EN)
The only cell can contain the only queen, so there is exactly one solution.

### Trả lời chuẩn (VI)
Ô duy nhất chứa hậu duy nhất, nên có đúng một lời giải.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not scan the board to test attacks every time?

**Q (VI):** Vì sao không quét bàn cờ mỗi lần kiểm tra?

### Short answer (EN)
Boolean constraint arrays make each safety check constant time.

### Trả lời ngắn (VI)
Mảng đánh dấu giúp kiểm tra an toàn trong `O(1)`.

### Standard answer (EN)
Scanning previously placed queens repeats work that can be summarized by columns and diagonal occupancy.

### Trả lời chuẩn (VI)
Quét các hậu đã đặt lặp lại thông tin đã có thể lưu bằng trạng thái cột và đường chéo.

## 7. Code walkthrough questions
**Q (EN):** Why must you unmark after the recursive call?

**Q (VI):** Vì sao phải bỏ đánh dấu sau recursive call?

### Short answer (EN)
The next candidate in the same row must start from the previous state.

### Trả lời ngắn (VI)
Ứng viên kế tiếp trong cùng hàng phải bắt đầu từ trạng thái trước đó.

### Standard answer (EN)
Backtracking requires every temporary choice to be undone before exploring a sibling branch.

### Trả lời chuẩn (VI)
Backtracking yêu cầu hoàn tác lựa chọn tạm trước khi duyệt nhánh anh em.

## 8. Follow-up variations
**Q (EN):** How could you optimize the state further?

**Q (VI):** Có thể tối ưu trạng thái thêm thế nào?

### Short answer (EN)
Use bitmasks instead of boolean arrays.

### Trả lời ngắn (VI)
Dùng bitmask thay cho các mảng boolean.

### Standard answer (EN)
Bitmasks compact the same three constraint sets and can iterate available columns efficiently.

### Trả lời chuẩn (VI)
Bitmask nén ba tập constraint và có thể duyệt các cột khả dụng hiệu quả hơn.

## 9. Common interviewer traps
**Q (EN):** Do you need a full `n x n` board for this problem?

**Q (VI):** Có cần lưu cả bàn cờ `n x n` không?

### Short answer (EN)
No, because the output is only the count.

### Trả lời ngắn (VI)
Không, vì output chỉ là số lượng.

### Standard answer (EN)
Columns and diagonal occupancy contain all information needed for validity and counting.

### Trả lời chuẩn (VI)
Trạng thái cột và đường chéo đã chứa đủ thông tin để kiểm tra và đếm.

## 10. Useful phrases and vocabulary
- **place one queen per row** — đặt một hậu trên mỗi hàng
- **diagonal conflict** — xung đột đường chéo
- **constraint array** — mảng trạng thái ràng buộc
- **undo the placement** — hoàn tác vị trí đã đặt
