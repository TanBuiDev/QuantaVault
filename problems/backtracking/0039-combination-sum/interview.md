# 39. Combination Sum — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I use backtracking with a start index and a remaining target. I only choose candidates from the start index onward to avoid order-based duplicates. After choosing a value, I recurse with the same index because the value can be reused.

**VI:** Tôi backtrack với `start index` và `remaining`, cho phép tái sử dụng cùng ứng viên nhưng không sinh hoán vị trùng.

## 2. Core approach questions
**Q (EN):** Why do you need a start index?

**Q (VI):** Vì sao cần `start index`?

### Short answer (EN)
It prevents generating the same combination in different orders.

### Trả lời ngắn (VI)
Nó ngăn cùng một tổ hợp xuất hiện dưới nhiều thứ tự.

### Standard answer (EN)
Every recursive level can only use the current candidate or candidates after it, so index sequences are non-decreasing.

### Trả lời chuẩn (VI)
Mỗi level chỉ dùng ứng viên hiện tại hoặc phía sau, nên chuỗi chỉ số không giảm.

## 3. Why / correctness questions
**Q (EN):** Why recurse with `i` instead of `i + 1` after choosing a value?

**Q (VI):** Vì sao recurse với `i` thay vì `i + 1`?

### Short answer (EN)
The same candidate may be chosen an unlimited number of times.

### Trả lời ngắn (VI)
Vì cùng ứng viên có thể được chọn không giới hạn số lần.

### Standard answer (EN)
Keeping `i` allows reuse while the start-index rule still prevents reordered duplicates.

### Trả lời chuẩn (VI)
Giữ `i` cho phép dùng lại nhưng vẫn không tạo duplicate do thứ tự.

## 4. Complexity questions
**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
The search is exponential in the worst case.

### Trả lời ngắn (VI)
Search tree là exponential trong trường hợp xấu nhất.

### Standard answer (EN)
The branching depends on the candidates and target, and output size can also be exponential.

### Trả lời chuẩn (VI)
Số nhánh phụ thuộc dữ liệu và `target`; số lượng output cũng có thể rất lớn.

## 5. Edge-case questions
**Q (EN):** What if no combination reaches the target?

**Q (VI):** Nếu không có tổ hợp nào đạt target thì sao?

### Short answer (EN)
Return an empty list.

### Trả lời ngắn (VI)
Trả về danh sách rỗng.

### Standard answer (EN)
All branches end without reaching remaining zero, so no result is recorded.

### Trả lời chuẩn (VI)
Mọi nhánh kết thúc mà `remaining` chưa bằng 0 nên không có đáp án được ghi nhận.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why sort the candidates first?

**Q (VI):** Vì sao sort `candidates` trước?

### Short answer (EN)
It lets me stop the loop when the current value exceeds the remaining target.

### Trả lời ngắn (VI)
Nó cho phép dừng vòng lặp khi giá trị hiện tại vượt `remaining`.

### Standard answer (EN)
Sorting is not required for correctness, but it enables simple pruning and deterministic traversal.

### Trả lời chuẩn (VI)
Sort không bắt buộc để đúng, nhưng giúp pruning đơn giản và thứ tự duyệt ổn định.

## 7. Code walkthrough questions
**Q (EN):** Why copy the current list before adding it to the result?

**Q (VI):** Vì sao phải copy `current` trước khi thêm vào result?

### Short answer (EN)
The same mutable list is reused by backtracking.

### Trả lời ngắn (VI)
Backtracking tái sử dụng cùng một list mutable.

### Standard answer (EN)
Without a copy, later undo operations would modify the combinations already stored in the result.

### Trả lời chuẩn (VI)
Nếu không copy, các thao tác undo sau đó sẽ làm thay đổi đáp án đã lưu.

## 8. Follow-up variations
**Q (EN):** What changes if each candidate may be used only once?

**Q (VI):** Nếu mỗi ứng viên chỉ được dùng một lần thì thay đổi gì?

### Short answer (EN)
Recurse with `i + 1` after choosing it.

### Trả lời ngắn (VI)
Sau khi chọn thì recurse với `i + 1`.

### Standard answer (EN)
The state transition must advance past the chosen index, and duplicate input values would need extra handling.

### Trả lời chuẩn (VI)
Transition phải đi qua chỉ số đã chọn; nếu input có duplicate thì cần xử lý thêm.

## 9. Common interviewer traps
**Q (EN):** Does the output order matter?

**Q (VI):** Thứ tự output có quan trọng không?

### Short answer (EN)
No, the problem allows any order.

### Trả lời ngắn (VI)
Không, đề cho phép bất kỳ thứ tự nào.

### Standard answer (EN)
I still use a deterministic traversal because it simplifies testing and reasoning.

### Trả lời chuẩn (VI)
Tôi vẫn duyệt ổn định để dễ test và giải thích.

## 10. Useful phrases and vocabulary
- **remaining target** — phần target còn lại
- **reuse the same candidate** — dùng lại cùng ứng viên
- **order-based duplicate** — duplicate do khác thứ tự
- **prune the branch** — cắt nhánh
