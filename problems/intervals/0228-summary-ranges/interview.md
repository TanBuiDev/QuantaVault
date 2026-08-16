# 228. Summary Ranges — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** Because the input is sorted and unique, I scan once and compress every maximal consecutive run. I keep the run's start and end; if the next value is exactly one greater than the end I extend the run, otherwise I emit the current range and start a new one. I compare using `long` to avoid overflow at `Integer.MAX_VALUE`. The scan is `O(n)` with constant auxiliary space excluding the output.

**VI:** Vì input sorted và unique, em scan một lần và nén từng maximal consecutive run. Next value bằng `end+1` thì extend; gặp gap thì emit range và start run mới. Em dùng `long` khi check adjacency để tránh overflow ở `Integer.MAX_VALUE`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why can you decide a range boundary using only the next value?

**Q (VI):** Vì sao chỉ cần nhìn next value để quyết định boundary?

### Short answer (EN)

The array is sorted and unique, so the current run continues exactly when the next value is `end + 1`.

### Trả lời ngắn (VI)

Array sorted và unique nên run chỉ tiếp tục khi next value đúng bằng `end+1`.

### Standard answer (EN)

If the next value is larger than `end+1`, at least one integer is missing. Merging across that gap would include a number not present in `nums`, which violates the exact-cover requirement.

### Trả lời chuẩn (VI)

Nếu next value lớn hơn `end+1`, tồn tại integer bị thiếu. Merge qua gap sẽ đưa số không có trong `nums` vào range, trái exact-cover requirement.

### Q2

**Q (EN):** Why use `long` in the adjacency comparison?

**Q (VI):** Vì sao dùng `long` khi so adjacency?

### Short answer (EN)

`Integer.MAX_VALUE + 1` overflows as an `int`.

### Trả lời ngắn (VI)

`Integer.MAX_VALUE + 1` sẽ overflow nếu tính bằng `int`.

### Standard answer (EN)

The input is allowed to contain the full 32-bit integer range. Promoting the arithmetic to `long` before adding one makes the adjacency test correct at both normal and boundary values.

### Trả lời chuẩn (VI)

Input dùng toàn miền 32-bit; promote sang `long` trước khi cộng giúp adjacency test đúng cả ở boundary.

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` auxiliary space excluding output.

### Trả lời ngắn (VI)

`O(n)` time và `O(1)` auxiliary space không tính output.

### Standard answer (EN)

Each array element is inspected once, and the algorithm stores only the current range boundaries besides the required result list.

### Trả lời chuẩn (VI)

Mỗi element được xét một lần, ngoài result chỉ giữ current start/end.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Forget the empty-array case.
- Forget to emit the last range.
- Overflow on `end + 1`.
- Merge across a gap and violate exact coverage.
