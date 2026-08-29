# Solution / Lời giải — 67. Add Binary

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Add Binary giống cộng thập phân nhưng base2: tại mỗi vị trí sum=bitA+bitB+carry, output bit=sum%2 và carry=sum/2. Hai strings có thể khác length nên pointers đi từ phải sang trái độc lập.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Parse binary thành integer có overflow với chuỗi dài. Digit-by-digit addition là O(max(m,n)) và chỉ cần StringBuilder plus carry.

**State / invariant / data structure cần hiểu trước code.** i,j trỏ bits chưa xử lý; carry thuộc {0,1}. Invariant builder đang chứa các result bits từ least significant lên; mỗi loop consume tối đa một bit mỗi input và tạo đúng một output bit.

**Dry run mental theo implementation.** Dry run 1010+1011: từ phải 0+1=1; 1+1=2 output0 carry1; 0+0+1=1; 1+1=2 output0 carry1; append carry1 rồi reverse thành10101.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là quên carry sau khi cả pointers hết hoặc không reverse output. Khi nào dùng: addition trên arbitrary-base strings là synchronized backward pointers + carry.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
