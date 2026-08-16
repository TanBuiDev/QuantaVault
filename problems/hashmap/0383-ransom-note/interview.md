# 383. Ransom Note — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I treat the magazine letters as a consumable inventory. Because the input contains only lowercase English letters, I count the magazine with a fixed array of 26 integers. Then I scan the ransom note and decrement the corresponding count for every required character. If a count becomes negative, demand has exceeded supply and I return false. The algorithm is `O(m+n)` time and `O(1)` extra space.

**VI:** Em xem các chữ trong magazine như inventory có giới hạn. Vì chỉ có `a..z`, em dùng array 26 phần tử để đếm supply, sau đó scan ransom note và decrement mỗi character cần dùng. Counter âm nghĩa là demand vượt supply nên trả `false`. Complexity là `O(m+n)` và `O(1)` extra space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is a frequency count necessary?

**Q (VI):** Vì sao cần frequency count?

### Short answer (EN)

Each magazine letter can be used only once, so I need to track how many copies of every character are available.

### Trả lời ngắn (VI)

Mỗi magazine letter chỉ dùng một lần, nên phải track số bản sao còn có của từng character.

### Standard answer (EN)

Membership alone is not enough. For example, both strings may contain `a`, but constructing `"aa"` requires two separate copies. Frequency counts represent that multiplicity exactly.

### Trả lời chuẩn (VI)

Chỉ biết character có tồn tại là chưa đủ. `"aa"` cần hai bản sao `a` riêng biệt, nên frequency mới biểu diễn đúng multiplicity.

### Q2

**Q (EN):** Why use an array instead of a hash map?

**Q (VI):** Vì sao dùng array thay vì hash map?

### Short answer (EN)

The alphabet is fixed to 26 lowercase English letters, so a fixed array is simpler and constant-sized.

### Trả lời ngắn (VI)

Alphabet cố định chỉ có 26 chữ thường nên fixed array đơn giản và có kích thước hằng số.

### Standard answer (EN)

Both approaches can be linear, but a hash map adds hashing and object overhead. Since `c-'a'` gives a direct index from zero to twenty-five, the array provides direct constant-time access with constant storage.

### Trả lời chuẩn (VI)

Cả hai có thể linear, nhưng hash map có hashing/object overhead. `c-'a'` cho direct index `0..25`, nên array truy cập trực tiếp và constant storage.

### Q3

**Q (EN):** Why can you return immediately when a count becomes negative?

**Q (VI):** Vì sao có thể return ngay khi counter âm?

### Short answer (EN)

It proves that the ransom note needs more copies of that character than the entire magazine provides.

### Trả lời ngắn (VI)

Điều đó chứng minh ransom note cần nhiều bản sao character đó hơn toàn bộ magazine cung cấp.

### Standard answer (EN)

The counters start with the complete magazine supply. Every decrement corresponds to one required use. Once a counter is negative, even all remaining input cannot increase that supply, so the construction is impossible.

### Trả lời chuẩn (VI)

Counters bắt đầu từ toàn bộ supply của magazine; mỗi decrement là một lần dùng. Khi counter âm, supply toàn cục đã thiếu và phần input còn lại không thể bổ sung magazine, nên impossible.

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(m+n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(m+n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

I scan each string once. The counting structure always has 26 entries, independent of input size.

### Trả lời chuẩn (VI)

Em scan mỗi chuỗi đúng một lần. Cấu trúc đếm luôn có 26 phần tử, không tăng theo input.

---

## 3. Likely follow-up / Câu hỏi mở rộng

**Q (EN):** What if the input can contain arbitrary Unicode characters?

**Q (VI):** Nếu input là Unicode tùy ý thì sao?

**EN:** I would replace the fixed array with a hash map keyed by Unicode code point. The time remains linear on average, while space becomes proportional to the number of distinct characters.

**VI:** Em thay fixed array bằng hash map theo Unicode code point. Time trung bình vẫn linear, space theo số distinct characters.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Track only presence instead of multiplicity.
- Claim `O(1)` space without explaining the fixed alphabet.
- Sort unnecessarily.
- Forget early termination when supply is exceeded.
