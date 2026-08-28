# Solution / Lời giải — 67. Add Binary

## 1. Core idea

Perform ordinary column addition from right to left. For each column, the low bit of `sum` is the result digit and the next bit is the carry.

## 2. Optimal Java solution

```java
class Solution {
    public String addBinary(String a, String b) {
        StringBuilder out = new StringBuilder();
        int i = a.length() - 1;
        int j = b.length() - 1;
        int carry = 0;

        // Binary addition must start at the least-significant end because each
        // column can create a carry for the next more-significant column.
        while (i >= 0 || j >= 0 || carry != 0) {
            int sum = carry;
            if (i >= 0) sum += a.charAt(i--) - '0';
            if (j >= 0) sum += b.charAt(j--) - '0';

            // sum is 0..3: its low bit is the output digit and sum/2 is carry.
            out.append(sum & 1);
            carry = sum >> 1;
        }

        // Digits were produced least-significant first, so reverse once at the end.
        return out.reverse().toString();
    }
}
```

## 3. Correctness

At every iteration `carry` is exactly the carry from the less-significant column. `sum & 1` emits the correct current bit and `sum >> 1` produces the correct next carry, so all columns are added exactly as binary arithmetic requires.

## 4. Complexity

`O(max(|a|,|b|))` time and output space.
