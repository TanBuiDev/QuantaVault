# 64. Minimum Path Sum — Solution

## 1. Core idea / Intuition

Vì robot chỉ đi xuống hoặc sang phải, chi phí tối ưu để đến một ô chỉ phụ thuộc hai predecessor: ô trên và ô trái.

Ta dùng:

```text
dp[j] = minimum path sum đến cột j của hàng hiện tại
```

Trước update, `dp[j]` là cost từ top; sau khi update `dp[j-1]`, nó là cost từ left.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần đi từ `(0,0)` tới `(m-1,n-1)`, mỗi bước down/right, và tối thiểu hóa tổng giá trị của mọi ô trên đường, kể cả ô đầu và cuối.

## 3. Key observations / Nhận xét quan trọng

- Mọi giá trị đều không âm, nhưng DP vẫn là cách trực tiếp vì mỗi ô có nhiều đường prefix.
- Hàng đầu chỉ có thể đến từ trái; cột đầu chỉ có thể đến từ trên.
- Sau khi khởi tạo hàng đầu, các hàng sau có thể update in-place trên `dp`.

## 4. Alternative approaches / Các hướng khác

DFS thử mọi đường có số lượng tổ hợp lớn. Dijkstra là dư thừa vì graph có cấu trúc DAG theo hướng di chuyển. 2D DP đạt `O(mn)` time và `O(mn)` space; rolling row giảm space xuống `O(n)`.

## 5. Optimal approach / Hướng tối ưu

Khởi tạo prefix sum cho hàng đầu. Với mỗi hàng sau, update `dp[0]` bằng cách cộng ô hiện tại; các cột còn lại dùng:

```text
dp[j] = grid[i][j] + min(dp[j], dp[j-1])
```

## 6. Java solution overview

```java
class Solution {
    public int minPathSum(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        int[] dp = new int[cols];
        dp[0] = grid[0][0];
        for (int j = 1; j < cols; j++) {
            dp[j] = dp[j - 1] + grid[0][j];
        }
        for (int i = 1; i < rows; i++) {
            dp[0] += grid[i][0];
            for (int j = 1; j < cols; j++) {
                dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
            }
        }
        return dp[cols - 1];
    }
}
```

## 7. Code explanation / Giải thích code

`dp[j]` cũ là minimum cost từ top; `dp[j-1]` mới là minimum cost từ left. Lấy minimum rồi cộng giá trị ô hiện tại chính là recurrence 2D đã nén.

## 8. Dry run / Chạy thử

Với `[[1,2,3],[4,5,6]]`, hàng đầu thành `[1,3,6]`; hàng hai lần lượt `[5,8,12]`. Kết quả `12`.

## 9. Time and space complexity

```text
Time:  O(m * n)
Space: O(n)
```

## 10. Why the algorithm is correct / Vì sao đúng

Bước cuối để tới mỗi ô chỉ có thể từ top hoặc left. Nếu ta đã biết minimum path sum đến hai predecessor đó, mọi đường tốt hơn tới ô hiện tại phải dùng predecessor có cost nhỏ hơn; cộng `grid[i][j]` cho cost chính xác. Base row/column có duy nhất một đường. Theo quy nạp theo thứ tự scan, mọi `dp[j]` đều tối ưu, nên ô cuối là đáp án.

## 11. Edge cases

- Grid `1x1`.
- Một hàng.
- Một cột.
- Có nhiều đường cùng minimum.
- Giá trị bằng `0`.

## 12. Common mistakes

- Quên tính cả giá trị ô bắt đầu.
- Dùng `max` thay vì `min`.
- Xử lý sai hàng/cột đầu.
- Ghi đè `dp` theo thứ tự làm mất left state.

## 13. Pattern recognition / Khi nào tái sử dụng

Grid DP tối ưu đường đi thường có state là best cost tới mỗi ô và transition từ các hướng di chuyển được phép.

## 14. Vocabulary

- **minimum path sum**: tổng đường đi nhỏ nhất
- **grid DP**: quy hoạch động trên lưới
- **predecessor**: trạng thái tiền nhiệm
- **rolling row**: nén theo hàng
