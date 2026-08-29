# Solution / Lời giải — 136. Single Number

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** XOR có hai tính chất x^x=0 và x^0=x, lại associative/commutative. Vì mọi number trừ một xuất hiện đúng hai lần, các pairs tự triệt tiêu bất kể thứ tự.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** HashSet/count map dùng O(n) space; sort O(n log n). XOR accumulator cho O(n), O(1) bằng chính constraint 'mọi phần tử hai lần trừ một'.

**State / invariant / data structure cần hiểu trước code.** result là XOR của prefix đã xử lý. Invariant duplicate pair đóng góp0; cuối cùng result=0 ^ single = single. Không cần biết pair nằm cạnh nhau.

**Dry run mental theo implementation.** Dry run [4,1,2,1,2]: (((0^4)^1)^2)^1^2. Reorder conceptually thành 4^(1^1)^(2^2)=4^0^0=4.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là áp dụng XOR khi frequency pattern không đúng. Khi nào dùng: values xuất hiện số lần chẵn và một outlier thường gợi ý cancellation bằng XOR.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
