# Interview Preparation / Chuẩn bị phỏng vấn — 17. Letter Combinations of a Phone Number

## 1. 30-second solution pitch

**Q (EN):** Can you summarize your solution?

**Q (VI):** Bạn có thể tóm tắt lời giải không?

### Short answer (EN)
I use backtracking. Each recursion level handles one digit and tries every mapped letter.

### Trả lời ngắn (VI)
Tôi dùng backtracking. Mỗi tầng đệ quy xử lý một chữ số và thử mọi chữ cái được ánh xạ.

### Standard answer (EN)
I map each digit to its letters, build a string from left to right, and recurse to the next digit. When the path length reaches the number of digits, I add it to the result. After each recursive call, I remove the last character to explore the next choice.

### Trả lời chuẩn (VI)
Tôi ánh xạ từng chữ số sang nhóm chữ cái, xây chuỗi từ trái sang phải và đệ quy sang chữ số tiếp theo. Khi đường đi đủ độ dài, tôi thêm nó vào kết quả. Sau mỗi lời gọi đệ quy, tôi xóa ký tự cuối để thử lựa chọn tiếp theo.

## 2. Core approach questions

**Q (EN):** Why is backtracking a natural fit here?

**Q (VI):** Vì sao backtracking phù hợp tự nhiên với bài này?

### Short answer (EN)
Because each digit creates a small set of choices and we need every complete combination.

### Trả lời ngắn (VI)
Vì mỗi chữ số tạo ra một nhóm lựa chọn nhỏ và ta cần liệt kê mọi tổ hợp hoàn chỉnh.

### Standard answer (EN)
The search space is a decision tree. One level corresponds to one digit, and each outgoing branch is one mapped letter. Backtracking visits every root-to-leaf path exactly once.

### Trả lời chuẩn (VI)
Không gian tìm kiếm là một cây quyết định. Mỗi tầng ứng với một chữ số, mỗi nhánh là một chữ cái. Backtracking đi qua mỗi đường từ gốc tới lá đúng một lần.

## 3. Why / correctness questions

**Q (EN):** How do you know no valid combination is missed?

**Q (VI):** Làm sao biết không bỏ sót tổ hợp hợp lệ?

### Short answer (EN)
At every digit I try every mapped letter before returning.

### Trả lời ngắn (VI)
Ở mỗi chữ số tôi thử toàn bộ chữ cái được ánh xạ trước khi quay lui.

### Standard answer (EN)
Every valid answer chooses exactly one mapped letter per digit. The recursion enumerates all choices for digit 0, then all choices for digit 1, and so on, so every valid choice sequence is generated.

### Trả lời chuẩn (VI)
Mỗi đáp án hợp lệ chọn đúng một chữ cái cho mỗi chữ số. Đệ quy liệt kê toàn bộ lựa chọn ở từng vị trí nên mọi chuỗi lựa chọn hợp lệ đều được sinh ra.

## 4. Complexity questions

**Q (EN):** What is the time complexity?

**Q (VI):** Độ phức tạp thời gian là gì?

### Short answer (EN)
`O(4^n * n)` in the worst case including materializing the output strings.

### Trả lời ngắn (VI)
Tệ nhất là `O(4^n * n)` nếu tính cả việc tạo các chuỗi kết quả.

### Standard answer (EN)
Each digit has at most four letters, so there are at most `4^n` combinations. Copying each completed path into a String costs `O(n)`, giving `O(4^n * n)` worst-case time.

### Trả lời chuẩn (VI)
Mỗi chữ số có tối đa bốn chữ cái nên có tối đa `4^n` tổ hợp. Mỗi lần chuyển path thành String tốn `O(n)`, nên tổng tệ nhất là `O(4^n * n)`.

## 5. Edge-case questions

**Q (EN):** What changes for digits 7 and 9?

**Q (VI):** Chữ số 7 và 9 khác gì?

### Short answer (EN)
They map to four letters instead of three.

