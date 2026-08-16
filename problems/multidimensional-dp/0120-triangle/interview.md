# 120. Triangle — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I solve it bottom-up. I initialize a one-dimensional DP array with the last row. For each cell moving upward, the minimum path from that cell is its value plus the minimum of the two adjacent states below. After processing the top row, `dp[0]` is the answer. This takes O(n^2) time and O(n) extra space.

**VI:** Tôi dùng bottom-up DP nén một hàng; mỗi ô cộng minimum của hai child bên dưới.

## 2. Core approach questions

**Q (EN):** What does `dp[j]` represent during the bottom-up process?

**Q (VI):** `dp[j]` biểu diễn gì?

### Short answer (EN)

The minimum path sum from the current level at index `j` to the bottom.

### Trả lời ngắn (VI)

Minimum sum từ vị trí `j` của level hiện tại xuống đáy.

### Standard answer (EN)

Before processing row `i`, the array stores optimal costs from row `i+1`. Updating `dp[j]` combines the current value with the cheaper of its two legal children.

### Trả lời chuẩn (VI)

Trước khi xử lý hàng `i`, array lưu optimal cost từ hàng dưới; update chọn child rẻ hơn rồi cộng current value.

## 3. Why / correctness questions

**Q (EN):** Why can you make a local minimum choice between the two children?

**Q (VI):** Vì sao có thể chọn minimum giữa hai child?

### Short answer (EN)

Every valid continuation must start with exactly one of those two children, and their DP values already include optimal suffixes.

### Trả lời ngắn (VI)

Mọi continuation phải đi qua một trong hai child và DP child đã là suffix tối ưu.

### Standard answer (EN)

This is not a greedy decision on raw values. It compares complete optimal costs from both child positions to the bottom, so choosing the smaller one is exactly the DP recurrence.

### Trả lời chuẩn (VI)

Đây không phải greedy trên raw value; ta so toàn bộ optimal suffix cost của hai child.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(n^2) time and O(n) extra space.

### Trả lời ngắn (VI)

O(n^2) time và O(n) space.

### Standard answer (EN)

A triangle with `n` rows has O(n^2) elements, and each is processed once. The DP array has length `n`.

### Trả lời chuẩn (VI)

Triangle `n` hàng có O(n^2) phần tử và DP array dài `n`.

## 5. Edge-case questions

**Q (EN):** Does the method work with negative values?

**Q (VI):** Cách này có đúng với số âm không?

### Short answer (EN)

Yes. The recurrence compares complete path sums and does not assume non-negative values.

### Trả lời ngắn (VI)

Có. Recurrence so path sum hoàn chỉnh, không giả định giá trị không âm.

### Standard answer (EN)

Every path has a fixed number of levels, and the DP simply minimizes the exact sum among legal continuations. Negative values therefore require no special handling.

### Trả lời chuẩn (VI)

Mọi path đi qua đúng mỗi level một lần; DP minimize exact sum nên số âm không cần xử lý đặc biệt.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why bottom-up instead of top-down?

**Q (VI):** Vì sao bottom-up thay vì top-down?

### Short answer (EN)

Bottom-up makes the two-child recurrence simple and allows O(n) space naturally.

### Trả lời ngắn (VI)

Bottom-up có recurrence hai child đơn giản và nén O(n) tự nhiên.

### Standard answer (EN)

Top-down also works but boundary handling differs for the left and right edges. Bottom-up starts from a complete base row where every state is immediately known.

### Trả lời chuẩn (VI)

Top-down cũng đúng nhưng biên phức tạp hơn; bottom-up bắt đầu từ base row đã biết toàn bộ state.

## 7. Code walkthrough questions

**Q (EN):** Why is left-to-right update safe here?

**Q (VI):** Vì sao update trái sang phải an toàn?

### Short answer (EN)

Each update reads `dp[j]` and `dp[j+1]`; the right neighbor has not been overwritten yet.

### Trả lời ngắn (VI)

Mỗi update đọc `dp[j]` và `dp[j+1]`; vị trí bên phải chưa bị overwrite.

### Standard answer (EN)

After writing `dp[j]`, no later state needs its old value. The next update uses old `dp[j+1]` and `dp[j+2]`, both still intact.

### Trả lời chuẩn (VI)

Sau khi overwrite `dp[j]`, không state sau nào cần giá trị cũ đó; hai child cần tiếp theo vẫn còn nguyên.

## 8. Follow-up variations

**Q (EN):** Could you modify the input triangle in place instead of using an extra array?

**Q (VI):** Có thể sửa triangle in-place không?

### Short answer (EN)

Yes, if input mutation is allowed, the same recurrence can be written into one of the rows.

### Trả lời ngắn (VI)

Có, nếu được phép mutate input có thể ghi recurrence trực tiếp vào triangle.

### Standard answer (EN)

That can reduce explicit extra storage, but mutating input changes the API behavior and is often less desirable in interview code unless allowed.

### Trả lời chuẩn (VI)

Cách đó giảm storage nhưng thay đổi input, nên chỉ dùng khi đề cho phép.

## 9. Common interviewer traps

- Calling the child comparison greedy without explaining DP suffix costs.
- Updating in an unsafe direction.
- Forgetting negative values are allowed.
- Claiming O(n) time because the DP array has length n.

## 10. Useful phrases and vocabulary

```text
bottom-up dynamic programming
two adjacent children
optimal suffix cost
initialize with the last row
O(n) extra space
```
