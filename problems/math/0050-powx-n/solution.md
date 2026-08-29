# Solution / Lời giải — 50. Pow(x, n)

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** x^n nếu nhân x n lần là O(n), nhưng exponent có thể chia đôi: x^10=(x^5)^2 và x^11=x*(x^5)^2. Binary representation của n cho biết chính xác những powers nào phải nhân vào answer.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Linear multiplication quá chậm cho exponent lớn. Exponentiation by squaring mỗi bước halve exponent; negative n đổi thành reciprocal và cần dùng long để xử lý -Integer.MIN_VALUE an toàn.

**State / invariant / data structure cần hiểu trước code.** base là x^(2^bit) hiện tại, exponent là phần bits chưa xử lý, result tích các powers ứng với bits 1 đã đi qua. Invariant original x^N = result * base^exponent theo transformed positive exponent.

**Dry run mental theo implementation.** Dry run 2^10, binary1010: bit0=0 square base4; bit1=1 result4 square16; bit2=0 square256; bit3=1 result1024, exponent về0.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là negate int MIN_VALUE bị overflow hoặc quên reciprocal cho n âm. Khi nào dùng: repeated multiplication với exponent/count lớn thường giảm logarithmic bằng doubling/squaring theo bits.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Use exponentiation by squaring. Read the exponent in binary: each set bit selects the current squared base into the answer.

## 2. Optimal Java solution

```java
class Solution {
    public double myPow(double x, int n) {
        // Convert before negation because -Integer.MIN_VALUE overflows an int.
        long power = n;
        if (power < 0) {
            // x^(-p) = (1/x)^p lets the main loop handle only nonnegative exponents.
            x = 1.0 / x;
            power = -power;
        }

        double answer = 1.0;
        while (power > 0) {
            // Binary exponentiation: when the current exponent bit is 1, the
            // corresponding power-of-two contribution belongs in the result.
            if ((power & 1L) == 1L) {
                answer *= x;
            }

            // Moving to the next exponent bit doubles its weight, so square the base.
            x *= x;
            power >>= 1;
        }
        return answer;
    }
}
```

## 3. Correctness

The exponent's binary expansion expresses `power` as a sum of powers of two. The loop maintains the base raised to the current power-of-two weight and multiplies it into `answer` exactly for set bits, reconstructing `x^n`.

## 4. Complexity

`O(log |n|)` time, `O(1)` space.
