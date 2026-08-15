# 27. Remove Element — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I treat the array as an in-place compaction problem. I keep a write pointer starting at zero and scan every value. Whenever the current value is not equal to `val`, I write it at `nums[write]` and increment `write`. At the end, `write` is both the number of kept elements and the length of the valid prefix. This takes `O(n)` time and `O(1)` extra space.

**VI:** Em xem bài này như bài nén mảng tại chỗ. Em giữ một write pointer bắt đầu ở `0` và duyệt từng giá trị. Khi giá trị hiện tại khác `val`, em ghi nó vào `nums[write]` rồi tăng `write`. Cuối cùng `write` vừa là số phần tử được giữ vừa là độ dài prefix hợp lệ. Độ phức tạp là `O(n)` thời gian, `O(1)` bộ nhớ phụ.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why don't you actually delete elements from the array?

**Q (VI):** Tại sao bạn không xóa thật các phần tử khỏi mảng?

### Short answer (EN)

Because the judge only cares about the first `k` positions; Java arrays have fixed length.

### Trả lời ngắn (VI)

Vì judge chỉ quan tâm `k` vị trí đầu và mảng Java có độ dài cố định.

### Standard answer (EN)

The contract defines a logical length `k`. I only need to compact the kept values into `nums[0..k-1]`. Values after that prefix are irrelevant, so physical deletion is unnecessary.

### Trả lời chuẩn (VI)

Contract định nghĩa độ dài logic `k`. Em chỉ cần gom các giá trị cần giữ vào `nums[0..k-1]`. Phần sau prefix đó không được judge quan tâm nên không cần xóa vật lý.

---

### Q2

**Q (EN):** What does the write pointer represent?

**Q (VI):** Write pointer đại diện cho điều gì?

### Short answer (EN)

It is the next position for a kept value and also the current count of kept values.

### Trả lời ngắn (VI)

Nó vừa là vị trí ghi tiếp theo vừa là số phần tử đã giữ.

### Deep answer (EN)

After processing any prefix of the input, the range before `write` contains exactly the values from that prefix that are not equal to `val`. This invariant makes `write` equal to the final answer after the scan finishes.

### Trả lời sâu (VI)

Sau khi xử lý bất kỳ prefix nào, đoạn trước `write` chứa chính xác các phần tử của prefix đó không bằng `val`. Invariant này khiến `write` chính là đáp án khi duyệt xong.

---

### Q3

**Q (EN):** Is overwriting `nums[write]` safe?

**Q (VI):** Ghi đè `nums[write]` có an toàn không?

### Short answer (EN)

Yes. `write` never moves ahead of the read position.

### Trả lời ngắn (VI)

Có. `write` không bao giờ vượt trước vị trí đang đọc.

### Standard answer (EN)

`write` only increments when a valid value has already been read. Therefore it is always less than or equal to the number of processed positions, so writing there cannot destroy an unread element.

### Trả lời chuẩn (VI)

`write` chỉ tăng sau khi đã đọc một phần tử hợp lệ. Vì vậy nó luôn nhỏ hơn hoặc bằng số vị trí đã xử lý, nên ghi tại đó không thể phá một phần tử chưa đọc.

---

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

I scan the input once and use only the write index, so the running time is linear and the additional memory is constant.

### Trả lời chuẩn (VI)

Em quét mảng một lần và chỉ dùng biến `write`, nên thời gian tuyến tính và bộ nhớ phụ hằng số.

---

### Q5

**Q (EN):** Does your solution preserve order even though the problem says order may change?

**Q (VI):** Lời giải có giữ thứ tự dù đề nói thứ tự có thể thay đổi không?

### Short answer (EN)

Yes. Stable compaction is allowed; the problem does not require order to change.

### Trả lời ngắn (VI)

Có. Giữ thứ tự vẫn hợp lệ; đề chỉ nói thứ tự *có thể* thay đổi chứ không bắt buộc phải đổi.

---

## 3. Likely follow-up / Câu hỏi mở rộng hợp lý

**Q (EN):** Can you reduce writes if `val` appears only a few times?

**Q (VI):** Có thể giảm số lần ghi nếu `val` xuất hiện rất ít không?

**EN:** Yes. Because order does not matter, I can replace a matched value with an element from the end of the active range and shrink that range. This can avoid copying every kept element, although the worst-case time remains `O(n)`.

**VI:** Có. Vì thứ tự không quan trọng, em có thể thay một giá trị cần xóa bằng phần tử ở cuối vùng đang xét rồi thu nhỏ vùng đó. Cách này có thể giảm số phép ghi, dù worst-case vẫn là `O(n)`.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích implementation không?

**EN:** I initialize `write` to zero. For every value in `nums`, if it is different from `val`, I assign it to `nums[write]` and increment `write`. Values equal to `val` are skipped. I return `write` after the loop.

**VI:** Em khởi tạo `write = 0`. Với mỗi giá trị trong `nums`, nếu nó khác `val`, em ghi vào `nums[write]` và tăng `write`. Giá trị bằng `val` bị bỏ qua. Cuối vòng lặp em trả `write`.

---

## 5. Common reasoning checks / Bẫy tư duy

- `k` là **logical length**, không phải độ dài vật lý mới của mảng.
- Dữ liệu sau `k` có thể vẫn chứa `val` hoặc giá trị cũ; điều đó không sai.
- `O(1)` space nghĩa là không tạo mảng/list phụ tỷ lệ theo `n`.
- Đừng giả định output mẫu là thứ tự duy nhất hợp lệ.
- Nếu chọn phương pháp swap-from-end, phải cẩn thận không tăng read index trước khi kiểm tra giá trị vừa swap vào.

---

## 6. Useful phrases / Cụm từ hữu ích

| English phrase | Ý nghĩa |
|---|---|
| compact the array in place | nén mảng tại chỗ |
| valid prefix | prefix hợp lệ |
| logical length | độ dài logic |
| skip the removed value | bỏ qua giá trị cần xóa |
| preserve relative order | giữ thứ tự tương đối |
| the rest of the array is irrelevant | phần còn lại của mảng không quan trọng |
