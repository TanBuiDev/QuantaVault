# 49. Group Anagrams — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I group strings by a canonical signature. Because inputs contain only lowercase English letters, I count the 26 letters in each string and serialize those counts with separators into a hash key. All anagrams have the same frequency vector, and only anagrams share that vector. I append each string to the bucket for its key, giving linear work in the total number of characters up to the constant 26-key construction per word.

**VI:** Em group theo canonical signature. Với mỗi string em đếm 26 letters rồi serialize counts có delimiter thành hash key. Anagram có cùng frequency vector và chỉ anagram mới có cùng vector, nên append mỗi word vào bucket tương ứng.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is a frequency vector a valid key?

**Q (VI):** Vì sao frequency vector là key hợp lệ?

### Short answer (EN)

Two strings are anagrams exactly when every character appears the same number of times.

### Trả lời ngắn (VI)

Hai strings là anagram chính xác khi mọi character xuất hiện cùng số lần.

### Standard answer (EN)

For a fixed alphabet, the 26 counts completely describe the string's multiset. Reordering characters cannot change the vector, and equal vectors imply equal multisets, so the signature is both necessary and sufficient.

### Trả lời chuẩn (VI)

Với alphabet cố định, 26 counts mô tả đầy đủ multiset. Reorder không đổi vector, và vector bằng nhau kéo theo multiset bằng nhau, nên signature là điều kiện cần và đủ.

### Q2

**Q (EN):** Why not sort every string?

**Q (VI):** Vì sao không sort từng string?

### Short answer (EN)

Sorting works, but counting is linear because the alphabet is fixed.

### Trả lời ngắn (VI)

Sort đúng nhưng counting tuyến tính nhờ alphabet cố định.

### Standard answer (EN)

A sorted-string key costs `O(L log L)` per word. A 26-counter key costs `O(L+26)`, so it is asymptotically better for long strings and still simple.

### Trả lời chuẩn (VI)

Sorted key tốn `O(L log L)` mỗi word; 26-counter key chỉ `O(L+26)`.

### Q3

**Q (EN):** Why do you include separators in the key?

**Q (VI):** Vì sao key cần delimiter?

### Short answer (EN)

Separators keep multi-digit counts from being parsed ambiguously.

### Trả lời ngắn (VI)

Delimiter giữ ranh giới khi count có nhiều chữ số.

### Standard answer (EN)

Without separators, concatenating integer counts can make different count vectors look identical. Prefixing every count with `#` makes the serialization unambiguous.

### Trả lời chuẩn (VI)

Không delimiter, các integer count ghép lại có thể mơ hồ. Prefix mỗi count bằng `#` làm encoding rõ ràng.

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Complexity là gì?

### Short answer (EN)

Linear in the total number of input characters, with storage proportional to the grouped data and signatures.

### Trả lời ngắn (VI)

Linear theo tổng số input characters; storage theo dữ liệu group và signatures.

### Standard answer (EN)

Each character is counted once, and each word creates a constant-size 26-entry signature. Hash-map operations are average `O(1)`.

### Trả lời chuẩn (VI)

Mỗi character được count một lần và mỗi word tạo signature 26 entries cố định; hash-map operations trung bình `O(1)`.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Ignore multiplicity.
- Compare output ordering even though order is irrelevant.
- Use an ambiguous serialized key.
- State `O(n)` without defining whether `n` means strings or total characters.
