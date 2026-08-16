# 322. Coin Change — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use bottom-up DP where `dp[x]` is the minimum number of coins needed to form amount `x`. I initialize `dp[0]=0` and all other states to an unreachable sentinel. For every amount, I try every coin and transition from `dp[x-coin]+1`. If the target remains unreachable, I return -1. The complexity is O(amount * numberOfCoins) time and O(amount) space.

**VI:** Tôi dùng bottom-up DP theo amount và thử mọi coin cho mỗi state.

## 2. Core approach questions

**Q (EN):** What does `dp[x]` represent?

**Q (VI):** `dp[x]` biểu diễn gì?

### Short answer (EN)

The fewest coins needed to make exactly amount `x`.

### Trả lời ngắn (VI)

Số coin ít nhất để tạo đúng tổng `x`.

### Standard answer (EN)

It summarizes every combination that forms `x` by keeping only the minimum coin count. This is enough because future states only care about the best count for the predecessor amount.

### Trả lời chuẩn (VI)

State gộp mọi combination tạo `x` và chỉ giữ minimum count, đủ cho các transition tương lai.

## 3. Why / correctness questions

**Q (EN):** Why does the recurrence consider every optimal solution?

**Q (VI):** Vì sao recurrence bao phủ mọi lời giải tối ưu?

### Short answer (EN)

Every non-empty solution has a last coin.

### Trả lời ngắn (VI)

Mọi lời giải không rỗng đều có một coin cuối.

### Standard answer (EN)

If the last coin is `c`, removing it leaves a valid solution for `x-c`. Therefore taking the minimum of `dp[x-c]+1` over all possible last coins covers every candidate optimal solution.

### Trả lời chuẩn (VI)

Bỏ coin cuối `c` sẽ còn lời giải cho `x-c`; minimum trên mọi coin cuối bao phủ mọi candidate.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

O(amount * coins.length) time and O(amount) space.

### Trả lời ngắn (VI)

O(amount * số coin) time và O(amount) space.

### Standard answer (EN)

There are `amount` non-zero DP states and each tries every coin once.

### Trả lời chuẩn (VI)

Có `amount` state cần tính và mỗi state thử mọi coin.

## 5. Edge-case questions

**Q (EN):** Why is the answer zero when amount is zero?

**Q (VI):** Vì sao `amount=0` trả `0`?

### Short answer (EN)

The empty set of coins already forms total zero.

### Trả lời ngắn (VI)

Không dùng coin nào đã tạo đúng tổng `0`.

### Standard answer (EN)

This is also the essential DP base case that allows states equal to a coin value to transition from `dp[0]`.

### Trả lời chuẩn (VI)

Đây còn là base case để state bằng đúng một mệnh giá chuyển từ `dp[0]`.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why is a greedy largest-coin strategy not always correct?

**Q (VI):** Vì sao greedy lấy coin lớn nhất có thể sai?

### Short answer (EN)

Arbitrary denominations do not have the structure that makes greedy choices globally optimal.

### Trả lời ngắn (VI)

Mệnh giá tùy ý không đảm bảo lựa chọn greedy cục bộ là tối ưu toàn cục.

### Standard answer (EN)

For example, with coins `[1,3,4]` and amount `6`, greedy chooses `4+1+1` using three coins, but `3+3` uses only two.

### Trả lời chuẩn (VI)

Ví dụ `[1,3,4]`, amount `6`: greedy cho `4+1+1` ba coin, còn `3+3` chỉ hai coin.

## 7. Code walkthrough questions

**Q (EN):** Why use `amount + 1` as the sentinel?

**Q (VI):** Vì sao dùng `amount+1` làm sentinel?

### Short answer (EN)

It is larger than any possible valid minimum coin count and safe to add one to.

### Trả lời ngắn (VI)

Nó lớn hơn mọi count hợp lệ và cộng `1` an toàn.

### Standard answer (EN)

Since every coin is a positive integer, no valid solution needs more than `amount` coins. Unlike `Integer.MAX_VALUE`, this sentinel cannot overflow when I add one.

### Trả lời chuẩn (VI)

Coin dương nên lời giải hợp lệ không cần quá `amount` coin; sentinel này cũng tránh overflow.

## 8. Follow-up variations

**Q (EN):** How would you count combinations instead of minimizing coins?

**Q (VI):** Nếu cần đếm số combination thay vì minimum coin thì sao?

### Short answer (EN)

Change the DP meaning and use addition instead of minimum; iteration order then matters for counting combinations versus permutations.

### Trả lời ngắn (VI)

Đổi nghĩa state sang số cách và dùng phép cộng; thứ tự loop quyết định combination hay permutation.

### Standard answer (EN)

For unordered combinations, I would iterate coins on the outside and amounts upward on the inside, accumulating `ways[x] += ways[x-coin]`.

### Trả lời chuẩn (VI)

Đếm combination không thứ tự thường loop coin ngoài, amount tăng dần bên trong.

## 9. Common interviewer traps

- Assuming greedy works for arbitrary denominations.
- Using an overflow-prone infinite sentinel.
- Forgetting unreachable target handling.
- Confusing minimum coin count with number of combinations.

## 10. Useful phrases and vocabulary

```text
minimum number of coins
unreachable sentinel
try every possible last coin
unbounded choice
bottom-up amount DP
```
