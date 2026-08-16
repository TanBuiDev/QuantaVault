# 189. Rotate Array — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I normalize `k` with `k %= n`, then use the three-reversal technique. I reverse the whole array, reverse the first `k` elements, and reverse the remaining elements. If the original array is `A B`, where `B` contains the last `k` elements, those three operations transform `A B` into `B A`, which is exactly a right rotation. The algorithm runs in `O(n)` time and uses `O(1)` extra space.

**VI:** Em chuẩn hóa `k` bằng `k %= n`, sau đó dùng kỹ thuật ba lần reverse. Em reverse toàn bộ mảng, reverse `k` phần tử đầu, rồi reverse phần còn lại. Nếu mảng ban đầu là `A B`, trong đó `B` là `k` phần tử cuối, ba thao tác biến `A B` thành `B A`, đúng bằng rotate sang phải. Thuật toán chạy `O(n)` time và `O(1)` extra space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why do you take `k % n`?

**Q (VI):** Vì sao cần lấy `k % n`?

### Short answer (EN)

Rotating by `n` positions returns the array to its original state, so only the remainder matters.

### Trả lời ngắn (VI)

Xoay đúng `n` vị trí đưa mảng về ban đầu, nên chỉ phần dư mới có ý nghĩa.

### Standard answer (EN)

Every complete block of `n` right rotations is a no-op. Replacing `k` with `k % n` keeps the result unchanged and guarantees `0 <= k < n`, which also makes the reversal boundaries easy to reason about.

### Trả lời chuẩn (VI)

Mỗi nhóm đủ `n` lần rotate không làm thay đổi kết quả. Thay `k` bằng `k % n` giữ nguyên đáp án và đảm bảo `0 <= k < n`, giúp các biên reverse rõ ràng hơn.

---

### Q2

**Q (EN):** Why do three reversals produce a rotation?

**Q (VI):** Vì sao ba lần reverse lại tạo ra phép rotate?

### Short answer (EN)

Treat the array as `A B`. The operations transform it into `B A` while restoring the internal order of both blocks.

### Trả lời ngắn (VI)

Xem mảng là `A B`. Ba thao tác biến nó thành `B A` đồng thời khôi phục thứ tự bên trong hai block.

### Standard answer (EN)

Reversing the whole array gives `reverse(B) reverse(A)`. Reversing the first `k` elements restores `B`, and reversing the remaining elements restores `A`. The final array is therefore `B A`, exactly the required right rotation.

### Trả lời chuẩn (VI)

Reverse toàn bộ cho `reverse(B) reverse(A)`. Reverse `k` phần tử đầu khôi phục `B`, rồi reverse phần còn lại khôi phục `A`. Kết quả cuối là `B A`, chính xác là rotate sang phải.

### Deep answer (EN)

The proof works at the block level, independent of the actual values. A right rotation by `k` is precisely a permutation that moves the suffix of length `k` before the prefix of length `n-k` without changing either block's internal order. The three reversals implement that block transposition in place.

### Trả lời sâu (VI)

Chứng minh hoạt động ở cấp block, không phụ thuộc giá trị cụ thể. Rotate phải `k` chính là đưa suffix dài `k` lên trước prefix dài `n-k` nhưng giữ nguyên thứ tự nội bộ của mỗi block. Ba lần reverse thực hiện phép hoán đổi hai block đó in-place.

---

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Each reversal is linear in the size of its segment, and the total work is proportional to `n`. The reverse helper swaps elements in place and uses only a few variables.

### Trả lời chuẩn (VI)

Mỗi lần reverse tuyến tính theo độ dài đoạn và tổng công việc tỷ lệ với `n`. Hàm reverse swap tại chỗ và chỉ dùng vài biến.

---

### Q4

**Q (EN):** What other solutions are possible?

**Q (VI):** Có những cách giải nào khác?

### Short answer (EN)

An auxiliary array gives `O(n)` time and `O(n)` space, and cyclic replacement gives `O(n)` time and `O(1)` space.

### Trả lời ngắn (VI)

Mảng phụ cho `O(n)` time, `O(n)` space; cyclic replacement cho `O(n)` time, `O(1)` space.

### Standard answer (EN)

