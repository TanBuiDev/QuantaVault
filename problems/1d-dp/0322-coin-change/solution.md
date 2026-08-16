# 322. Coin Change — Solution

## 1. Core idea / Intuition

Ta dùng bottom-up DP:

```text
dp[x] = số coin ít nhất để tạo tổng x
```

Base case:

```text
dp[0] = 0
```

Với mỗi `x` từ `1..amount`, thử mọi coin không lớn hơn `x`:

```text
dp[x] = min(dp[x], dp[x - coin] + 1)
```

Nếu cuối cùng `dp[amount]` vẫn là sentinel, không có tổ hợp hợp lệ.

## 2. Requirement recap / Tóm tắt yêu cầu

Mỗi mệnh giá được dùng vô hạn lần. Cần đúng tổng `amount` và tối thiểu hóa số coin, không phải số loại coin hay tổng giá trị.

## 3. Key observations / Nhận xét quan trọng

- Bài có optimal substructure: bỏ coin cuối khỏi lời giải tối ưu cho `x` để về một lời giải tối ưu cho `x-coin`.
- `amount=0` cần `0` coin.
- Coin lớn hơn current amount không thể dùng ở state đó.
- Sentinel `amount+1` an toàn vì coin dương nguyên và một lời giải nếu tồn tại cần tối đa `amount` coin mệnh giá `1`.

## 4. Alternative approaches / Các hướng khác

Brute-force DFS phân nhánh mạnh và lặp subproblem. BFS trên amount cũng có thể tìm số coin tối thiểu theo level, nhưng bottom-up DP đơn giản và deterministic. Memoization đạt cùng bậc time nhưng cần recursion/cache.

## 5. Optimal approach / Hướng tối ưu

Khởi tạo toàn bộ `dp` bằng `amount+1`, rồi `dp[0]=0`. Duyệt current amount tăng dần để mọi predecessor nhỏ hơn đã được tối ưu hóa.

## 6. Java solution overview

```java
import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int current = 1; current <= amount; current++) {
            for (int coin : coins) {
                if (coin <= current) {
                    dp[current] = Math.min(dp[current], dp[current - coin] + 1);
                }
            }
        }

        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```

## 7. Code explanation / Giải thích code

Duyệt amount ngoài, coin trong làm mỗi state tính từ mọi predecessor hợp lệ. Vì predecessor `current-coin < current`, giá trị đó đã finalized theo bottom-up order.

## 8. Dry run / Chạy thử

Với `coins=[1,2,5]`, `amount=11`, DP dần tìm được `dp[5]=1`, `dp[10]=2`, và `dp[11]=3` từ `10 + coin 1` hoặc `6 + coin 5`.

## 9. Time and space complexity

```text
Time:  O(amount * coins.length)
Space: O(amount)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mọi cách tạo `x>0` có một coin cuối `c`, và phần trước phải tạo đúng `x-c`. Nếu ta biết minimum coin count cho mọi predecessor, lời giải tốt nhất kết thúc bằng `c` có cost `dp[x-c]+1`. Lấy minimum trên mọi coin hợp lệ xét toàn bộ khả năng. Base `dp[0]=0`; theo quy nạp tăng dần trên `x`, mọi state tối ưu.

## 11. Edge cases

- `amount=0`.
- Không thể tạo amount.
- Một coin đúng bằng amount.
- Coin lớn hơn amount.
- Nhiều coin có thể tạo cùng minimum.

## 12. Common mistakes

- Dùng greedy chọn coin lớn nhất; greedy không đúng với mệnh giá tùy ý.
- Quên `dp[0]=0`.
- Không phân biệt unreachable sentinel với answer thật.
- Overflow khi dùng `Integer.MAX_VALUE + 1`; sentinel nhỏ tránh lỗi này.

## 13. Pattern recognition / Khi nào tái sử dụng

Đây là unbounded knapsack / minimum-cost composition: mỗi item có thể dùng lặp và state là best cost để tạo target tổng.

## 14. Vocabulary

- **denomination**: mệnh giá
- **unbounded knapsack**: knapsack không giới hạn số lần dùng item
- **minimum number of coins**: số coin ít nhất
- **unreachable state**: trạng thái không thể đạt
- **sentinel**: giá trị đánh dấu
