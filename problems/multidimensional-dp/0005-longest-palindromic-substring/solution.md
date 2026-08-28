# Solution / Lời giải — 5. Longest Palindromic Substring

## 1. Core idea

Every palindrome expands symmetrically from either a character center or a gap center. Try both center types at every position and keep the longest expansion.

## 2. Optimal Java solution

```java
class Solution {
    public String longestPalindrome(String s) {
        int start = 0;
        int end = 0;

        for (int center = 0; center < s.length(); center++) {
            // Every palindrome has either one character as its center (odd length)
            // or a gap between two characters as its center (even length).
            int odd = expand(s, center, center);
            int even = expand(s, center, center + 1);
            int len = Math.max(odd, even);

            if (len > end - start + 1) {
                // These formulas map both odd/even lengths back to inclusive bounds
                // around this center without separate parity branches.
                start = center - (len - 1) / 2;
                end = center + len / 2;
            }
        }

        return s.substring(start, end + 1);
    }

    private int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length()
                && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }

        // The loop stops one position beyond both ends of the palindrome.
        return right - left - 1;
    }
}
```

## 3. Correctness

Every palindrome has exactly one odd or even center. Expanding maximally from every possible center therefore examines the full extent of every palindromic substring, so the longest recorded one is globally optimal.

## 4. Complexity

`O(n²)` time, `O(1)` auxiliary space.
