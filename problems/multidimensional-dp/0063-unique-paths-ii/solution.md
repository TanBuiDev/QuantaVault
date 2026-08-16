# 63. Unique Paths II — Solution

## 1. Core idea / Intuition

Đây là grid DP. Vì robot chỉ đi xuống hoặc sang phải, mọi đường đến `(i,j)` phải đến từ `(i-1,j)` hoặc `(i,j-1)`.

Ta dùng rolling array:

```text
dp[j] = số đường hợp lệ đến cột j của hàng đang xử lý
```

Trước khi update, `dp[j]` là số đường từ phía trên. Sau khi `dp[j-1]` đã được update, nó là số đường từ phía trái.

Nếu ô hiện tại là obstacle:

```text
dp[j] = 0
```

Nếu là ô trống:

```text
dp[j] += dp[j - 1]
```

## 2. Requirement recap / Tóm tắt yêu cầu

Robot bắt đầu ở góc trên-trái, chỉ đi xuống hoặc phải, không được đi qua ô `1`. Cần đếm số đường hợp lệ tới góc dưới-phải.

## 3. Key observations / Nhận xét quan trọng

- Obstacle chặn mọi đường tới chính ô đó nên state phải về `0`.
- `dp[0] = 1` đóng vai trò seed cho điểm xuất phát; nếu start là obstacle, vòng lặp đầu sẽ reset nó về `0`.
- Chỉ cần current row + previous-row values nên không cần bảng `m x n`.

## 4. Alternative approaches / Các hướng khác

DFS brute force có thể duyệt rất nhiều đường lặp. Memoization đạt `O(mn)` nhưng dùng bảng/cache 2D. Bottom-up rolling DP giữ cùng time và giảm memory xuống `O(n)`.

## 5. Optimal approach / Hướng tối ưu

Khởi tạo:

```java
int[] dp = new int[n];
dp[0] = 1;
```

Duyệt từng ô từ trái sang phải, trên xuống dưới. Obstacle reset state; ô trống cộng top + left.

## 6. Java solution overview

```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int rows = obstacleGrid.length;
        int cols = obstacleGrid[0].length;
        int[] dp = new int[cols];
        dp[0] = 1;

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (obstacleGrid[i][j] == 1) {
                    dp[j] = 0;
                } else if (j > 0) {
                    dp[j] += dp[j - 1];
                }
            }
        }
        return dp[cols - 1];
    }
}
```

## 7. Code explanation / Giải thích code

`dp[j]` giữ contribution từ top. `dp[j-1]` đã là current-row left. Vì vậy phép cộng tại ô trống chính xác là recurrence 2D đã được nén.

## 8. Dry run / Chạy thử

Với grid `[[0,1],[0,0]]`: hàng đầu tạo `[1,0]`; hàng hai tại cột 0 giữ `1`, cột 1 cộng `0 + 1 = 1`. Đáp án `1`.

## 9. Time and space complexity

```text
Time:  O(m * n)
Space: O(n)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mọi đường hợp lệ đến ô trống cuối cùng phải đến từ top hoặc left, hai tập đường này rời nhau theo bước cuối nên có thể cộng. Với obstacle không có đường hợp lệ nào nên state bằng `0`. Base state tạo đúng một cách đứng tại start khi start trống. Theo quy nạp theo thứ tự scan, mỗi `dp[j]` luôn là số đường hợp lệ tới ô hiện tại.

## 11. Edge cases

- Start là obstacle.
- Destination là obstacle.
- Một hàng hoặc một cột.
- Không có obstacle.
- Obstacle chặn toàn bộ đường.

## 12. Common mistakes

- Không reset state về `0` khi gặp obstacle.
- Khởi tạo cả hàng đầu bằng `1` dù có obstacle.
- Cộng từ ô obstacle như ô trống.
- Dùng sai thứ tự scan với rolling array.

## 13. Pattern recognition / Khi nào tái sử dụng

Grid path counting với bước đi hạn chế thường dùng recurrence từ các predecessor cell; obstacle thường biến state thành zero.

## 14. Vocabulary

- **obstacle**: chướng ngại vật
- **unique path**: đường đi khác nhau
- **grid DP**: quy hoạch động trên lưới
- **rolling array**: mảng DP nén
- **predecessor cell**: ô tiền nhiệm
