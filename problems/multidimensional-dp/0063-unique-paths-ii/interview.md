# 63. Unique Paths II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use grid DP with one row of memory. For an empty cell, the number of paths is the sum of paths from above and from the left. For an obstacle, I reset the state to zero. Scanning left to right lets `dp[j]` represent the top value and `dp[j-1]` the left value. The solution is O(mn) time and O(n) extra space.

**VI:** Tôi dùng grid DP nén một hàng; ô trống cộng top và left, obstacle reset về `0`.

## 2. Core approach questions

**Q (EN):** What does `dp[j]` represent?

**Q (VI):** `dp[j]` biểu diễn gì?

### Short answer (EN)

It is the number of valid paths to the current row at column `j`.

### Trả lời ngắn (VI)

Đó là số đường hợp lệ tới cột `j` của hàng hiện tại.

### Standard answer (EN)

Before I update column `j`, `dp[j]` is the number of paths from the previous row. After updating, it becomes the number of paths to the current cell.

### Trả lời chuẩn (VI)

Trước update là số đường từ hàng trên; sau update là số đường tới ô hiện tại.

## 3. Why / correctness questions

**Q (EN):** Why do you set the DP state to zero on an obstacle?

**Q (VI):** Vì sao obstacle làm state bằng `0`?

### Short answer (EN)

No valid path can enter an obstacle cell.

### Trả lời ngắn (VI)

Không đường hợp lệ nào được đi vào ô obstacle.

### Standard answer (EN)

Any path that reaches that coordinate would include the blocked cell and is invalid, so the number of valid paths ending there is exactly zero. Resetting also prevents those paths from contributing to later cells.

### Trả lời chuẩn (VI)

Mọi đường tới tọa độ đó đều đi qua ô bị chặn nên không hợp lệ; reset còn ngăn contribution lan sang các ô sau.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(mn) time and O(n) extra space.

### Trả lời ngắn (VI)

O(mn) time và O(n) space.

### Standard answer (EN)

Every cell is processed once with constant work, and the DP array stores one value per column.

### Trả lời chuẩn (VI)

Mỗi ô xử lý một lần và DP chỉ lưu một giá trị cho mỗi cột.

## 5. Edge-case questions

**Q (EN):** What if the starting cell is blocked?

**Q (VI):** Nếu ô bắt đầu bị chặn thì sao?

### Short answer (EN)

The first update resets `dp[0]` to zero and the final answer stays zero.

### Trả lời ngắn (VI)

Update đầu tiên reset `dp[0]` về `0`, nên không đường nào được tạo.

### Standard answer (EN)

I seed `dp[0]` with one, but the normal obstacle rule immediately clears it when the starting cell is blocked. No special branch is required.

### Trả lời chuẩn (VI)

Dù seed `dp[0]=1`, rule obstacle sẽ xóa nó ngay nếu start bị chặn, nên không cần branch đặc biệt.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not use DFS to enumerate paths?

**Q (VI):** Vì sao không DFS liệt kê mọi đường?

### Short answer (EN)

Many paths share the same suffix subproblems, so enumeration repeats work exponentially.

### Trả lời ngắn (VI)

Nhiều đường cùng đi qua các subproblem giống nhau nên DFS lặp rất nhiều công việc.

### Standard answer (EN)

DP aggregates all paths reaching a cell into one count. That avoids exploring every complete route separately and gives O(mn) time.

### Trả lời chuẩn (VI)

DP gộp mọi đường tới một ô thành một count, tránh enumerate từng route riêng.

## 7. Code walkthrough questions

**Q (EN):** Why does left-to-right update work with one array?

**Q (VI):** Vì sao scan trái sang phải dùng được một array?

### Short answer (EN)

`dp[j]` still holds top, while `dp[j-1]` already holds left.

### Trả lời ngắn (VI)

`dp[j]` còn là top còn `dp[j-1]` đã là left.

### Standard answer (EN)

The transition needs exactly those two states, so the overwrite order preserves both values at the moment they are needed.

### Trả lời chuẩn (VI)

Transition chỉ cần hai state đó nên thứ tự overwrite giữ đúng semantics cần thiết.

## 8. Follow-up variations

**Q (EN):** Can you reconstruct one valid path with this one-row DP?

**Q (VI):** Có thể reconstruct một đường bằng 1D DP này không?

### Short answer (EN)

Not directly; I would store parent choices or use additional information.

### Trả lời ngắn (VI)

Không trực tiếp; cần lưu parent choice hoặc thông tin bổ sung.

### Standard answer (EN)

The one-row DP intentionally discards history after counting. Reconstructing a path requires retaining enough predecessor information, typically increasing space usage.

### Trả lời chuẩn (VI)

1D DP bỏ lịch sử sau khi count; reconstruct cần giữ predecessor nên tốn thêm memory.

## 9. Common interviewer traps

- Not clearing obstacle states.
- Mishandling blocked start or destination.
- Treating every first-row cell as reachable.
- Claiming the rolling array changes the O(mn) time.

## 10. Useful phrases and vocabulary

```text
paths from above and from the left
reset the state on an obstacle
rolling row DP
blocked starting cell
aggregate path counts
```
