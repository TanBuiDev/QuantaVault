# 274. H-Index — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** The h-index cannot exceed the number of papers `n`, so I build `n + 1` frequency buckets and clamp every citation count above `n` into bucket `n`. Then I scan `h` from `n` down to zero while accumulating how many papers have at least `h` citations. The first `h` where the cumulative count is at least `h` is the maximum valid h-index. This runs in `O(n)` time with `O(n)` extra space.

**VI:** H-index không thể lớn hơn số paper `n`, nên em tạo `n+1` bucket và gom mọi citation lớn hơn `n` vào bucket `n`. Sau đó em duyệt `h` từ `n` xuống `0`, cộng dồn số paper có ít nhất `h` citations. `h` đầu tiên mà cumulative count >= `h` chính là maximum h-index. Độ phức tạp `O(n)` time và `O(n)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why can citations greater than `n` all go into the same bucket?

**Q (VI):** Vì sao mọi citation lớn hơn `n` có thể gom chung?

### Short answer (EN)

Because h-index can never exceed the number of papers.

### Trả lời ngắn (VI)

Vì h-index không bao giờ lớn hơn số bài báo.

### Standard answer (EN)

Every candidate threshold satisfies `h <= n`. For any such threshold, a paper with 6 citations and a paper with a million citations are both simply “at least h” once their count exceeds `n`. Their exact excess values cannot change the answer.

### Trả lời chuẩn (VI)

Mọi candidate `h` đều `<= n`. Với mọi threshold đó, paper có citation `6` hay một triệu đều chỉ mang ý nghĩa “>= h” khi đã vượt `n`. Phần vượt quá không thể thay đổi đáp án.

### Deep answer (EN)

Clamping is an information-preserving transformation with respect to the predicate used by the problem. For all possible candidate `h` in `[0,n]`, `citation >= h` has the same truth value after replacing any citation above `n` with `n`.

### Trả lời sâu (VI)

Clamping là phép biến đổi bảo toàn thông tin đối với predicate của bài. Với mọi candidate `h` trong `[0,n]`, mệnh đề `citation >= h` giữ nguyên giá trị đúng/sai nếu thay mọi citation trên `n` bằng `n`.

---

### Q2

**Q (EN):** Why scan from `n` downwards?

**Q (VI):** Vì sao duyệt từ `n` giảm dần?

### Short answer (EN)

We need the maximum valid `h`, so the first valid threshold found in descending order is the answer.

### Trả lời ngắn (VI)

Ta cần maximum `h`, nên threshold hợp lệ đầu tiên khi duyệt giảm dần chính là đáp án.

### Standard answer (EN)

The descending scan also makes the cumulative count natural: after adding bucket `h`, the accumulator equals the number of papers with citation count at least `h`. I can test the definition directly at each threshold.

### Trả lời chuẩn (VI)

Duyệt giảm còn giúp cumulative count tự nhiên: sau khi cộng bucket `h`, accumulator chính là số paper có citation ít nhất `h`, nên kiểm tra trực tiếp định nghĩa.

---

### Q3

**Q (EN):** What does `papersAtLeastH` represent?

**Q (VI):** `papersAtLeastH` đại diện cho gì?

### Short answer (EN)

At threshold `h`, it is exactly the number of papers with at least `h` citations.

### Trả lời ngắn (VI)

Tại threshold `h`, đó chính là số paper có ít nhất `h` citations.

---

### Q4

**Q (EN):** Could sorting solve the problem?

**Q (VI):** Có thể dùng sorting không?

### Short answer (EN)

Yes. Sorting gives a simpler `O(n log n)` solution; counting uses the `h <= n` bound to reach `O(n)`.

### Trả lời ngắn (VI)

Có. Sorting cho solution `O(n log n)` đơn giản; counting tận dụng `h <= n` để đạt `O(n)`.

### Standard answer (EN)

After sorting descending, I can find the largest position where the citation count is at least the number of papers seen. But since h-index is bounded by `n`, a bucket approach avoids comparison sorting and is linear.

### Trả lời chuẩn (VI)

Sau khi sort giảm dần, có thể tìm vị trí lớn nhất mà citation >= số paper đã xét. Nhưng vì h-index bị chặn bởi `n`, bucket tránh comparison sorting và đạt tuyến tính.

---

### Q5

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(n)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(n)` bộ nhớ phụ.

### Standard answer (EN)

I process each citation once, scan `n+1` buckets once, and allocate a frequency array of size `n+1`.

### Trả lời chuẩn (VI)

Em xử lý mỗi citation một lần, duyệt `n+1` bucket một lần và tạo frequency array kích thước `n+1`.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** Can you solve it with `O(1)` extra space?

**Q (VI):** Có thể giải với `O(1)` extra space không?

**EN:** If modifying the input is allowed, sorting in place can reduce auxiliary memory depending on the sorting implementation, but it changes the time bound to `O(n log n)`. Achieving both linear time and truly constant extra space is not what this bucket method provides.

**VI:** Nếu được sửa input, sort in-place có thể giảm auxiliary memory tùy implementation nhưng time thành `O(n log n)`. Bucket method hiện tại ưu tiên linear time và dùng `O(n)` space.

### Follow-up 2

**Q (EN):** What if citations arrive as a stream?

**Q (VI):** Nếu citation đến dạng stream thì sao?

**EN:** If the final number of papers is not known in advance, the fixed `0..n` bucket bound changes as the stream grows. I would maintain an ordered frequency structure or periodically resize/rebucket depending on update/query requirements.

**VI:** Nếu chưa biết trước tổng số paper, bound bucket `0..n` thay đổi khi stream lớn dần. Em sẽ dùng cấu trúc tần suất có thứ tự hoặc resize/rebucket tùy yêu cầu update/query.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I allocate `n+1` buckets. For every citation count I increment bucket `min(citation,n)`. Then I scan `h` downward, adding `count[h]` to a cumulative number of papers. The moment that cumulative number is at least `h`, I return `h` because every larger threshold has already failed.

**VI:** Em tạo `n+1` bucket. Với mỗi citation em tăng bucket `min(citation,n)`. Sau đó duyệt `h` giảm dần, cộng `count[h]` vào số paper cumulative. Ngay khi cumulative >= `h`, em trả `h` vì mọi threshold lớn hơn đã fail.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Nhầm “at least h papers” thành “exactly h papers”.
- Quên rằng h-index tối đa là `n`.
- Không giải thích được vì sao clamp citation lớn là an toàn.
- Trả threshold đầu tiên khi duyệt tăng dần thay vì maximum.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- citation count — số lượt trích dẫn
- threshold — ngưỡng
- frequency bucket — bucket tần suất
- cumulative count — số đếm cộng dồn
- clamp / saturate — chặn/gom tại một ngưỡng
- at least — ít nhất
- maximum valid value — giá trị hợp lệ lớn nhất
