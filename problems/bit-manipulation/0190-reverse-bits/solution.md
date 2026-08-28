# Solution / Lời giải — 190. Reverse Bits

## 1. Core idea

Read the 32 source bits from least significant to most significant and append each one to the result from left to right.

## 2. Optimal Java solution

```java
class Solution {
    public int reverseBits(int n) {
        int result = 0;

        // int has exactly 32 bits; process all of them so leading zeros in n become
        // trailing zeros in the reversed representation rather than being skipped.
        for (int i = 0; i < 32; i++) {
            // Shift the already-built prefix left and append n's current low bit.
            result = (result << 1) | (n & 1);

            // Unsigned shift is required: for negative n, arithmetic >> would keep
            // injecting sign-bit ones instead of exposing the original 32-bit pattern.
            n >>>= 1;
        }
        return result;
    }
}
```

## 3. Correctness

Iteration `i` extracts original bit `i` and appends it after all previously extracted lower bits, placing it at reversed position `31-i`. Processing all 32 positions produces exactly the reversed bit pattern.

## 4. Complexity

32 constant iterations: `O(1)` time and space.
