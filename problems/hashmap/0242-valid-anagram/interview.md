# 242. Valid Anagram — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I first reject different lengths. Because the strings contain only lowercase English letters, I use 26 counters. For each aligned index I increment the counter for `s` and decrement the counter for `t`. At the end, every counter must be zero, which means both strings contain exactly the same character multiset. This is `O(n)` time and `O(1)` extra space.

**VI:** Em loại ngay length khác nhau, rồi dùng 26 counters. Mỗi index cộng character từ `s` và trừ character từ `t`; cuối cùng mọi counter phải về `0`, nghĩa là hai chuỗi có cùng multiset. Complexity `O(n)` và `O(1)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is matching character presence not enough?

**Q (VI):** Vì sao chỉ kiểm tra character presence là chưa đủ?

### Short answer (EN)

Anagrams require equal multiplicities, not just the same distinct characters.

### Trả lời ngắn (VI)

Anagram yêu cầu số lần xuất hiện bằng nhau, không chỉ cùng tập distinct characters.

### Standard answer (EN)

For example, `"aab"` and `"abb"` contain the same distinct letters but different counts. Frequency balance captures the full multiset requirement.

### Trả lời chuẩn (VI)

Ví dụ `"aab"` và `"abb"` có cùng distinct letters nhưng count khác nhau. Frequency balance kiểm tra đúng multiset.

### Q2

**Q (EN):** Why is the extra space constant?

**Q (VI):** Vì sao extra space là constant?

### Short answer (EN)

The array always has 26 counters because the alphabet is fixed.

### Trả lời ngắn (VI)

Array luôn chỉ có 26 counter do alphabet cố định.

### Standard answer (EN)

Input size can grow, but the number of possible lowercase English letters does not, so the auxiliary storage is independent of `n`.

### Trả lời chuẩn (VI)

Input có thể dài hơn nhưng số ký tự khả dĩ vẫn là 26, nên auxiliary storage không phụ thuộc `n`.

### Q3

**Q (EN):** How would you handle Unicode?

**Q (VI):** Nếu input là Unicode thì sao?

### Short answer (EN)

Use a hash map keyed by Unicode code point instead of a fixed 26-element array.

### Trả lời ngắn (VI)

Dùng hash map keyed by Unicode code point thay cho array 26 phần tử.

### Standard answer (EN)

I would iterate code points and balance counts in a hash map. That preserves linear expected time, while space grows with the number of distinct code points.

### Trả lời chuẩn (VI)

Em duyệt code points và balance count bằng hash map. Time trung bình vẫn linear, space theo số distinct code points.

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space for lowercase English input.

### Trả lời ngắn (VI)

`O(n)` time và `O(1)` extra space với input chữ thường tiếng Anh.

### Standard answer (EN)

I scan the strings once and then scan a constant 26-entry array.

### Trả lời chuẩn (VI)

Em scan hai chuỗi một lần rồi scan array cố định 26 phần tử.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Ignore duplicate counts.
- Forget the length check.
- Use sorting without discussing its higher time complexity.
- Treat Java `char` as a complete Unicode code point in the follow-up.
