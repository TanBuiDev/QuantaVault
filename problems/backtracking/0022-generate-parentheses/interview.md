# 22. Generate Parentheses — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I use backtracking with two counters. I add an opening parenthesis while `open < n`, and I add a closing parenthesis only when `close < open`. This keeps every prefix valid and generates each valid answer once.

**VI:** Tôi dùng backtracking với hai bộ đếm, chỉ mở rộng prefix còn hợp lệ.

## 2. Core approach questions
**Q (EN):** What state do you keep during backtracking?

**Q (VI):** Bạn giữ trạng thái gì khi backtracking?

### Short answer (EN)
The current string and the counts of opening and closing parentheses.

### Trả lời ngắn (VI)
Prefix hiện tại cùng số dấu mở và dấu đóng.

### Standard answer (EN)
The counters are enough to decide which next characters keep the prefix valid.

### Trả lời chuẩn (VI)
Hai bộ đếm đủ để quyết định ký tự tiếp theo nào còn hợp lệ.

## 3. Why / correctness questions
**Q (EN):** Why can you reject a prefix when `close > open`?

**Q (VI):** Vì sao có thể loại prefix khi `close > open`?

### Short answer (EN)
No later characters can repair a prefix that already has too many closing parentheses.

### Trả lời ngắn (VI)
Một prefix đã có quá nhiều dấu đóng thì phần sau không thể sửa lại được.

### Standard answer (EN)
Every well-formed parenthesis string requires each prefix to have at least as many opening parentheses as closing parentheses.

### Trả lời chuẩn (VI)
Mọi chuỗi ngoặc hợp lệ đều cần số dấu mở trong mỗi prefix không nhỏ hơn số dấu đóng.

## 4. Complexity questions
**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
`O(C_n * n)` time and `O(n)` recursion space excluding output.

### Trả lời ngắn (VI)
`O(C_n * n)` thời gian và `O(n)` stack ngoài output.

### Standard answer (EN)
There are `C_n` valid outputs and each output has length `2n`.

### Trả lời chuẩn (VI)
Có `C_n` đáp án hợp lệ và mỗi đáp án dài `2n`.

## 5. Edge-case questions
**Q (EN):** What happens for `n = 1`?

**Q (VI):** Với `n = 1` thì sao?

### Short answer (EN)
The only result is `()`.

### Trả lời ngắn (VI)
Chỉ có `()`.

### Standard answer (EN)
The same invariant works without any special-case code.

### Trả lời chuẩn (VI)
Invariant vẫn hoạt động mà không cần nhánh đặc biệt.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not generate every string and validate it afterward?

**Q (VI):** Vì sao không sinh mọi chuỗi rồi kiểm tra?

### Short answer (EN)
That explores many prefixes that can never become valid.

### Trả lời ngắn (VI)
Cách đó duyệt nhiều prefix chắc chắn không thể hợp lệ.

### Standard answer (EN)
Backtracking prunes invalid prefixes early and follows only feasible states.

### Trả lời chuẩn (VI)
Backtracking cắt nhánh sai sớm và chỉ đi qua trạng thái khả thi.

## 7. Code walkthrough questions
**Q (EN):** Why do you remove the last character after recursion?

**Q (VI):** Vì sao phải xóa ký tự cuối sau recursion?

### Short answer (EN)
It restores the prefix before exploring the next branch.

### Trả lời ngắn (VI)
Để khôi phục prefix trước khi thử nhánh khác.

### Standard answer (EN)
The same `StringBuilder` is reused, so each recursive choice must be undone.

### Trả lời chuẩn (VI)
Ta tái sử dụng `StringBuilder`, nên mỗi lựa chọn phải được hoàn tác.

## 8. Follow-up variations
**Q (EN):** Could you solve it with dynamic programming?

**Q (VI):** Có thể giải bằng dynamic programming không?

### Short answer (EN)
Yes, but backtracking is simpler for directly enumerating the valid strings.

### Trả lời ngắn (VI)
Có, nhưng backtracking trực tiếp và đơn giản hơn cho việc liệt kê đáp án.

### Standard answer (EN)
DP can combine smaller valid sets, while backtracking naturally enforces the prefix constraint.

### Trả lời chuẩn (VI)
DP có thể ghép các tập nhỏ hơn, còn backtracking tự nhiên giữ constraint của prefix.

## 9. Common interviewer traps
**Q (EN):** Is the running time simply `O(2^(2n))`?

**Q (VI):** Có nên kết luận thời gian chỉ là `O(2^(2n))` không?

### Short answer (EN)
That is a loose brute-force bound; output-sensitive analysis uses the Catalan count.

### Trả lời ngắn (VI)
Đó là cận vét cạn lỏng; phân tích sát hơn dựa trên số Catalan.

### Standard answer (EN)
The algorithm prunes invalid prefixes and produces `C_n` outputs, each of length `O(n)`.

### Trả lời chuẩn (VI)
Thuật toán cắt nhánh sai và tạo `C_n` kết quả, mỗi kết quả dài `O(n)`.

## 10. Useful phrases and vocabulary
- **well-formed parentheses** — dấu ngoặc hợp lệ
- **prefix invariant** — invariant trên prefix
- **prune a branch** — cắt một nhánh
- **undo a choice** — hoàn tác lựa chọn
