# Solution / Lời giải — 9. Palindrome Number

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Palindrome Number có thể kiểm tra digits đối xứng mà không convert string. Với 1221, ta chỉ cần reverse nửa cuối thành 12 rồi so với nửa đầu còn lại 12, tránh reverse toàn số gây overflow.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** String conversion đơn giản nhưng dùng representation phụ. Reverse toàn integer có nguy cơ overflow; observation khi reversedHalf >= remainingHalf là đã đi qua nửa số, đủ để so hai halves.

**State / invariant / data structure cần hiểu trước code.** x giữ nửa đầu chưa consume, reversed giữ digits đã lấy từ cuối theo thứ tự đảo. Invariant mỗi loop chuyển đúng digit cuối của x sang reversed. Số âm và số kết thúc 0 (trừ0) reject sớm.

**Dry run mental theo implementation.** Dry run 1221: reversed=1,x=122; reversed=12,x=12 rồi stop và compare equal. Với 121: reversed=1,x=12; reversed=12,x=1, odd length bỏ middle bằng reversed/10=1 nên match.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là reverse toàn số rồi overflow hoặc quên odd digit giữa. Khi nào dùng: numeric palindrome có thể compare halves bằng digit extraction để giữ O(1) space.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
