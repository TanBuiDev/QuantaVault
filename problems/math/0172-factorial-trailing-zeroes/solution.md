# Solution / Lời giải — 172. Factorial Trailing Zeroes

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Trailing zero của n! đến từ factor 10=2*5. Trong factorial luôn có nhiều factor2 hơn5, nên chỉ cần đếm tổng số factor5 xuất hiện trong 1..n.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Tính n! rồi đếm zeros impossible vì số khổng lồ. Đếm từng number divisible by5 vẫn O(n); observation multiples of25 đóng góp thêm một5, 125 thêm nữa, nên sum floor(n/5)+floor(n/25)+...

**State / invariant / data structure cần hiểu trước code.** Mỗi iteration n/=5 rồi cộng n vào count. Invariant sau k iterations, count đã cộng contributions của factor5 thứ1..k từ mọi multiples 5^j; loop dừng khi quotient0.

**Dry run mental theo implementation.** Dry run n=30: floor30/5=6 cho six first factors; floor30/25=1 cho extra factor của25; higher0, total7 trailing zeros.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ n/5 và bỏ extra powers hoặc tìm factors10 trực tiếp. Khi nào dùng: valuation của factorial theo prime p thường là tổng floor(n/p^k).
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

A trailing zero is a factor `10 = 2 * 5`. In `n!`, factors of 2 are abundant, so count factors of 5: `floor(n/5) + floor(n/25) + ...`.

## 2. Optimal Java solution

```java
class Solution {
    public int trailingZeroes(int n) {
        int count = 0;

        // Each trailing zero needs a factor 10 = 2*5. Factorials contain many more
        // factors of 2 than 5, so the number of zeroes is exactly the number of 5s.
        while (n > 0) {
            // floor(n/5) counts one 5 from every multiple of 5; repeating division
            // also counts extra 5s from multiples of 25, 125, ...
            n /= 5;
            count += n;
        }
        return count;
    }
}
```

## 3. Correctness

Every multiple of `5` contributes at least one factor 5, every multiple of `25` contributes one additional factor, and so on. The repeated divisions count each factor 5 exactly once, which equals the number of factor-10 pairs and trailing zeros.

## 4. Complexity

`O(log_5 n)` time, `O(1)` space.
