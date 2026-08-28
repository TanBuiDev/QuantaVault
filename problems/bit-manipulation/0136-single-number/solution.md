# Solution / Lời giải — 136. Single Number

## 1. Core idea

XOR all values. Equal pairs cancel because `x ^ x = 0`, and XOR order does not matter.

## 2. Optimal Java solution

```java
class Solution {
    public int singleNumber(int[] nums) {
        int answer = 0;

        for (int num : nums) {
            // XOR is associative/commutative and x ^ x == 0, so every duplicated
            // value cancels with its pair regardless of input order.
            answer ^= num;
        }

        // 0 ^ unique == unique after all pairs have vanished.
        return answer;
    }
}
```

## 3. Correctness

Reordering XOR terms groups every duplicated value into `x ^ x = 0`; only the unique value remains XORed with zero.

## 4. Complexity

`O(n)` time, `O(1)` space.