I could place each element at `(i + k) % n` in an auxiliary array, which is simpler but costs linear memory. Cyclic replacement also meets `O(1)` space, but it requires careful cycle accounting when the permutation has multiple cycles. I prefer three reversals because the implementation and proof are both compact.

### Trả lời chuẩn (VI)

Có thể đặt mỗi phần tử vào `(i + k) % n` trong mảng phụ, dễ hơn nhưng tốn bộ nhớ tuyến tính. Cyclic replacement cũng đạt `O(1)` space nhưng phải quản lý nhiều cycle cẩn thận. Em chọn ba reverse vì code và chứng minh đều gọn.

---

### Q5

**Q (EN):** Why not shift the array one position `k` times?

**Q (VI):** Vì sao không dịch mảng một vị trí `k` lần?

### Short answer (EN)

That can take `O(nk)` time, which is too slow for large inputs.

### Trả lời ngắn (VI)

Cách đó có thể tốn `O(nk)` thời gian, quá chậm khi input lớn.

---

### Q6

**Q (EN):** What happens when `k` is zero after normalization?

**Q (VI):** Điều gì xảy ra nếu sau chuẩn hóa `k = 0`?

### Short answer (EN)

The array should remain unchanged; the current reverse calls are still safe.

### Trả lời ngắn (VI)

Mảng phải giữ nguyên; các lệnh reverse hiện tại vẫn an toàn.

### Standard answer (EN)

When `k = 0`, the first reversal reverses the full array, the second call is an empty range `0..-1`, and the third reverses the full array again. The two full reversals cancel each other. An early return is optional, not required for correctness.

### Trả lời chuẩn (VI)

Khi `k = 0`, reverse đầu đảo toàn bộ, reverse thứ hai là đoạn rỗng `0..-1`, reverse thứ ba đảo toàn bộ lần nữa. Hai lần đảo toàn bộ triệt tiêu nhau. Có thể early return để tối ưu nhỏ nhưng không bắt buộc để đúng.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** Can you implement cyclic replacement instead?

**Q (VI):** Bạn có thể implement cyclic replacement không?

**EN:** Yes. Start from an index, repeatedly move the saved value to `(current + k) % n`, and continue until the cycle closes. Count how many elements have been moved globally because the permutation may contain multiple cycles.

**VI:** Có. Bắt đầu từ một index, liên tục đưa giá trị đang giữ đến `(current + k) % n` cho tới khi cycle đóng. Phải đếm tổng số phần tử đã di chuyển vì permutation có thể có nhiều cycle.

### Follow-up 2

**Q (EN):** How would you rotate left by `k`?

**Q (VI):** Nếu rotate sang trái `k` thì sao?

**EN:** Normalize `k`, then either rotate right by `n-k`, or reverse the first `k`, reverse the remaining suffix, and finally reverse the entire array.

**VI:** Chuẩn hóa `k`, rồi có thể đổi thành rotate phải `n-k`; hoặc reverse `k` phần tử đầu, reverse suffix còn lại, cuối cùng reverse toàn bộ.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code từng phần không?

**EN:** I first compute `k %= n`. Then I reverse the whole array to bring the old suffix toward the front, reverse the first `k` positions to restore the suffix's order, and reverse positions `k` through `n-1` to restore the prefix's order. The helper uses two pointers and swaps while `left < right`.

**VI:** Đầu tiên em tính `k %= n`. Sau đó reverse toàn bộ để đưa suffix cũ về phía trước, reverse `k` vị trí đầu để khôi phục thứ tự suffix, rồi reverse từ `k` đến `n-1` để khôi phục prefix. Hàm helper dùng hai pointer và swap khi `left < right`.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Quên modulo khi `k > n`.
- Nhầm rotate phải với rotate trái.
- Dùng `reverse(0, k)` thay vì `reverse(0, k - 1)`.
- Nói `O(1)` space nhưng thực tế tạo auxiliary array.
- Chỉ đưa code mà không giải thích được mô hình `A B -> B A`.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- rotate to the right — xoay sang phải
- normalize `k` — chuẩn hóa `k`
- suffix / prefix — hậu tố / tiền tố
- reverse a segment — đảo ngược một đoạn
- in-place — tại chỗ
- cyclic replacement — thay thế theo chu kỳ
- restore the original order — khôi phục thứ tự ban đầu
