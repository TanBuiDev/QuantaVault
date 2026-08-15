# 198. House Robber — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use a take-or-skip DP. For each house, either I skip it and keep the best result through the previous house, or I rob it and add its money to the best result through two houses back. I only need those two previous values, so the solution is O(n) time and O(1) extra space.

**VI:** Tôi dùng take-or-skip DP và nén còn hai state trước.

## 2. Core approach questions

**Q (EN):** What is the recurrence?

**Q (VI):** Recurrence là gì?

### Short answer (EN)
`best[i] = max(best[i-1], best[i-2] + nums[i])`.

### Trả lời ngắn (VI)
Chọn max giữa skip current và rob current cộng best cách hai nhà.

### Standard answer (EN)
The first term skips the current house. The second robs it, so the previous house cannot be used and I combine with the optimal prefix ending two positions earlier.

### Trả lời chuẩn (VI)
Nhánh đầu bỏ current; nhánh hai lấy current và buộc quay về optimal prefix `i-2`.

## 3. Why / correctness questions

**Q (EN):** Why do these two cases cover every optimal solution?

**Q (VI):** Vì sao hai case này bao phủ mọi optimal solution?

### Short answer (EN)
Every solution either contains the current house or it does not.

### Trả lời ngắn (VI)
Mọi lời giải hoặc chứa current house hoặc không.

### Standard answer (EN)
If it contains the current house, adjacency excludes the previous house, leaving an optimal subproblem through `i-2`. Otherwise the solution is entirely inside the prefix through `i-1`.

### Trả lời chuẩn (VI)
Nếu chứa current thì previous bị loại và phần còn lại là subproblem `i-2`; nếu không thì toàn bộ nằm trong prefix `i-1`.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(n) time and O(1) extra space.

### Trả lời ngắn (VI)
O(n) time và O(1) space.

### Standard answer (EN)
I scan the array once and keep only two previous DP values plus the current value.

### Trả lời chuẩn (VI)
Duyệt một lần và chỉ giữ hai state trước.

## 5. Edge-case questions

**Q (EN):** What happens with a single house?

**Q (VI):** Nếu chỉ có một nhà thì sao?

### Short answer (EN)
The recurrence chooses that house, so the answer is its value.

### Trả lời ngắn (VI)
Recurrence chọn nhà đó và trả về đúng giá trị của nó.

### Standard answer (EN)
Starting from zero states, the first update becomes `max(0, 0 + nums[0])`, which is exactly the best valid result.

### Trả lời chuẩn (VI)
Từ base `0,0`, update đầu cho `max(0, nums[0])`, đúng với input một nhà.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not greedily choose the larger house in every adjacent pair?

**Q (VI):** Vì sao không greedy theo từng cặp nhà?

### Short answer (EN)
Local choices overlap across pairs and can block a better global combination.

### Trả lời ngắn (VI)
Lựa chọn cục bộ giữa các cặp chồng lấn và có thể chặn tổ hợp toàn cục tốt hơn.

### Standard answer (EN)
The value of taking one house affects which houses on both sides remain available, so the DP prefix state is needed to preserve global optimality.

### Trả lời chuẩn (VI)
Chọn một nhà ảnh hưởng khả năng chọn các nhà xung quanh nên cần DP prefix thay vì greedy cục bộ.

## 7. Code walkthrough questions

**Q (EN):** Why can you remove the DP array?

**Q (VI):** Vì sao bỏ được DP array?

### Short answer (EN)
Each state depends only on the previous two states.

### Trả lời ngắn (VI)
Mỗi state chỉ phụ thuộc hai state trước.

### Standard answer (EN)
Once I compute the next value, any state older than two positions will never be referenced again, so two rolling scalars are sufficient.

### Trả lời chuẩn (VI)
State cũ hơn hai vị trí sẽ không được dùng lại, nên hai scalar rolling là đủ.

## 8. Follow-up variations

**Q (EN):** How does the circular-house version change the problem?

**Q (VI):** Nếu các nhà nằm trên vòng tròn thì sao?

### Short answer (EN)
The first and last houses also conflict, so solve two linear ranges and take the maximum.

### Trả lời ngắn (VI)
Nhà đầu và cuối cũng conflict; giải hai đoạn tuyến tính rồi lấy max.

### Standard answer (EN)
Run the same linear DP once excluding the last house and once excluding the first. Every valid circular solution belongs to one of those cases.

### Trả lời chuẩn (VI)
Chạy linear DP trên `[0..n-2]` và `[1..n-1]`; mọi solution vòng tròn nằm trong một trong hai case.

## 9. Common interviewer traps

- Combining current money with the previous-state result.
- Explaining the algorithm as greedy rather than DP.
- Using an O(n) table without noticing constant-space compression.
- Mishandling the one-house base case with index-heavy code.

## 10. Useful phrases and vocabulary

```text
take-or-skip dynamic programming
non-adjacent houses
best result through the previous house
best result two houses back
rolling two-state optimization
```
