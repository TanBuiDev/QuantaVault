# 205. Isomorphic Strings — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** Isomorphism requires a one-to-one mapping in both directions. I encode that by tracking the most recent position of each ASCII character in both strings. At every index, the two current characters must have the same last-seen position; otherwise their repetition patterns differ and a bijection is impossible. Then I update both positions to `i+1`. This runs in `O(n)` time with constant extra space.

**VI:** Isomorphism cần mapping one-to-one hai chiều. Em track last-seen position của từng ASCII character ở cả hai chuỗi; tại mỗi index, hai character phải có cùng last-seen signature. Khác nhau nghĩa là repetition pattern không khớp. Sau đó update cả hai bằng `i+1`, đạt `O(n)` và `O(1)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is checking only `s -> t` not enough?

**Q (VI):** Vì sao chỉ kiểm tra `s -> t` là chưa đủ?

### Short answer (EN)

Two different characters in `s` could otherwise map to the same character in `t`.

### Trả lời ngắn (VI)

Nếu chỉ một chiều, hai character khác nhau trong `s` có thể cùng map vào một character trong `t`.

### Standard answer (EN)

Isomorphism requires a bijection, not merely a function. A forward map guarantees one source has one target, but it does not guarantee target uniqueness. A reverse map or the last-seen-signature technique enforces both constraints.

### Trả lời chuẩn (VI)

Isomorphism cần bijection chứ không chỉ function. Forward map chỉ đảm bảo mỗi source có một target, chưa đảm bảo target không được dùng bởi source khác. Reverse map hoặc last-seen signature giải quyết cả hai chiều.

### Q2

**Q (EN):** Why does the last-seen technique work?

**Q (VI):** Vì sao kỹ thuật last-seen hoạt động?

### Short answer (EN)

Corresponding characters in isomorphic strings must repeat at exactly the same relative positions.

### Trả lời ngắn (VI)

Các character tương ứng trong hai chuỗi isomorphic phải lặp lại ở cùng pattern vị trí.

### Standard answer (EN)

At each index I compare the encoded previous occurrence of the current source and target characters. Equality means they have identical occurrence history so far; inequality exposes either an inconsistent forward mapping or a collision in the reverse mapping.

### Trả lời chuẩn (VI)

Mỗi index em so previous occurrence encoded của source/target hiện tại. Bằng nhau nghĩa là history khớp; khác nhau cho thấy forward mapping không nhất quán hoặc reverse mapping bị collision.

### Q3

**Q (EN):** Why store `i+1` instead of `i`?

**Q (VI):** Vì sao lưu `i+1` thay vì `i`?

### Short answer (EN)

Zero can then unambiguously mean “never seen”.

### Trả lời ngắn (VI)

Nhờ vậy `0` biểu diễn rõ ràng trạng thái “chưa từng xuất hiện”.

### Standard answer (EN)

Java integer arrays start filled with zero. If I stored raw index zero, the first occurrence at index zero would be indistinguishable from an unseen character. Encoding positions as `i+1` avoids extra initialization.

### Trả lời chuẩn (VI)

Java int array mặc định bằng `0`. Nếu lưu raw index `0`, occurrence đầu tiên sẽ không phân biệt được với unseen. Dùng `i+1` tránh cần sentinel riêng.

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Complexity là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space under the ASCII constraint.

### Trả lời ngắn (VI)

`O(n)` time và `O(1)` extra space theo ASCII constraint.

### Standard answer (EN)

I process each aligned character pair once and use two fixed arrays of 256 integers.

### Trả lời chuẩn (VI)

Em xử lý mỗi cặp character đúng một lần và dùng hai array cố định 256 phần tử.

---

## 3. Common interviewer traps / Bẫy thường gặp

- Enforce only one mapping direction.
- Confuse bijection with simple replacement.
- Use zero as both unseen and index zero.
- Claim constant space without tying it to ASCII.