### Trả lời ngắn (VI)
Chúng ánh xạ tới bốn chữ cái thay vì ba.

### Standard answer (EN)
Nothing changes in the algorithm. The mapping table stores four letters for 7 and 9, so the loop naturally explores one extra branch.

### Trả lời chuẩn (VI)
Thuật toán không cần đổi. Bảng mapping chứa bốn chữ cái cho 7 và 9 nên vòng lặp tự nhiên duyệt thêm một nhánh.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Could you solve it iteratively?

**Q (VI):** Có thể giải bằng iterative không?

### Short answer (EN)
Yes. I can repeatedly expand a list of partial strings for each digit.

### Trả lời ngắn (VI)
Có. Tôi có thể mở rộng dần danh sách chuỗi tạm theo từng chữ số.

### Standard answer (EN)
An iterative expansion works and has the same output complexity. I prefer backtracking because it mirrors the decision tree directly and needs only one mutable path besides the result.

### Trả lời chuẩn (VI)
Cách mở rộng iterative cũng đúng và có độ phức tạp output tương tự. Tôi ưu tiên backtracking vì nó phản ánh trực tiếp cây quyết định và chỉ cần một mutable path ngoài result.

## 7. Code walkthrough questions

**Q (EN):** Why do you remove the last character after recursion?

**Q (VI):** Vì sao phải xóa ký tự cuối sau lời gọi đệ quy?

### Short answer (EN)
To restore the path before trying the next letter.

### Trả lời ngắn (VI)
Để khôi phục path trước khi thử chữ cái kế tiếp.

### Standard answer (EN)
The same StringBuilder is reused across sibling branches. Removing the last character undoes the current choice, which is the backtracking step.

### Trả lời chuẩn (VI)
Cùng một StringBuilder được dùng lại cho các nhánh anh em. Xóa ký tự cuối chính là undo lựa chọn hiện tại, tức bước backtracking.

## 8. Follow-up variations

**Q (EN):** How would the solution change if some digits had many more letters?

**Q (VI):** Nếu một số chữ số có nhiều chữ cái hơn thì lời giải thay đổi thế nào?

### Short answer (EN)
The algorithm stays the same; only the branching factor changes.

### Trả lời ngắn (VI)
Thuật toán giữ nguyên; chỉ branching factor thay đổi.

### Standard answer (EN)
I would keep the mapping data-driven. The recursion does not depend on a fixed number of letters, so only the total number of generated combinations changes.

### Trả lời chuẩn (VI)
Tôi vẫn giữ mapping theo dữ liệu. Đệ quy không phụ thuộc số lượng chữ cái cố định, nên chỉ số lượng tổ hợp sinh ra thay đổi.

## 9. Common interviewer traps

**Q (EN):** Is the auxiliary space really `O(4^n)`?

**Q (VI):** Auxiliary space có thật sự là `O(4^n)` không?

### Short answer (EN)
No, that includes output. The recursion and current path use `O(n)` auxiliary space.

### Trả lời ngắn (VI)
Không, `4^n` liên quan đến output. Recursion và current path chỉ dùng `O(n)` auxiliary space.

### Standard answer (EN)
If the interviewer excludes the required result list, the extra working space is the recursion depth plus StringBuilder, both `O(n)`. The output itself is exponential because the problem asks us to return all combinations.

### Trả lời chuẩn (VI)
Nếu không tính result bắt buộc, bộ nhớ làm việc chỉ gồm độ sâu đệ quy và StringBuilder, đều `O(n)`. Output tăng theo cấp số mũ vì đề yêu cầu trả toàn bộ tổ hợp.

## 10. Useful phrases and vocabulary

- **mapped letters** — các chữ cái được ánh xạ
- **branching factor** — số nhánh lựa chọn tại một trạng thái
- **current path** — đường đi hiện tại
- **undo the choice** — hoàn tác lựa chọn
- **enumerate all combinations** — liệt kê toàn bộ tổ hợp
