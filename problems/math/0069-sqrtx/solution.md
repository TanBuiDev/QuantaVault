# Solution / Lời giải — 69. Sqrt(x)

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Integer sqrt(x) là số nguyên lớn nhất r sao cho r*r<=x. Predicate mid*mid<=x là monotonic theo mid, nên bài là tìm last true boundary trong [0,x].

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Tăng r từ0 tới sqrt(x) là O(sqrt x). Binary search boundary cho O(log x), nhưng phép mid*mid phải dùng long hoặc so mid<=x/mid để tránh int overflow.

**State / invariant / data structure cần hiểu trước code.** Search interval chứa floor sqrt. Khi square<=x, mid là candidate hợp lệ và có thể tìm lớn hơn bên phải; khi square>x, mọi value >=mid cũng quá lớn nên right giảm.

**Dry run mental theo implementation.** Dry run x=8: mid4 square16 quá lớn -> right3; mid1 valid -> ans1,left2; mid2 square4 valid -> ans2,left3; mid3 square9 quá lớn, trả2.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là overflow square hoặc trả insertion point sai một. Khi nào dùng: tìm largest/smallest integer thỏa monotonic numeric predicate thường là binary search on answer.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

The integer square root is the largest integer `r` satisfying `r² <= x`. Binary-search that monotone feasibility condition.

## 2. Optimal Java solution

```java
class Solution {
    public int mySqrt(int x) {
        if (x < 2) {
            return x;
        }

        int left = 1;
        int right = x / 2;
        int answer = 1;

        // Search for the largest integer mid whose square is <= x.
        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Cast before multiplication because mid*mid can exceed signed int range.
            long square = (long) mid * mid;

            if (square <= x) {
                // mid is feasible; remember it and look right for a larger feasible root.
                answer = mid;
                left = mid + 1;
            } else {
                // mid and every larger number square above x, so discard them.
                right = mid - 1;
            }
        }

        return answer;
    }
}
```

## 3. Correctness

Feasibility `r² <= x` is monotone over nonnegative integers. The search records every feasible midpoint and discards only values proven too small or too large; the final recorded value is therefore the greatest feasible integer, `floor(sqrt(x))`.

## 4. Complexity

`O(log x)` time, `O(1)` space.
