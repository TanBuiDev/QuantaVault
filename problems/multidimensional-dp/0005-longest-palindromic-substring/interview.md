# 5. Longest Palindromic Substring — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I expand around every possible palindrome center. For each index I check both an odd center at the character and an even center between two characters. I expand while the characters match and keep the longest range found. This checks all possible palindromes in O(n^2) time and uses O(1) extra space.

**VI:** Tôi xét mọi tâm palindrome, gồm odd và even center, expand ra ngoài và giữ đoạn dài nhất.

## 2. Core approach questions

**Q (EN):** Why do you need two center types?

**Q (VI):** Vì sao cần hai loại center?

### Short answer (EN)

Odd palindromes center on a character; even palindromes center between two characters.

### Trả lời ngắn (VI)

Palindrome lẻ có tâm là ký tự, palindrome chẵn có tâm ở giữa hai ký tự.

### Standard answer (EN)

If I only expand from `(i,i)`, I can find strings like `aba` but miss `bb`. Checking `(i,i+1)` covers every even-length palindrome as well.

### Trả lời chuẩn (VI)

Chỉ dùng `(i,i)` sẽ tìm được `aba` nhưng bỏ lỡ `bb`; `(i,i+1)` bao phủ palindrome chẵn.

## 3. Why / correctness questions

**Q (EN):** Why does checking every center find the global longest palindrome?

**Q (VI):** Vì sao xét mọi center tìm được đáp án toàn cục?

### Short answer (EN)

Every palindrome has exactly one odd or even center.

### Trả lời ngắn (VI)

Mọi palindrome đều có một odd hoặc even center tương ứng.

### Standard answer (EN)

For the center of the optimal palindrome, the expansion continues through every matching symmetric pair until that palindrome is fully covered. Since all centers are visited, the optimal one cannot be missed.

### Trả lời chuẩn (VI)

Tại tâm của palindrome tối ưu, expansion sẽ đi qua toàn bộ các cặp đối xứng; vì mọi tâm đều được xét nên không thể bỏ lỡ đáp án.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(n^2) time and O(1) extra space.

### Trả lời ngắn (VI)

O(n^2) time và O(1) space.

### Standard answer (EN)

There are O(n) centers and a center can expand O(n) characters in the worst case. Only indices and lengths are stored.

### Trả lời chuẩn (VI)

Có O(n) center, mỗi center có thể expand O(n); chỉ lưu vài biến index.

## 5. Edge-case questions

**Q (EN):** What if several longest palindromes have the same length?

**Q (VI):** Nếu có nhiều palindrome dài nhất cùng độ dài thì sao?

### Short answer (EN)

The problem allows any valid longest palindrome.

### Trả lời ngắn (VI)

Bài cho phép trả về bất kỳ đáp án dài nhất hợp lệ.

### Standard answer (EN)

I update only when I find a strictly longer range, so my implementation deterministically keeps the first maximum it encounters.

### Trả lời chuẩn (VI)

Implementation chỉ update khi dài hơn, nên giữ maximum đầu tiên tìm được.

## 6. Alternative-approach and trade-off questions

**Q (EN):** How does this compare with 2D DP?

**Q (VI):** So với DP 2D thì thế nào?

### Short answer (EN)

Both can take O(n^2) time, but center expansion uses O(1) extra space.

### Trả lời ngắn (VI)

Cả hai O(n^2) time nhưng center expansion dùng O(1) space.

### Standard answer (EN)

DP explicitly stores whether every substring is a palindrome, which is useful for some follow-ups but costs O(n^2) memory. Center expansion only keeps the best range.

### Trả lời chuẩn (VI)

DP lưu trạng thái cho mọi substring nên tốn O(n^2) memory; center expansion chỉ giữ best range.

## 7. Code walkthrough questions

**Q (EN):** Why does `right - left - 1` give the palindrome length after expansion stops?

**Q (VI):** Vì sao sau loop độ dài là `right - left - 1`?

### Short answer (EN)

Both pointers have already moved one step beyond the last valid palindrome.

### Trả lời ngắn (VI)

Hai pointer đã đi vượt một bước khỏi palindrome hợp lệ cuối cùng.

### Standard answer (EN)

The valid range is from `left + 1` through `right - 1`, whose inclusive length is `(right - 1) - (left + 1) + 1 = right - left - 1`.

### Trả lời chuẩn (VI)

Range hợp lệ là `left+1..right-1`, nên độ dài chính xác là `right-left-1`.

## 8. Follow-up variations

**Q (EN):** Is there a linear-time solution?

**Q (VI):** Có lời giải linear time không?

### Short answer (EN)

Yes, Manacher's algorithm runs in O(n) time.

### Trả lời ngắn (VI)

Có, Manacher chạy O(n).

### Standard answer (EN)

Manacher reuses information about previously expanded palindromes to avoid repeated work. It is faster asymptotically but much more complex, so center expansion is often preferable unless linear time is required.

### Trả lời chuẩn (VI)

Manacher tái sử dụng thông tin đối xứng để tránh expand lặp, nhưng phức tạp hơn đáng kể.

## 9. Common interviewer traps

- Missing even-length palindromes.
- Confusing substring with subsequence.
- Incorrect boundary math after expansion.
- Claiming O(n) because there is only one outer loop.

## 10. Useful phrases and vocabulary

```text
expand around the center
odd-length palindrome
even-length palindrome
symmetric characters
longest range found
constant extra space
```
