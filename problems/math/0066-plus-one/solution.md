# Solution / Lời giải — 66. Plus One

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Plus One là phép cộng tay 1 vào số lưu dạng digits. Bắt đầu từ cuối: nếu digit<9 chỉ tăng và xong; nếu digit=9 thì thành0 và carry tiếp sang trái.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Convert array thành integer/string parse có overflow với số rất dài. Quan sát carry ở bài này chỉ là 0/1 và chỉ lan qua suffix toàn số9, nên một backward pass là đủ.

**State / invariant / data structure cần hiểu trước code.** Index i đi từ cuối; suffix sau i đã được xử lý thành0 nếu carry còn lan. Nếu gặp digit<9, increment và return ngay vì carry kết thúc; nếu mọi digits là9 cần array mới length+1 với leading1.

**Dry run mental theo implementation.** Dry run [1,2,9]: 9->0 carry; digit2<9 ->3 và return [1,3,0]. Với [9,9], cả hai thành0 rồi tạo [1,0,0].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là luôn tạo array mới hoặc dừng sau 9 đầu tiên. Khi nào dùng: arithmetic trên digit arrays nên mô phỏng carry trực tiếp thay vì chuyển sang primitive numeric type.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
