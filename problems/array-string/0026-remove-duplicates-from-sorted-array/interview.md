# 26. Remove Duplicates from Sorted Array — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** Because the array is sorted, duplicates are adjacent. I keep a write pointer representing the number of unique values already stored. Starting from the second element, I compare each value with `nums[write - 1]`, the last unique value kept. If they differ, I write the new value at `nums[write]` and increment `write`. The result is `O(n)` time and `O(1)` extra space.

**VI:** Vì mảng đã sort nên duplicate nằm liền nhau. Em dùng write pointer đại diện cho số unique value đã lưu. Từ phần tử thứ hai, em so sánh giá trị hiện tại với `nums[write - 1]`, tức unique value cuối cùng đã giữ. Nếu khác, em ghi giá trị mới vào `nums[write]` và tăng `write`. Độ phức tạp là `O(n)` thời gian, `O(1)` bộ nhớ phụ.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why does the sorted property let you solve this without a set?

**Q (VI):** Vì sao mảng đã sort giúp giải mà không cần set?

### Short answer (EN)

Equal values are contiguous, so a new value only needs to be compared with the last unique value kept.

### Trả lời ngắn (VI)

Các giá trị bằng nhau nằm liên tiếp, nên chỉ cần so sánh với unique value cuối đã giữ.

### Standard answer (EN)

In a sorted array, once the value changes from `x` to `y`, `x` can never appear again later. Therefore detecting a new unique value is a local comparison rather than a global membership lookup.

### Trả lời chuẩn (VI)

Trong mảng sorted, khi giá trị đã chuyển từ `x` sang `y`, `x` sẽ không xuất hiện lại phía sau. Vì vậy việc phát hiện unique value mới chỉ cần so sánh cục bộ thay vì tra cứu toàn bộ lịch sử.

---

### Q2

**Q (EN):** Why do you initialize `write` to 1?

**Q (VI):** Tại sao khởi tạo `write = 1`?

### Short answer (EN)

The input is non-empty, and the first element is always the first unique value.

### Trả lời ngắn (VI)

Mảng không rỗng và phần tử đầu luôn là unique value đầu tiên.

### Standard answer (EN)

The constraints guarantee at least one element, so `nums[0]` is already part of the valid output. `write = 1` means one unique value has been accepted and index 1 is the next write position.

### Trả lời chuẩn (VI)

Constraint đảm bảo có ít nhất một phần tử nên `nums[0]` chắc chắn thuộc output. `write = 1` nghĩa là đã giữ một unique value và index 1 là vị trí ghi tiếp theo.

---

### Q3

**Q (EN):** Why compare with `nums[write - 1]` instead of always with `nums[read - 1]`?

**Q (VI):** Vì sao so sánh với `nums[write - 1]`?

### Short answer (EN)

It directly represents the last unique value in the output prefix.

### Trả lời ngắn (VI)

Vì đó chính là unique value cuối trong prefix kết quả.

### Deep answer (EN)

Comparing with the last kept value makes the invariant explicit and generalizes naturally to variants such as allowing at most two copies. The input is sorted, so the current value is new exactly when it differs from the last kept unique value.

### Trả lời sâu (VI)

So sánh với giá trị cuối đã giữ làm invariant rõ ràng và dễ tổng quát sang biến thể như cho phép tối đa hai bản sao. Vì input đã sort, giá trị hiện tại là mới đúng khi nó khác unique value cuối đã giữ.

---

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

---

### Q5

**Q (EN):** What happens if every element is identical?

**Q (VI):** Nếu mọi phần tử giống nhau thì sao?

### Short answer (EN)

Only the first value is kept, so the method returns `1`.

### Trả lời ngắn (VI)

Chỉ phần tử đầu được giữ nên hàm trả `1`.

---

## 3. Likely follow-up / Câu hỏi mở rộng hợp lý

**Q (EN):** How would you change the solution if each value could appear at most twice?

**Q (VI):** Nếu mỗi giá trị được phép xuất hiện tối đa hai lần thì thay đổi thế nào?

**EN:** I would keep a value when fewer than two values have been written, or when the current value differs from the value two positions behind the write pointer. That is exactly the pattern used by problem 80.

**VI:** Em sẽ giữ giá trị nếu mới ghi ít hơn hai phần tử, hoặc nếu giá trị hiện tại khác phần tử nằm cách write pointer hai vị trí. Đó chính là pattern của bài 80.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I start `write` at one because the first value is already valid. I scan from index one. If `nums[read]` differs from the last value in the unique prefix, I store it at `nums[write]` and advance `write`. Finally I return `write`.

**VI:** Em bắt đầu `write = 1` vì phần tử đầu đã hợp lệ. Em duyệt từ index 1. Nếu `nums[read]` khác giá trị cuối trong unique prefix, em ghi nó tại `nums[write]` rồi tăng `write`. Cuối cùng trả `write`.

---

## 5. Common reasoning checks / Bẫy tư duy

- Đừng dùng `HashSet` nếu mục tiêu là tận dụng sorted input và `O(1)` extra space.
- `write` là **số phần tử unique đã giữ**, đồng thời là vị trí ghi kế tiếp.
- Phần sau `k` không cần dọn sạch.
- Không được reorder các unique values; đề yêu cầu giữ relative order.
- Khi generalize sang bài 80, không thể chỉ so với phần tử ngay trước nữa.

---

## 6. Useful phrases / Cụm từ hữu ích

| English phrase | Ý nghĩa |
|---|---|
| duplicates are adjacent | các duplicate nằm liền nhau |
| last unique value | giá trị unique cuối cùng |
| valid output prefix | prefix kết quả hợp lệ |
| detect a boundary between values | phát hiện ranh giới giữa các giá trị |
| preserve relative order | giữ thứ tự tương đối |
