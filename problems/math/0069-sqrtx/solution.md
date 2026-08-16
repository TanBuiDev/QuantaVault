# 69. Sqrt(x) — Solution

## 1. Core idea / Intuition

Ta cần floor của căn bậc hai. Predicate `m*m <= x` là monotonic: đúng cho mọi `m` nhỏ hơn hoặc bằng đáp án và sai sau đó, nên binary search trên đáp án là tự nhiên.

## 2. Requirement recap / Tóm tắt yêu cầu

Không dùng `pow` hay toán tử exponent. Cần trả về số nguyên không âm lớn nhất có bình phương không vượt quá `x`.

## 3. Key observations / Nhận xét quan trọng

- Với `x < 2`, đáp án chính là `x`.
- Dùng `long` cho `mid * mid` để tránh overflow.
- Lưu `answer` mỗi khi `square <= x` rồi tìm lớn hơn ở nửa phải.

## 4. Alternative approaches / Các hướng khác

Có thể dùng Newton's method, nhưng binary search dễ chứng minh và vẫn đạt `O(log x)`.

## 5. Optimal approach / Hướng tối ưu

Binary search trên `[1, x/2]`. Nếu `mid^2 <= x`, cập nhật đáp án và tăng `left`; ngược lại giảm `right`.

## 6. Java solution overview

```java
class Solution {
    public int mySqrt(int x) {
        if (x < 2) return x;
        int left = 1;
        int right = x / 2;
        int answer = 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            long square = (long) mid * mid;
            if (square <= x) {
                answer = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return answer;
    }
}
```

## 7. Code explanation / Giải thích code

`answer` luôn là giá trị hợp lệ lớn nhất đã thấy. Khi `mid^2 <= x`, mọi số nhỏ hơn cũng hợp lệ nên ta thử nửa phải.

## 8. Dry run / Chạy thử

Với `x = 8`, binary search xác nhận `2^2 <= 8` nhưng `3^2 > 8`, nên trả về `2`.

## 9. Time and space complexity

```text
Time:  O(log x)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Binary search duy trì invariant rằng đáp án là phần tử lớn nhất thỏa `m^2 <= x`. Mỗi lần gặp giá trị hợp lệ, ta giữ nó và chỉ tìm giá trị lớn hơn; khi gặp giá trị không hợp lệ, ta loại toàn bộ nửa phải. Khi vòng lặp kết thúc, `answer` chính là floor sqrt.

## 11. Edge cases

- `x = 0`
- `x = 1`
- perfect square
- giá trị gần `Integer.MAX_VALUE`

## 12. Common mistakes

- Dùng `int mid * mid` gây overflow.
- Trả về `right` hoặc `left` mà không hiểu invariant.
- Tìm đúng square thay vì floor square root.

## 13. Pattern recognition / Khi nào tái sử dụng

Binary search on answer áp dụng khi có một predicate monotonic trên miền đáp án.

## 14. Vocabulary

- **square root**: căn bậc hai
- **rounded down**: làm tròn xuống
- **binary search on answer**: tìm kiếm nhị phân trên miền đáp án
- **overflow**: tràn số
