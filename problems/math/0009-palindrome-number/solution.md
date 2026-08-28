# Solution / Lời giải — 9. Palindrome Number

## 1. Core idea

Reverse only the lower half of the decimal digits. When the reversed half catches the remaining prefix, compare the halves directly; for odd length, drop the middle digit.

## 2. Optimal Java solution

```java
class Solution {
    public boolean isPalindrome(int x) {
        // Negative numbers have a leading '-' with no matching trailing symbol.
        // A nonzero number ending in 0 would need an impossible leading 0 when reversed.
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }

        int reversedHalf = 0;

        // Reverse only half the digits: this avoids possible full-number overflow and
        // stops exactly when reversedHalf has caught up with the unprocessed prefix.
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }

        // Even length: halves must match. Odd length: reversedHalf contains the
        // middle digit as its last digit, which is ignored by dividing it by 10.
        return x == reversedHalf || x == reversedHalf / 10;
    }
}
```

## 3. Correctness

Each loop moves one trailing digit from `x` into `reversedHalf`. At termination the two variables hold the two decimal halves in comparable orientation; equality (ignoring the odd middle digit) is exactly the palindrome condition.

## 4. Complexity

`O(log10 x)` time and `O(1)` space.
