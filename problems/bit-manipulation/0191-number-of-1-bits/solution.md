# Solution / Lời giải — 191. Number of 1 Bits

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Đếm set bits có thể kiểm từng bit, nhưng trick n & (n-1) luôn xóa đúng bit1 thấp nhất của n. Số lần lặp tới0 chính là số bit1.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Loop32 bits đã O(1), nhưng Brian Kernighan chỉ lặp theo số set bits. Observation subtract1 biến lowest 1 thành0 và các zeros sau nó thành1; AND với original xóa đúng lowest1 đó.

**State / invariant / data structure cần hiểu trước code.** n sau mỗi iteration là original value với một số lowest set bits đã bị xóa; count là số bits đã xóa. Invariant popcount(original)=count+popcount(n).

**Dry run mental theo implementation.** Dry run n=12 binary1100: 12&11 (1100&1011)=1000=8 count1; 8&7=0 count2, nên 12 có hai set bits.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dùng n%2 với signed behavior hoặc không hiểu n-1 transform. Khi nào dùng: thao tác cần remove/iterate set bits thường dùng n &= n-1.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
