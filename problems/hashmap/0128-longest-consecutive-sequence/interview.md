# 128. Longest Consecutive Sequence — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I put every value into a hash set. Then I start counting only from values that have no predecessor, meaning `x-1` is absent. Such a value is the unique start of a maximal consecutive sequence. From each start I advance while `x+1` exists and update the maximum length. Although there is a nested while loop, each distinct value is traversed in exactly one sequence expansion, so the expected total time is `O(n)`.

**VI:** Em đưa values vào HashSet, rồi chỉ bắt đầu tại `x` khi `x-1` absent. Đó là unique start của một maximal sequence. Từ mỗi start em expand `x+1` cho tới khi đứt. Dù có nested while, mỗi distinct value chỉ thuộc một expansion nên expected total time `O(n)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why do you only start when `x-1` is absent?

**Q (VI):** Vì sao chỉ bắt đầu khi `x-1` không tồn tại?

### Short answer (EN)

That condition identifies the unique beginning of a consecutive sequence.

### Trả lời ngắn (VI)

Điều kiện đó nhận diện unique beginning của một consecutive sequence.

### Standard answer (EN)

If `x-1` exists, then `x` belongs to a sequence whose start is earlier, so expanding from `x` would repeat work. If `x-1` is absent, no smaller consecutive predecessor exists and `x` is the maximal sequence's start.

### Trả lời chuẩn (VI)

Nếu `x-1` tồn tại thì `x` nằm giữa sequence và expand từ đây sẽ lặp work. Nếu `x-1` absent thì `x` chính là start của maximal sequence.

### Q2

**Q (EN):** Why isn't the nested while loop `O(n^2)`?

**Q (VI):** Vì sao nested while không phải `O(n^2)`?

### Short answer (EN)

Only sequence starts enter the expansion, so each distinct value is advanced through once overall.

### Trả lời ngắn (VI)

Chỉ sequence start mới expand, nên mỗi distinct value được đi qua một lần trên toàn thuật toán.

### Standard answer (EN)

The inner loops are disjoint across maximal sequences. Their total number of successful `contains(current+1)` steps is bounded by the number of distinct values, so amortized work is linear.

### Trả lời chuẩn (VI)

Các inner loops thuộc các maximal sequence rời nhau; tổng successful steps bị chặn bởi số distinct values, nên amortized work linear.

### Q3

**Q (EN):** Why use a set rather than sorting?

**Q (VI):** Vì sao dùng set thay vì sort?

### Short answer (EN)

Sorting costs `O(n log n)`, while the problem explicitly requires `O(n)` time.

### Trả lời ngắn (VI)

Sort tốn `O(n log n)`, còn đề yêu cầu `O(n)`.

### Standard answer (EN)

A hash set gives average constant-time predecessor/successor membership tests without ordering the input, which is exactly what the linear-time solution needs.

### Trả lời chuẩn (VI)

HashSet cho average `O(1)` membership của predecessor/successor mà không cần sort, phù hợp linear-time requirement.

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n)` expected time and `O(n)` extra space.

### Trả lời ngắn (VI)

Expected `O(n)` time và `O(n)` extra space.

### Standard answer (EN)

Building and probing the hash set is average constant time per operation, and the start-only expansion ensures total traversal stays linear. The set stores all distinct values.

### Trả lời chuẩn (VI)

Hash operations average constant; start-only expansion giữ total traversal linear. Set lưu toàn bộ distinct values.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Sort despite the explicit linear-time requirement.
- Expand from every value.
- Misclassify nested loops as automatically quadratic.
- Forget duplicate values should not extend a sequence twice.
