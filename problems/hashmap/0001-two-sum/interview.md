# 1. Two Sum — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I scan the array once and store previously seen values with their indices in a hash map. For each current value, I compute `target - value` and check whether that complement already exists. I perform the lookup before inserting the current element, so the two indices are always distinct. The expected time is `O(n)` with `O(n)` extra space.

**VI:** Em scan array một lần, lưu `value -> index` của các phần tử trước trong hash map. Với current value, em tính complement `target-value` và lookup trước khi insert current element, nên hai index luôn khác nhau. Expected time `O(n)`, space `O(n)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why does a hash map improve over brute force?

**Q (VI):** Vì sao hash map tốt hơn brute force?

### Short answer (EN)

It replaces a linear search for the complement with an average `O(1)` lookup.

### Trả lời ngắn (VI)

Nó thay việc scan tìm complement bằng average `O(1)` lookup.

### Standard answer (EN)

Brute force checks every pair. With a map, when I reach index `i`, all earlier candidate partners are summarized by direct value lookup, so each index is processed once instead of pairing it with every other index.

### Trả lời chuẩn (VI)

Brute force thử mọi pair. Hash map tóm tắt toàn bộ earlier partners bằng direct lookup, nên mỗi index chỉ xử lý một lần.

### Q2

**Q (EN):** Why do you check the complement before inserting the current value?

**Q (VI):** Vì sao lookup complement trước khi insert current value?

### Short answer (EN)

It prevents the current element from matching itself.

### Trả lời ngắn (VI)

Nó ngăn current element ghép với chính nó.

### Standard answer (EN)

Before insertion, the map contains only indices smaller than `i`. Therefore any complement found is guaranteed to be a different element. Duplicates are still handled because an earlier equal value remains available.

### Trả lời chuẩn (VI)

Trước insert, map chỉ có index nhỏ hơn `i`, nên complement tìm được chắc chắn là phần tử khác. Duplicate vẫn đúng vì equal value trước đó đã nằm trong map.

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n)` expected time and `O(n)` extra space.

### Trả lời ngắn (VI)

Expected `O(n)` time và `O(n)` extra space.

### Standard answer (EN)

There is one pass and average constant-time hash operations. In the worst case, the map may store almost every input value before the solution is found.

### Trả lời chuẩn (VI)

Có một pass với hash operations trung bình constant time. Worst case map có thể chứa gần toàn bộ input trước khi tìm thấy answer.

### Q4

**Q (EN):** Would sorting and two pointers work?

**Q (VI):** Sort + two pointers có dùng được không?

### Short answer (EN)

Yes, but preserving original indices requires extra bookkeeping and sorting costs `O(n log n)`.

### Trả lời ngắn (VI)

Có, nhưng cần giữ original indices và sort tốn `O(n log n)`.

### Standard answer (EN)

I could sort value-index pairs and then use two pointers, but the hash-map solution is simpler and asymptotically faster on average for this problem.

### Trả lời chuẩn (VI)

Có thể sort các cặp value-index rồi two pointers, nhưng hash map đơn giản hơn và average asymptotic tốt hơn.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Return values instead of indices.
- Use the same index twice.
- Forget duplicate values can form the answer.
- Claim deterministic worst-case `O(n)` for a hash map without qualification.
