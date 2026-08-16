# 50. Pow(x, n) — Solution

## 1. Core idea / Intuition

Dùng **binary exponentiation**. Mỗi vòng xử lý một bit của exponent: nếu bit thấp nhất là `1`, nhân `result` với `base`; sau đó bình phương `base` và chia exponent cho `2`.

## 2. Requirement recap / Tóm tắt yêu cầu

Tính `x^n`, hỗ trợ số mũ âm và toàn bộ miền `int` của `n`.

## 3. Key observations / Nhận xét quan trọng

- `x^(-n) = (1/x)^n`.
- Phải đưa `n` sang `long` trước khi đổi dấu để xử lý `Integer.MIN_VALUE`.
- Exponent giảm một nửa mỗi vòng.

## 4. Alternative approaches / Các hướng khác

Nhân `x` lặp `|n|` lần là `O(|n|)`. Binary exponentiation giảm xuống `O(log |n|)`.

## 5. Optimal approach / Hướng tối ưu

```text
power = n as long
if power < 0: base = 1/base; power = -power
while power > 0:
    if power is odd: answer *= base
    base *= base
    power /= 2
```

## 6. Java solution overview

```java
class Solution {
    public double myPow(double x, int n) {
        long power = n;
        if (power < 0) {
            x = 1.0 / x;
            power = -power;
        }
        double answer = 1.0;
        while (power > 0) {
            if ((power & 1L) == 1L) answer *= x;
            x *= x;
            power >>= 1;
        }
        return answer;
    }
}
```

## 7. Code explanation / Giải thích code

Mỗi bit `1` trong binary representation đóng góp một power-of-two factor của `x`. Squaring lần lượt tạo `x^1, x^2, x^4, ...`.

## 8. Dry run / Chạy thử

`2^10`: exponent `1010₂`; thuật toán nhân các factor tương ứng `2^2` và `2^8`, được `1024`.

## 9. Time and space complexity

`O(log |n|)` time, `O(1)` extra space.

## 10. Why the algorithm is correct / Vì sao đúng

Invariant: `answer * base^power` luôn bằng giá trị power còn phải tính. Với exponent lẻ, tách một factor `base`; sau đó squaring base và halving exponent giữ invariant. Khi power bằng `0`, `answer` là kết quả.

## 11. Edge cases

`n=0`, `n<0`, `x<0`, `Integer.MIN_VALUE`, `x=1`.

## 12. Common mistakes

Negate `int n` trực tiếp; quên reciprocal cho exponent âm; dùng loop tuyến tính.

## 13. Pattern recognition / When to reuse

Exponentiation by squaring áp dụng khi phép toán có tính kết hợp và exponent/count lớn.

## 14. Vocabulary

- **binary exponentiation**: lũy thừa nhị phân
- **reciprocal**: nghịch đảo
- **exponent**: số mũ
- **square the base**: bình phương cơ số
