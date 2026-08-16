# 77. Combinations — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I use backtracking with a start value. After choosing a number, I only try larger numbers, so every combination is generated in increasing order and appears once. I also prune when the remaining range cannot fill the missing positions.

**VI:** Tôi backtrack với `start`, luôn chọn số tăng dần và prune khi không còn đủ ứng viên.

## 2. Core approach questions
**Q (EN):** Why do you pass `value + 1` to the next recursive call?

**Q (VI):** Vì sao truyền `value + 1` cho lần recursion tiếp theo?

### Short answer (EN)
Each number can be chosen only once and order does not matter.

### Trả lời ngắn (VI)
Mỗi số chỉ được chọn một lần và thứ tự không quan trọng.

### Standard answer (EN)
Restricting later choices to larger values gives each unordered combination one canonical increasing representation.

### Trả lời chuẩn (VI)
Chỉ chọn số lớn hơn tạo một biểu diễn tăng dần duy nhất cho mỗi tổ hợp không thứ tự.

## 3. Why / correctness questions
**Q (EN):** Why are there no duplicate combinations?

**Q (VI):** Vì sao không có tổ hợp trùng?

### Short answer (EN)
Every recursive path is strictly increasing.

### Trả lời ngắn (VI)
Mỗi đường recursion tăng nghiêm ngặt.

### Standard answer (EN)
A set of chosen values has exactly one sorted order, and that is the only order the search can generate.

### Trả lời chuẩn (VI)
Mỗi tập giá trị chỉ có một thứ tự tăng dần, và search chỉ sinh đúng thứ tự đó.

## 4. Complexity questions
**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
`O(k * C(n,k))` time and `O(k)` auxiliary space excluding output.

### Trả lời ngắn (VI)
`O(k * C(n,k))` thời gian và `O(k)` bộ nhớ phụ ngoài output.

### Standard answer (EN)
There are `C(n,k)` results and copying each completed combination costs `O(k)`.

### Trả lời chuẩn (VI)
Có `C(n,k)` kết quả và copy mỗi tổ hợp tốn `O(k)`.

## 5. Edge-case questions
**Q (EN):** What happens when `k == n`?

**Q (VI):** Khi `k == n` thì sao?

### Short answer (EN)
There is exactly one combination: all numbers from 1 to n.

### Trả lời ngắn (VI)
Chỉ có một tổ hợp gồm toàn bộ các số từ 1 đến `n`.

### Standard answer (EN)
The pruning bound leaves only the forced increasing sequence.

### Trả lời chuẩn (VI)
Cận pruning khiến chỉ còn chuỗi tăng dần bắt buộc.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not generate every subset and keep those of size k?

**Q (VI):** Vì sao không sinh mọi subset rồi giữ subset có kích thước k?

### Short answer (EN)
That explores many subsets with the wrong size.

### Trả lời ngắn (VI)
Cách đó duyệt nhiều subset có kích thước không cần thiết.

### Standard answer (EN)
Direct combination backtracking explores states targeted to exactly `k` chosen values.

### Trả lời chuẩn (VI)
Backtracking trực tiếp tập trung vào trạng thái dẫn tới đúng `k` phần tử.

## 7. Code walkthrough questions
**Q (EN):** What does `n - need + 1` mean?

**Q (VI):** `n - need + 1` có ý nghĩa gì?

### Short answer (EN)
It is the latest value I can choose while still leaving enough values to finish.

### Trả lời ngắn (VI)
Đó là giá trị muộn nhất có thể chọn mà vẫn còn đủ số để hoàn thành.

### Standard answer (EN)
If I choose anything larger, the remaining count from that point to `n` would be smaller than the number of positions still needed.

### Trả lời chuẩn (VI)
Nếu chọn lớn hơn thì số ứng viên còn lại đến `n` sẽ ít hơn số vị trí còn thiếu.

## 8. Follow-up variations
**Q (EN):** How would the solution change if repetition were allowed?

**Q (VI):** Nếu cho phép lặp lại một số thì thay đổi gì?

### Short answer (EN)
I would recurse with the same value or index instead of advancing past it.

### Trả lời ngắn (VI)
Tôi sẽ recurse với cùng giá trị/chỉ số thay vì bỏ qua nó.

### Standard answer (EN)
The transition changes from a strictly increasing sequence to a non-decreasing sequence.

### Trả lời chuẩn (VI)
Transition chuyển từ chuỗi tăng nghiêm ngặt sang không giảm.

## 9. Common interviewer traps
**Q (EN):** Does result order matter?

**Q (VI):** Thứ tự kết quả có quan trọng không?

### Short answer (EN)
No, the problem accepts any order.

### Trả lời ngắn (VI)
Không, đề chấp nhận bất kỳ thứ tự nào.

### Standard answer (EN)
I still use deterministic increasing traversal because it naturally prevents duplicates and simplifies testing.

### Trả lời chuẩn (VI)
Tôi vẫn duyệt tăng dần để tránh duplicate tự nhiên và dễ kiểm thử.

## 10. Useful phrases and vocabulary
- **choose k values** — chọn `k` giá trị
- **strictly increasing path** — đường đi tăng nghiêm ngặt
- **canonical representation** — biểu diễn chuẩn duy nhất
- **prune impossible starts** — cắt các điểm bắt đầu không thể hoàn thành
