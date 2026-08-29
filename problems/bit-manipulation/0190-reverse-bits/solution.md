# Solution / Lời giải — 190. Reverse Bits

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Reverse Bits chuyển bit ở vị trí thấp của input thành vị trí cao tương ứng của output. Ta có thể lặp đúng32 lần: shift result trái, lấy lowest bit của n, rồi unsigned-shift n phải.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Convert binary string rồi reverse vừa thừa vừa dễ mất leading zeros. Fixed 32-bit operations giữ đủ zeros và O(1) time theo word size.

**State / invariant / data structure cần hiểu trước code.** Sau k iterations, result chứa k lowest bits ban đầu theo thứ tự đảo ở phần đã build; n đã bỏ k lowest bits bằng >>>. Dùng >>> thay >> để không sign-extend số âm.

**Dry run mental theo implementation.** Nếu low bits đầu ...101, iterations lần lượt append1 rồi0 rồi1 vào result bằng result=(result<<1)|(n&1), đồng thời n>>>=1 mỗi bước cho đủ32 positions.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dừng khi n==0 làm mất leading zeros hoặc dùng signed >>. Khi nào dùng: fixed-width bit permutation nên lặp đúng word size và dùng masks/shifts rõ ràng.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Read the 32 source bits from least significant to most significant and append each one to the result from left to right.

## 2. Optimal Java solution

```java
class Solution {
    public int reverseBits(int n) {
        int result = 0;

        // int has exactly 32 bits; process all of them so leading zeros in n become
        // trailing zeros in the reversed representation rather than being skipped.
        for (int i = 0; i < 32; i++) {
            // Shift the already-built prefix left and append n's current low bit.
            result = (result << 1) | (n & 1);

            // Unsigned shift is required: for negative n, arithmetic >> would keep
            // injecting sign-bit ones instead of exposing the original 32-bit pattern.
            n >>>= 1;
        }
        return result;
    }
}
```

## 3. Correctness

Iteration `i` extracts original bit `i` and appends it after all previously extracted lower bits, placing it at reversed position `31-i`. Processing all 32 positions produces exactly the reversed bit pattern.

## 4. Complexity

32 constant iterations: `O(1)` time and space.
