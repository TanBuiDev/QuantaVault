# Solution / Lời giải — 191. Number of 1 Bits

## 1. Core idea

Brian Kernighan's trick `n &= n - 1` removes the lowest set bit. Count how many removals are needed to reach zero.

## 2. Optimal Java solution

```java
class Solution {
    public int hammingWeight(int n) {
        int count = 0;

        while (n != 0) {
            // n-1 flips the lowest set bit to 0 and all lower zeros to 1; AND with
            // original n therefore clears exactly that lowest set bit and nothing higher.
            n &= n - 1;
            count++;
        }

        // One iteration runs per original set bit, so count is the Hamming weight.
        return count;
    }
}
```

## 3. Correctness

Each loop removes exactly one `1` bit and never changes any other set bit to `1`. Thus the number of iterations equals the original population count.

## 4. Complexity

`O(number of set bits)`, at most 32 iterations; `O(1)` space.
