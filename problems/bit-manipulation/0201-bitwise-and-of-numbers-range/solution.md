# Solution / Lời giải — 201. Bitwise AND of Numbers Range

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Bitwise AND của mọi số trong [left,right] chỉ giữ những prefix bits không thay đổi trên cả range. Khi range đi qua một boundary làm bit thay đổi, bit đó và mọi bit thấp hơn kết quả phải thành0.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** AND từng số có thể O(right-left). Observation dịch left/right phải cho tới khi chúng bằng nhau sẽ loại các suffix bits biến động; common prefix còn lại dịch trái lại chính là answer.

**State / invariant / data structure cần hiểu trước code.** shift đếm số low bits đã bỏ. Invariant sau mỗi >>, left/right biểu diễn range endpoints không xét shift low bits; khi equal, value đó là common high-bit prefix của mọi số ban đầu.

**Dry run mental theo implementation.** Dry run [5,7]: 101 và111 khác, shift ->10 và11; shift ->1 và1, shift=2; common prefix1 <<2 =100=4, đúng 5&6&7.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là tìm AND chỉ hai endpoints dù intermediate có thể clear thêm bits. Khi nào dùng: aggregate bitwise AND trên contiguous range = tìm common binary prefix của endpoints.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
