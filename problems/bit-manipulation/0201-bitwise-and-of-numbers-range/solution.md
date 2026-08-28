# Solution / Lời giải — 201. Bitwise AND of Numbers Range

## 1. Core idea

The range AND keeps only the binary prefix common to both endpoints. Every bit below their first differing position varies within the consecutive range and therefore becomes zero.

## 2. Optimal Java solution

```java
class Solution {
    public int rangeBitwiseAnd(int left, int right) {
        int shifts = 0;

        // Across a consecutive range, every bit below the first differing prefix bit
        // takes both 0 and 1 somewhere, so those suffix bits must AND to 0.
        while (left != right) {
            left >>= 1;
            right >>= 1;
            shifts++;
        }

        // What remains is the common binary prefix shared by every number in range;
        // restore its position and fill the proven-varying suffix with zeros.
        return left << shifts;
    }
}
```

## 3. Correctness

Right-shifting until the endpoints match removes exactly the suffix containing every differing bit. Those suffix positions must AND to zero across the full range; the equal remaining prefix appears in every number and survives unchanged.

## 4. Complexity

At most 31 shifts for nonnegative 32-bit inputs: `O(1)` time and space.
