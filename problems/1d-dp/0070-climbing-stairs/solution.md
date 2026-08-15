# 70. Climbing Stairs — Solution

## 1. Core idea / Intuition

Mọi cách tới bậc `i` kết thúc bằng đúng một trong hai bước cuối:

- đi `1` bậc từ `i-1`;
- đi `2` bậc từ `i-2`.

Hai nhóm cách này không trùng nhau, nên:

```text
ways[i] = ways[i-1] + ways[i-2]
```

Đây chính là Fibonacci-style DP.

## 2. Requirement recap / Tóm tắt yêu cầu

Mỗi move dài `1` hoặc `2`; thứ tự move khác nhau tạo cách khác nhau. Cần đếm số sequence move có tổng đúng `n`.

## 3. Key observations / Nhận xét quan trọng

- `ways[1]=1`.
- `ways[2]=2`.
- Mỗi state chỉ cần hai state trước.
- Với `n<=45`, kết quả vẫn vừa trong Java `int`.

## 4. Alternative approaches / Các hướng khác

Recursive brute force lặp subproblem và có exponential time. Memoization/DP array đạt `O(n)` time và `O(n)` space. Rolling two-state DP giảm extra space xuống `O(1)`.

## 5. Optimal approach / Hướng tối ưu

Nếu `n<=2`, trả `n`. Sau đó giữ `oneStepBack` và `twoStepsBack`, lặp từ `3..n`.

## 6. Java solution overview

```java
class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int twoStepsBack = 1;
        int oneStepBack = 2;
        for (int step = 3; step <= n; step++) {
            int current = oneStepBack + twoStepsBack;
            twoStepsBack = oneStepBack;
            oneStepBack = current;
        }
        return oneStepBack;
    }
}
```

## 7. Code explanation / Giải thích code

Hai biến rolling giữ đúng `ways[i-2]` và `ways[i-1]`. Sau khi tính `current`, dịch chúng lên một bậc cho iteration kế tiếp.

## 8. Dry run / Chạy thử

`n=5`: các state là `1,2,3,5,8`, nên có `8` cách.

## 9. Time and space complexity

```text
Time:  O(n)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mọi cách tới `i` có last move dài `1` hoặc `2`, tương ứng bijection với mọi cách tới `i-1` hoặc `i-2`. Hai tập rời nhau nên tổng count là recurrence trên. Base cases đúng cho `1` và `2`; theo quy nạp, mọi state và kết quả cuối đều đúng.

## 11. Edge cases

- `n=1`.
- `n=2`.
- Giá trị lớn nhất `n=45`.

## 12. Common mistakes

- Dùng Fibonacci base `0,1` rồi lệch index.
- Đếm combination nhưng bỏ qua thứ tự move.
- Recursion thuần gây lặp lớn.

## 13. Pattern recognition / Khi nào tái sử dụng

Khi state hiện tại có thể đến từ một số bước nhảy cố định trước đó, recurrence dạng Fibonacci/k-step DP thường xuất hiện.

## 14. Vocabulary

- **staircase**: cầu thang
- **distinct ways**: các cách khác nhau
- **last move**: bước cuối
- **Fibonacci-style DP**: DP dạng Fibonacci
- **rolling state**: state cuộn/nén
