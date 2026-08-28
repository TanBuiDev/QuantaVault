# Solution / Lời giải — 66. Plus One

## 1. Core idea

Propagate a decimal carry from the least-significant digit. Any digit below `9` absorbs the increment immediately; only a suffix of `9`s needs to become zeros.

## 2. Optimal Java solution

```java
class Solution {
    public int[] plusOne(int[] digits) {
        // Addition starts at the least-significant digit because only a 9 can
        // propagate a carry farther to the left.
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                // The first non-9 absorbs the +1 and ends all carry propagation.
                digits[i]++;
                return digits;
            }

            // 9 + 1 becomes 0 with carry 1 to the next digit.
            digits[i] = 0;
        }

        // Reaching here means every original digit was 9, so the result is
        // 1 followed by exactly digits.length zeros.
        int[] result = new int[digits.length + 1];
        result[0] = 1;
        return result;
    }
}
```

## 3. Correctness

The loop exactly simulates adding one with carry from right to left. It stops at the first digit that can absorb the carry; if none exists, all digits were `9` and the number grows by one decimal position.

## 4. Complexity

`O(n)` worst-case time, `O(1)` extra space unless a new `n+1` output array is required.
