# 80. Remove Duplicates from Sorted Array II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use a write pointer over the sorted array. For each value, I keep it if fewer than two values have been written, or if it differs from the value two positions behind the write pointer. If it equals `nums[write - 2]`, keeping it would create a third copy. This preserves order, modifies the array in place, runs in `O(n)` time, and uses `O(1)` extra space.

**VI:** Em dùng write pointer trên mảng đã sort. Với mỗi giá trị, em giữ nó nếu mới ghi ít hơn hai phần tử, hoặc nếu nó khác giá trị nằm cách write pointer hai vị trí. Nếu nó bằng `nums[write - 2]`, giữ thêm sẽ tạo bản sao thứ ba. Cách này giữ thứ tự, sửa tại chỗ, chạy `O(n)` và dùng `O(1)` bộ nhớ phụ.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why do you compare against `nums[write - 2]`?

**Q (VI):** Tại sao so sánh với `nums[write - 2]`?

### Short answer (EN)

Because if the current value equals the value two kept positions back, two copies are already present and the current one would be the third.

### Trả lời ngắn (VI)

Vì nếu current bằng phần tử cách hai vị trí đã giữ, đã có hai bản sao và current sẽ là bản sao thứ ba.

### Standard answer (EN)

The kept prefix is sorted. When `write >= 2`, if `current == nums[write - 2]`, the two most recent relevant kept positions already contain that same value. Therefore the current value must be skipped. Otherwise it is safe to keep.

### Trả lời chuẩn (VI)

Prefix đã giữ vẫn sorted. Khi `write >= 2`, nếu `current == nums[write - 2]`, hai vị trí liên quan gần nhất đã chứa cùng giá trị đó nên current phải bị bỏ qua. Nếu khác thì giữ vẫn an toàn.

---

### Q2

**Q (EN):** How is this different from problem 26?

**Q (VI):** Bài này khác bài 26 như thế nào?

### Short answer (EN)

Problem 26 allows one copy; this problem allows two, so the comparison moves from `write - 1` to `write - 2`.

### Trả lời ngắn (VI)

Bài 26 cho một bản sao; bài này cho hai nên vị trí so sánh chuyển từ `write - 1` sang `write - 2`.

### Deep answer (EN)

Both are instances of the same rule: if at most `R` copies are allowed, keep the current value when `write < R` or `current != nums[write - R]`. Problem 26 has `R = 1`; problem 80 has `R = 2`.

### Trả lời sâu (VI)

Cả hai là cùng một rule tổng quát: nếu cho tối đa `R` bản sao, giữ current khi `write < R` hoặc `current != nums[write - R]`. Bài 26 có `R = 1`, bài 80 có `R = 2`.

---

### Q3

**Q (EN):** Why is checking the original input two positions back not enough?

**Q (VI):** Vì sao không nên chỉ nhìn input gốc cách hai vị trí?

### Short answer (EN)

Because some values have already been skipped; the decision must depend on the compacted output prefix.

### Trả lời ngắn (VI)

Vì một số phần tử đã bị bỏ qua; quyết định phải dựa vào prefix kết quả đã compact.

### Standard answer (EN)

After skipping extra duplicates, the read index and write index no longer represent the same logical sequence. `nums[write - 2]` tells me what has actually been kept, which is the information required to enforce the output constraint.

### Trả lời chuẩn (VI)

Sau khi bỏ các duplicate thừa, read index và write index không còn đại diện cùng một chuỗi logic. `nums[write - 2]` phản ánh dữ liệu thực sự đã giữ, đúng thứ cần để kiểm soát output.

---

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

---

### Q5

**Q (EN):** What happens for an array containing only one value repeated many times?

**Q (VI):** Nếu mảng chỉ có một giá trị lặp rất nhiều lần thì sao?

### Short answer (EN)

The first two copies are kept and all later copies are skipped, so `k = 2` when the input length is at least two.

### Trả lời ngắn (VI)

Hai bản sao đầu được giữ, các bản sao sau bị bỏ; nếu mảng có ít nhất hai phần tử thì `k = 2`.

---

## 3. Likely follow-up / Câu hỏi mở rộng hợp lý

**Q (EN):** How would you allow at most `R` copies instead of exactly two?

**Q (VI):** Nếu cho phép tối đa `R` bản sao thì làm thế nào?

**EN:** Replace the constant `2` with `R`: keep a value if `write < R` or if it differs from `nums[write - R]`. This works because the array and the kept prefix remain sorted.

**VI:** Thay hằng số `2` bằng `R`: giữ giá trị nếu `write < R` hoặc nếu nó khác `nums[write - R]`. Cách này đúng vì input và prefix đã giữ luôn sorted.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I start `write` at zero and iterate through every value. The first two values are automatically accepted. After that, I compare the current value with `nums[write - 2]`. If they differ, I write the current value at `nums[write]` and increment `write`. Finally I return `write`.

**VI:** Em bắt đầu `write = 0` và duyệt mọi giá trị. Hai giá trị đầu tự động được chấp nhận. Sau đó em so sánh current với `nums[write - 2]`; nếu khác thì ghi current vào `nums[write]`, tăng `write`, cuối cùng trả `write`.

---

## 5. Common reasoning checks / Bẫy tư duy

- Điều kiện phải dựa trên **kept prefix**, không phải chỉ vị trí read trong input gốc.
- `write < 2` bảo vệ khỏi index âm và cho phép hai phần tử đầu hợp lệ.
- Không cần biến count riêng nếu dùng write-pointer invariant.
- Đề yêu cầu `O(1)` extra memory; một hash map đếm tần suất là không cần thiết.
- Generalization `R` chỉ đúng đẹp như vậy vì input đã sort.

---

## 6. Useful phrases / Cụm từ hữu ích

| English phrase | Ý nghĩa |
|---|---|
| allow at most two copies | cho phép tối đa hai bản sao |
| compacted output prefix | prefix output đã compact |
| the third copy must be skipped | bản sao thứ ba phải bỏ |
| generalize the duplicate limit | tổng quát giới hạn duplicate |
| compare against the value R positions back | so sánh với giá trị cách R vị trí |
