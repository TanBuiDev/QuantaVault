# 64. Minimum Path Sum — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use grid DP. The minimum cost to reach a cell is its value plus the minimum of the cost from above and from the left. I store only one row: before updating `dp[j]` it is the top value, and `dp[j-1]` is already the left value for the current row. This gives O(mn) time and O(n) extra space.

**VI:** Tôi dùng grid DP nén một hàng, mỗi ô cộng minimum của top và left.

## 2. Core approach questions

**Q (EN):** What does your DP state represent?

**Q (VI):** DP state biểu diễn gì?

### Short answer (EN)

The minimum path sum needed to reach the current cell.

### Trả lời ngắn (VI)

Tổng nhỏ nhất để đi tới ô hiện tại.

### Standard answer (EN)

For each column, the rolling state stores the best cost for the processed row. The transition compares the only two legal predecessors, above and left.

### Trả lời chuẩn (VI)

State rolling lưu best cost tới ô đang xét và transition so hai predecessor hợp lệ duy nhất.

## 3. Why / correctness questions

**Q (EN):** Why is taking the minimum of top and left sufficient?

**Q (VI):** Vì sao chỉ cần minimum của top và left?

### Short answer (EN)

Those are the only cells that can move into the current cell.

### Trả lời ngắn (VI)

Đó là hai ô duy nhất có thể đi vào ô hiện tại.

### Standard answer (EN)

Every valid path to `(i,j)` must end with a move from `(i-1,j)` or `(i,j-1)`. Choosing the cheaper optimal prefix among those two and adding the current value therefore gives the optimal path to `(i,j)`.

### Trả lời chuẩn (VI)

Mọi đường tới `(i,j)` phải kết thúc từ top hoặc left; chọn prefix tối ưu rẻ hơn rồi cộng current value cho optimal cost.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(mn) time and O(n) extra space.

### Trả lời ngắn (VI)

O(mn) time và O(n) space.

### Standard answer (EN)

Every grid cell is processed once, and I store one integer per column.

### Trả lời chuẩn (VI)

Mỗi ô xử lý một lần và chỉ lưu một số nguyên cho mỗi cột.

## 5. Edge-case questions

**Q (EN):** How do you handle the first row and first column?

**Q (VI):** Xử lý hàng và cột đầu thế nào?

### Short answer (EN)

They each have only one possible predecessor direction.

### Trả lời ngắn (VI)

Mỗi ô biên chỉ có một hướng predecessor.

### Standard answer (EN)

I initialize the first row with cumulative sums. For later rows, `dp[0]` is also cumulative because the first column can only be reached from above.

### Trả lời chuẩn (VI)

Tôi prefix-sum hàng đầu; ở các hàng sau `dp[0]` tiếp tục cộng dồn từ trên.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not use Dijkstra's algorithm?

**Q (VI):** Vì sao không dùng Dijkstra?

### Short answer (EN)

The allowed moves form a DAG with a natural topological order, so DP is simpler.

### Trả lời ngắn (VI)

Các bước đi tạo DAG có thứ tự tự nhiên nên DP đơn giản hơn.

### Standard answer (EN)

Dijkstra solves a more general shortest-path problem. Here every edge moves forward in row/column order, so each state can be finalized directly from already processed predecessors.

### Trả lời chuẩn (VI)

Dijkstra giải bài tổng quát hơn; ở đây mọi edge đi theo thứ tự forward nên DP finalize state trực tiếp.

## 7. Code walkthrough questions

**Q (EN):** What does `dp[j]` mean before it is overwritten?

**Q (VI):** `dp[j]` trước overwrite là gì?

### Short answer (EN)

It is the minimum cost to the cell directly above.

### Trả lời ngắn (VI)

Là minimum cost của ô ngay phía trên.

### Standard answer (EN)

Because we scan left to right, `dp[j]` still belongs to the previous row while `dp[j-1]` has already been updated for the current row.

### Trả lời chuẩn (VI)

Scan trái sang phải làm `dp[j]` còn thuộc previous row còn `dp[j-1]` đã thuộc current row.

## 8. Follow-up variations

**Q (EN):** Could you reconstruct the actual minimum path?

**Q (VI):** Có thể reconstruct đường tối ưu không?

### Short answer (EN)

Yes, but I would need additional predecessor information or recompute choices.

### Trả lời ngắn (VI)

Có, nhưng cần lưu predecessor hoặc recompute.

### Standard answer (EN)

The one-row optimization keeps only costs, not parent choices. To reconstruct efficiently, I would usually keep a parent table or a full DP table.

### Trả lời chuẩn (VI)

1D DP chỉ giữ cost, không giữ parent; reconstruct hiệu quả thường cần parent/full table.

## 9. Common interviewer traps

- Forgetting the starting cell's value.
- Mishandling first row/column.
- Confusing path count with path cost.
- Claiming O(1) extra space while using a row array.

## 10. Useful phrases and vocabulary

```text
minimum cost to reach a cell
only two legal predecessors
rolling row optimization
cumulative first row
natural DAG order
```
