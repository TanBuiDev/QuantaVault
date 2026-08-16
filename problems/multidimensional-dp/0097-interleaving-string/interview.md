# 97. Interleaving String — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use prefix DP where state `(i,j)` means the first `i+j` characters of `s3` can be formed from the first `i` characters of `s1` and first `j` characters of `s2`. Each state comes from either `s1` or `s2` if the corresponding previous state is true and the next character matches. I compress the table to one row, so the solution is O(mn) time and O(n) space.

**VI:** Tôi dùng prefix DP hai chiều và nén còn một hàng boolean.

## 2. Core approach questions

**Q (EN):** What does state `(i,j)` represent?

**Q (VI):** State `(i,j)` biểu diễn gì?

### Short answer (EN)

It says whether prefixes of lengths `i` and `j` can form the first `i+j` characters of `s3`.

### Trả lời ngắn (VI)

Nó cho biết hai prefix dài `i` và `j` có tạo được prefix dài `i+j` của `s3` không.

### Standard answer (EN)

The state records exactly how many characters have been consumed from each source. Because interleaving preserves internal order, that pair of counts is enough to identify the next candidate character from both strings.

### Trả lời chuẩn (VI)

State lưu số ký tự đã dùng từ mỗi source; vì thứ tự nội bộ được giữ nguyên, hai count này đủ để xác định ký tự kế tiếp.

## 3. Why / correctness questions

**Q (EN):** Why are there only two transitions?

**Q (VI):** Vì sao chỉ có hai transition?

### Short answer (EN)

The next character must come from either `s1` or `s2`.

### Trả lời ngắn (VI)

Ký tự tiếp theo chỉ có thể lấy từ `s1` hoặc `s2`.

### Standard answer (EN)

An interleaving never changes or invents characters. So after a valid smaller prefix, the only legal extension is the next unused character of `s1` or the next unused character of `s2`, provided it matches `s3`.

### Trả lời chuẩn (VI)

Interleaving không đổi hay tạo ký tự mới; extension hợp lệ chỉ là ký tự chưa dùng kế tiếp của một trong hai source nếu khớp target.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(mn) time and O(n) extra space.

### Trả lời ngắn (VI)

O(mn) time và O(n) space.

### Standard answer (EN)

There are `(m+1)(n+1)` prefix states and constant work per state. Only one row of `n+1` booleans is stored.

### Trả lời chuẩn (VI)

Có khoảng `m*n` state và chỉ lưu một hàng `n+1` boolean.

## 5. Edge-case questions

**Q (EN):** Why check the total length first?

**Q (VI):** Vì sao kiểm tra tổng độ dài trước?

### Short answer (EN)

An interleaving must use every character from both source strings exactly once.

### Trả lời ngắn (VI)

Interleaving phải dùng mọi ký tự của cả hai source đúng một lần.

### Standard answer (EN)

If `m+n` differs from `s3.length()`, no ordering choice can fix the number of characters, so the answer is immediately false.

### Trả lời chuẩn (VI)

Nếu tổng độ dài khác target thì không cách sắp xen kẽ nào có thể sửa số lượng ký tự.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why can greedy fail?

**Q (VI):** Vì sao greedy có thể sai?

### Short answer (EN)

When both source characters match the target, choosing one locally may block the only valid future path.

### Trả lời ngắn (VI)

Khi cả hai source đều khớp target, chọn một phía cục bộ có thể chặn đường hợp lệ duy nhất về sau.

### Standard answer (EN)

Repeated characters create ambiguous branches. DP keeps reachability for both possibilities instead of committing to one without future information.

### Trả lời chuẩn (VI)

Ký tự lặp tạo nhánh mơ hồ; DP giữ reachability của cả hai thay vì commit sớm.

## 7. Code walkthrough questions

**Q (EN):** In the one-row DP, what does `dp[j]` mean before and after update?

**Q (VI):** Trong 1D DP, `dp[j]` có nghĩa gì trước và sau update?

### Short answer (EN)

Before update it is the top state; after update it becomes the current-row state.

### Trả lời ngắn (VI)

Trước update là top state, sau update là current-row state.

### Standard answer (EN)

This is why left-to-right iteration works: `dp[j]` still represents `(i-1,j)` while `dp[j-1]` already represents `(i,j-1)`.

### Trả lời chuẩn (VI)

Vì scan trái sang phải, `dp[j]` còn là `(i-1,j)` còn `dp[j-1]` đã là `(i,j-1)`.

## 8. Follow-up variations

**Q (EN):** Can you use O(min(m,n)) space?

**Q (VI):** Có thể dùng O(min(m,n)) space không?

### Short answer (EN)

Yes, choose the shorter source string as the DP-array dimension.

### Trả lời ngắn (VI)

Có, chọn source string ngắn hơn làm chiều của DP array.

### Standard answer (EN)

The recurrence is symmetric between the two source strings, so swapping them does not change correctness and lets the rolling array use the smaller dimension.

### Trả lời chuẩn (VI)

Recurrence đối xứng giữa hai source nên có thể swap để mảng DP theo chiều nhỏ hơn.

## 9. Common interviewer traps

- Forgetting the length check.
- Using greedy on ambiguous equal characters.
- Off-by-one at `i+j-1`.
- Updating the rolling row in the wrong direction.

## 10. Useful phrases and vocabulary

```text
consume characters from both sources
preserve relative order
prefix reachability
come from the top or left state
rolling boolean DP
ambiguous branch
```
