# 2. Add Two Numbers — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** The lists store digits in reverse order, so I can perform normal grade-school addition directly from the heads. I walk both lists together, add the two current digits plus a carry, append `sum % 10`, and update `carry = sum / 10`. I continue while either list has nodes or a carry remains. This takes `O(max(m,n))` time and `O(1)` auxiliary space excluding the output.

**VI:** Vì digits đã lưu reverse, em cộng trực tiếp từ head giống phép cộng có nhớ. Mỗi bước cộng hai digit hiện tại với carry, append `sum % 10`, cập nhật `carry = sum / 10`, và tiếp tục tới khi cả hai list lẫn carry đều hết.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why is reverse digit order helpful here?

**Q (VI):** Vì sao reverse order lại thuận lợi?

### Short answer (EN)

It places the least significant digit first, exactly where addition with carry must begin.

### Trả lời ngắn (VI)

Hàng đơn vị nằm ở head, đúng vị trí ta cần bắt đầu phép cộng có nhớ.

### Q2

**Q (EN):** Why use a dummy node?

**Q (VI):** Vì sao dùng dummy node?

### Short answer (EN)

It lets every result digit be appended through the same code path without special-casing the head.

### Trả lời ngắn (VI)

Dummy giúp mọi digit đều append theo cùng một logic, không phải xử lý riêng node đầu.

### Standard answer (EN)

The output head does not exist before the first digit is produced. A dummy node gives us a stable predecessor, so `tail.next = new ListNode(...)` works for both the first and all later digits. At the end we return `dummy.next`.

### Trả lời chuẩn (VI)

Trước digit đầu tiên chưa có result head. Dummy tạo một predecessor cố định để thao tác append luôn giống nhau; cuối cùng trả `dummy.next`.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What invariant do you maintain during the loop?

**Q (VI):** Invariant của loop là gì?

### Standard answer (EN)

Before each iteration, the result list contains the correct sum digits for all lower positions already processed, and `carry` is exactly the carry into the current position. Adding the available current digits and that carry produces the correct next digit and next carry, so the invariant is preserved.

### Trả lời chuẩn (VI)

Trước mỗi iteration, result đã chứa đúng các digit ở những vị trí thấp hơn và `carry` chính xác là phần nhớ đi vào vị trí hiện tại. Cộng hai current digit với carry tạo đúng digit và carry kế tiếp, nên invariant được duy trì.

### Q4

**Q (EN):** Why can the result have one more node than both inputs?

**Q (VI):** Vì sao result có thể dài hơn cả hai input một node?

### Short answer (EN)

A final carry can create a new most significant digit.

### Trả lời ngắn (VI)

Carry cuối có thể tạo thêm chữ số cao nhất mới.

### Standard answer (EN)

The maximum sum of two digits and a carry is `9 + 9 + 1 = 19`. At the last input position that can leave carry `1`, so the loop must append one extra node after both lists are exhausted.

### Trả lời chuẩn (VI)

Tổng lớn nhất một vị trí là `19`; ở vị trí cuối có thể còn carry `1`, nên phải tạo thêm một node sau khi hai list đã hết.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5

**Q (EN):** What are the time and space complexities?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(max(m,n))` time and `O(1)` auxiliary space, excluding the required output list.

### Standard answer (EN)

Each input node is visited once, and there is at most one extra iteration for a final carry. The algorithm stores only pointers, a sum, and a carry. The newly allocated result nodes are required output rather than auxiliary working memory.

### Trả lời chuẩn (VI)

Mỗi input node được đi qua đúng một lần, tối đa thêm một iteration cho final carry. Ngoài output list, thuật toán chỉ giữ vài pointer và số nguyên.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6

**Q (EN):** How do you handle lists of different lengths?

**Q (VI):** Hai list dài khác nhau thì xử lý thế nào?

### Standard answer (EN)

When one pointer is null, I simply contribute zero for that list and continue processing the other list and the carry. That avoids padding or modifying either input.

### Trả lời chuẩn (VI)

Khi một pointer đã `null`, coi digit của list đó là `0` rồi tiếp tục với list còn lại và carry; không cần pad hay sửa input.

### Q7

**Q (EN):** Could repeated carries cause a problem?

**Q (VI):** Carry lan liên tiếp qua nhiều số `9` có gây vấn đề không?

### Short answer (EN)

No. The same carry rule is applied independently at every position.

### Trả lời ngắn (VI)

Không. Mỗi vị trí đều áp dụng cùng công thức digit/carry.

---

## 6. Alternative approaches / Hướng khác

### Q8

**Q (EN):** Why not reconstruct the two integers first?

**Q (VI):** Vì sao không dựng hai số nguyên rồi cộng?

### Standard answer (EN)

The lists can contain up to 100 digits, far beyond primitive integer ranges. Converting to a numeric type either overflows or requires arbitrary-precision arithmetic, while direct digit addition is simple, linear, and works for any permitted length.

### Trả lời chuẩn (VI)

Input có thể tới 100 digits nên `int`/`long` sẽ overflow. Dùng big integer là không cần thiết; cộng trực tiếp từng digit vừa tuyến tính vừa đúng với representation.

---

## 7. Code walkthrough / Walkthrough code

### Q9

**Q (EN):** Why is the loop condition `l1 != null || l2 != null || carry != 0`?

**Q (VI):** Vì sao condition phải có cả `carry != 0`?

### Standard answer (EN)

The first two clauses ensure all input digits are consumed. The carry clause handles the case where both lists end but the highest processed column generates one final digit.

### Trả lời chuẩn (VI)

Hai điều kiện đầu đảm bảo xử lý hết input; `carry != 0` đảm bảo final carry vẫn được append thành digit mới.

---

## 8. Follow-up variations / Biến thể follow-up

- Nếu digits lưu **forward order**, có thể dùng stack hoặc recursion để xử lý từ hàng đơn vị.
- Nếu yêu cầu reuse input nodes, cần quản lý mutation cẩn thận và vẫn phải xử lý final carry.
- Nếu base không phải 10, thay `% 10` và `/ 10` bằng `% base` và `/ base`.
- Nếu cần cộng nhiều hơn hai list, có thể generalize tổng digit tại mỗi position.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Quên final carry.
- Dừng khi list ngắn hơn hết node.
- Convert sang primitive integer và overflow.
- Nhầm reverse representation `[2,4,3]` thành `243` thay vì `342`.
- Tính auxiliary space gồm output mà không nói rõ convention.

---

## 10. Useful vocabulary / Từ vựng hữu ích

- **least significant digit** — chữ số hàng thấp nhất.
- **most significant digit** — chữ số hàng cao nhất.
- **carry propagation** — lan truyền số nhớ.
- **digit-by-digit addition** — cộng từng chữ số.
- **dummy head** — node giả ở đầu.
- **append a result digit** — nối thêm một chữ số kết quả.
- **primitive integer overflow** — tràn kiểu số nguyên primitive.
