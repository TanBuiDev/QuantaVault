# Solution / Lời giải — 172. Factorial Trailing Zeroes

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
