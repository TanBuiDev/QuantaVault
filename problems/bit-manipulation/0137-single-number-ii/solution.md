# Solution / Lời giải — 137. Single Number II

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Nếu mọi number khác xuất hiện ba lần, xét từng bit position thì số bit1 từ triplicates là bội của3; count bit modulo3 còn lại chính là bit của single number.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** HashMap frequency O(n) space. Có thể count 32 bits O(32n), hoặc dùng two bitmasks ones/twos như một finite-state machine mod3. Mental model modulo per bit giúp hiểu thay vì học công thức mask.

**State / invariant / data structure cần hiểu trước code.** Với bit-count approach, count[b] là số occurrences bit b trong toàn input; result set bit nếu count[b]%3==1. Dùng unsigned shift/bit operations đúng cả số âm theo two's-complement 32-bit.

**Dry run mental theo implementation.** Dry run [2,2,3,2]: bit1 của value2 xuất hiện3 lần -> modulo0; bits của3 gồm bit0 một lần và bit1 thêm một làm total bit1=4 -> modulo1, reconstruct3.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dùng XOR như bài136, vì ba copies không triệt tiêu. Khi nào dùng: repeated frequency k và một outlier thường giải bằng per-bit counts modulo k hoặc bit-state machine.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Treat every bit position as a counter modulo 3. Two bitmasks `ones` and `twos` encode whether that bit has appeared once or twice modulo 3.

## 2. Optimal Java solution

```java
class Solution {
    public int singleNumber(int[] nums) {
        // For each bit independently, ones/twos encode occurrence count modulo 3:
        // 00 = seen 0 mod 3, 01 = seen once, 10 = seen twice.
        int ones = 0;
        int twos = 0;

        for (int num : nums) {
            // XOR toggles the incoming bits into the next count state; masking by
            // the other register keeps ones and twos mutually exclusive. On the
            // third occurrence a bit is cleared from both registers (count -> 0 mod 3).
            ones = (ones ^ num) & ~twos;
            twos = (twos ^ num) & ~ones;
        }

        // Triplicated values contribute 0 modulo 3 at every bit; the unique value
        // contributes exactly one occurrence, so its complete bit pattern is in ones.
        return ones;
    }
}
```

## 3. Correctness

Each bit follows the state cycle `00 -> 01 -> 10 -> 00` as it is encountered three times. All triplicated numbers therefore disappear modulo 3, while every set bit of the single number finishes in the `ones` state.

## 4. Complexity

`O(n)` time, `O(1)` space.
