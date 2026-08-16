# 70. Climbing Stairs — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use a Fibonacci-style DP. Any way to reach step `i` must come either from step `i-1` with a one-step move or from step `i-2` with a two-step move. Therefore `ways[i]=ways[i-1]+ways[i-2]`. I keep only the previous two values, so the solution is O(n) time and O(1) extra space.

**VI:** Tôi phân loại theo last move và nén Fibonacci DP còn hai state.

## 2. Core approach questions

**Q (EN):** Why is the recurrence a sum?

**Q (VI):** Vì sao recurrence dùng phép cộng?

### Short answer (EN)
The last move is either one step or two steps, and those two sets of paths are disjoint.

### Trả lời ngắn (VI)
Last move là `1` hoặc `2` và hai tập cách không trùng nhau.

### Standard answer (EN)
Every path to `i-1` becomes a unique path to `i` by adding one step, and every path to `i-2` becomes a unique path by adding two steps. No path belongs to both groups because their last moves differ.

### Trả lời chuẩn (VI)
Mỗi path tới `i-1`/`i-2` nối thêm bước tương ứng tạo path duy nhất tới `i`; last move khác nhau nên không trùng.

## 3. Why / correctness questions

**Q (EN):** Why do two previous states contain all needed information?

**Q (VI):** Vì sao chỉ cần hai state trước?

### Short answer (EN)
The allowed jump lengths are only one and two.

### Trả lời ngắn (VI)
Vì chỉ có jump length `1` và `2`.

### Standard answer (EN)
The recurrence never references any older state directly. Once `ways[i]` is computed, states before `i-1` will no longer be needed for future updates.

### Trả lời chuẩn (VI)
Recurrence không đọc state cũ hơn; sau khi tính state mới có thể bỏ lịch sử xa hơn hai vị trí.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(n) time and O(1) extra space.

### Trả lời ngắn (VI)
O(n) time và O(1) space.

### Standard answer (EN)
I compute each step once and store only a constant number of integer variables.

### Trả lời chuẩn (VI)
Mỗi bậc được tính một lần và chỉ dùng số biến hằng số.

## 5. Edge-case questions

**Q (EN):** What are the base cases?

**Q (VI):** Base cases là gì?

### Short answer (EN)
One way for `n=1` and two ways for `n=2`.

### Trả lời ngắn (VI)
`n=1` có `1` cách, `n=2` có `2` cách.

### Standard answer (EN)
These directly enumerate the possible moves and anchor the recurrence without an index shift.

### Trả lời chuẩn (VI)
Hai case liệt kê trực tiếp số cách và neo recurrence không bị lệch index.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why not use plain recursion?

**Q (VI):** Vì sao không recursion thuần?

### Short answer (EN)
It recomputes the same stair counts exponentially many times.

### Trả lời ngắn (VI)
Nó tính lại cùng subproblem rất nhiều lần.

### Standard answer (EN)
Memoization fixes that, but iterative DP is simpler here and also removes recursion-stack overhead.

### Trả lời chuẩn (VI)
Memoization sửa được nhưng iterative DP đơn giản và không cần recursion stack.

## 7. Code walkthrough questions

**Q (EN):** What do the two rolling variables mean?

**Q (VI):** Hai rolling variable biểu diễn gì?

### Short answer (EN)
The number of ways to reach the previous step and the step before that.

### Trả lời ngắn (VI)
Số cách tới bậc trước và bậc cách hai vị trí.

### Standard answer (EN)
Before computing step `i`, they hold `ways[i-2]` and `ways[i-1]`; after the sum, I shift them to prepare for `i+1`.

### Trả lời chuẩn (VI)
Trước iteration chúng là `ways[i-2]` và `ways[i-1]`; sau đó dịch lên cho state kế tiếp.

## 8. Follow-up variations

**Q (EN):** What if you could climb 1, 2, or 3 steps?

**Q (VI):** Nếu được đi `1,2,3` bậc thì sao?

### Short answer (EN)
Use `ways[i]=ways[i-1]+ways[i-2]+ways[i-3]` with three rolling states.

### Trả lời ngắn (VI)
Cộng ba state trước và giữ ba rolling value.

### Standard answer (EN)
The same last-move partition applies; each allowed jump length contributes the number of ways to the corresponding predecessor step.

### Trả lời chuẩn (VI)
Vẫn partition theo last move; mỗi jump length đóng góp count của predecessor tương ứng.

## 9. Common interviewer traps

- Off-by-one Fibonacci indexing.
- Exponential recursion without memoization.
- Forgetting that order of 1-step and 2-step moves creates distinct ways.
- Using an unnecessary O(n) DP array.

## 10. Useful phrases and vocabulary

```text
partition by the last move
Fibonacci-style recurrence
two disjoint sets of paths
rolling two-state DP
constant extra space
```
