# 72. Edit Distance — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use prefix DP. `dp[i][j]` is the minimum edits to convert the first `i` characters of `word1` into the first `j` characters of `word2`. Equal last characters reuse the diagonal state; otherwise I take one plus the minimum of insert, delete, and replace predecessors. I compress the table to one row, giving O(mn) time and O(n) extra space.

**VI:** Tôi dùng prefix DP, xét match hoặc ba thao tác insert/delete/replace và nén bảng còn một hàng.

## 2. Core approach questions

**Q (EN):** What does your DP state mean?

**Q (VI):** State DP có ý nghĩa gì?

### Short answer (EN)

It is the minimum edits between two prefixes.

### Trả lời ngắn (VI)

Đó là số chỉnh sửa ít nhất giữa hai prefix.

### Standard answer (EN)

`dp[i][j]` is the minimum number of allowed operations needed to transform `word1[0..i)` into `word2[0..j)`. This prefix definition makes every possible final operation map to a smaller subproblem.

### Trả lời chuẩn (VI)

`dp[i][j]` là số thao tác ít nhất để biến prefix dài `i` của `word1` thành prefix dài `j` của `word2`.

## 3. Why / correctness questions

**Q (EN):** Why are there exactly three predecessor states when the characters differ?

**Q (VI):** Vì sao khi ký tự khác nhau có đúng ba predecessor state?

### Short answer (EN)

Because the last operation must be insert, delete, or replace.

### Trả lời ngắn (VI)

Vì thao tác cuối phải là insert, delete hoặc replace.

### Standard answer (EN)

Those are the only operations allowed by the problem. Removing the final operation from an optimal sequence leaves exactly one of `dp[i][j-1]`, `dp[i-1][j]`, or `dp[i-1][j-1]`.

### Trả lời chuẩn (VI)

Ba thao tác là toàn bộ lựa chọn được phép; bỏ thao tác cuối khỏi optimal sequence sẽ dẫn về đúng một trong ba subproblem tương ứng.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(mn) time and O(n) extra space.

### Trả lời ngắn (VI)

O(mn) time và O(n) space.

### Standard answer (EN)

There are `m * n` prefix pairs and constant work per pair. The rolling array stores only one row of `n + 1` states.

### Trả lời chuẩn (VI)

Có `m*n` cặp prefix, mỗi state làm O(1), và rolling array chỉ giữ `n+1` giá trị.

## 5. Edge-case questions

**Q (EN):** What is the distance from an empty string to a string of length j?

**Q (VI):** Từ chuỗi rỗng sang chuỗi dài `j` cần bao nhiêu thao tác?

### Short answer (EN)

Exactly `j` insertions.

### Trả lời ngắn (VI)

Đúng `j` lần insert.

### Standard answer (EN)

There are no existing characters to reuse, so every target character must be inserted. This is why the base row is initialized with `dp[j] = j`.

### Trả lời chuẩn (VI)

Không có ký tự nguồn để tái sử dụng nên phải insert mọi ký tự đích; đó là base row `dp[j]=j`.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why prefer bottom-up DP over plain recursion?

**Q (VI):** Vì sao chọn bottom-up DP thay vì recursion thuần?

### Short answer (EN)

Plain recursion repeats the same prefix pairs exponentially many times.

### Trả lời ngắn (VI)

Recursion thuần lặp lại cùng cặp prefix rất nhiều lần.

### Standard answer (EN)

Memoization fixes the repeated work, but bottom-up DP has predictable iteration order and makes row compression straightforward.

### Trả lời chuẩn (VI)

Memoization giải quyết lặp, nhưng bottom-up có thứ tự rõ ràng và dễ nén theo hàng.

## 7. Code walkthrough questions

**Q (EN):** What does `diagonal` store in the one-row implementation?

**Q (VI):** `diagonal` lưu gì?

### Short answer (EN)

The previous row's previous column value.

### Trả lời ngắn (VI)

Giá trị cột trước của previous row.

### Standard answer (EN)

It is the old `dp[j-1]`, which represents `dp[i-1][j-1]`. We need it for a match or replace transition after `dp[j-1]` has already been overwritten with the current row.

### Trả lời chuẩn (VI)

Nó là `dp[i-1][j-1]` cũ, cần cho match/replace sau khi `dp[j-1]` đã bị overwrite.

## 8. Follow-up variations

**Q (EN):** How would weighted edit costs change the solution?

**Q (VI):** Nếu mỗi thao tác có cost khác nhau thì sao?

### Short answer (EN)

Use the same DP but add the corresponding operation cost to each predecessor.

### Trả lời ngắn (VI)

Giữ cùng DP nhưng cộng cost riêng cho từng predecessor.

### Standard answer (EN)

The state definition stays the same. Only the transition changes from adding one uniformly to adding insertCost, deleteCost, or replaceCost before taking the minimum.

### Trả lời chuẩn (VI)

Định nghĩa state không đổi; chỉ transition dùng cost riêng của insert/delete/replace.

## 9. Common interviewer traps

- Missing empty-prefix base cases.
- Mixing up insertion and deletion directions.
- Losing the diagonal value in rolling DP.
- Saying O(n) time because only one DP row is stored.

## 10. Useful phrases and vocabulary

```text
minimum edits between prefixes
last operation
insert / delete / replace predecessor
reuse the diagonal state
rolling DP row
O(mn) time
O(n) extra space
```
