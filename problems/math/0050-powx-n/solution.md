# Solution / Lời giải — 50. Pow(x, n)

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
