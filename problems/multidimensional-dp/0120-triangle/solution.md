# 120. Triangle — Solution

## 1. Core idea / Intuition

Bottom-up DP rất tự nhiên: nếu đã biết minimum path sum từ mỗi vị trí ở hàng dưới xuống đáy, thì tại `(i,j)` chỉ cần chọn child tốt hơn giữa `(i+1,j)` và `(i+1,j+1)`.

```text
dp[j] = triangle[i][j] + min(dp[j], dp[j+1])
```

Khởi tạo `dp` bằng hàng cuối rồi đi ngược từ hàng kế cuối lên đỉnh.

## 2. Requirement recap / Tóm tắt yêu cầu

Mỗi bước chỉ đi xuống một trong hai vị trí kề. Cần minimum sum từ phần tử duy nhất ở đỉnh đến một phần tử bất kỳ ở đáy.

## 3. Key observations / Nhận xét quan trọng

- Bottom-up loại bỏ xử lý biên phức tạp của top-down.
- Mỗi state chỉ cần hai child ngay dưới.
- Sau khi xử lý một hàng, phần đầu mảng `dp` chính là best cost từ hàng đó xuống đáy.
- Giá trị âm không ảnh hưởng tính đúng của recurrence.

## 4. Alternative approaches / Các hướng khác

DFS thuần lặp nhiều subproblem. Memoization/2D DP đạt `O(n^2)` time và `O(n^2)` space. Bottom-up rolling array giữ `O(n^2)` time nhưng chỉ `O(n)` extra space, đúng follow-up.

## 5. Optimal approach / Hướng tối ưu

Copy hàng cuối vào `dp`. Với `i` từ `rows-2` về `0`, update `j=0..i`:

```text
dp[j] = triangle[i][j] + min(dp[j], dp[j+1])
```

Cuối cùng `dp[0]` là minimum path sum từ đỉnh.

## 6. Java solution overview

```java
import java.util.List;

class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[] dp = new int[n];
        for (int j = 0; j < n; j++) {
            dp[j] = triangle.get(n - 1).get(j);
        }
        for (int i = n - 2; i >= 0; i--) {
            for (int j = 0; j <= i; j++) {
                dp[j] = triangle.get(i).get(j) + Math.min(dp[j], dp[j + 1]);
            }
        }
        return dp[0];
    }
}
```

## 7. Code explanation / Giải thích code

Trước update hàng `i`, `dp[j]` và `dp[j+1]` là minimum sums bắt đầu từ hai child hợp lệ ở hàng `i+1`. Overwrite `dp[j]` không làm mất `dp[j+1]` vì scan từ trái sang phải và chỉ đọc vị trí bên phải chưa overwrite.

## 8. Dry run / Chạy thử

Với `[[2],[3,4],[6,5,7],[4,1,8,3]]`, bắt đầu `dp=[4,1,8,3]`. Sau hàng `[6,5,7]` thành `[7,6,10,3]`; sau `[3,4]` thành `[9,10,...]`; sau `[2]` thành `[11,...]`.

## 9. Time and space complexity

Có tổng `O(n^2)` phần tử:

```text
Time:  O(n^2)
Space: O(n)
```

## 10. Why the algorithm is correct / Vì sao đúng

Ở mỗi vị trí `(i,j)`, mọi đường hợp lệ phải đi tới đúng một trong hai child. Nếu `dp[j]` và `dp[j+1]` đã là minimum cost từ hai child xuống đáy, chọn minimum và cộng current value tạo minimum cost từ `(i,j)`. Base case hàng đáy chính là giá trị từng ô. Quy nạp ngược lên trên chứng minh `dp[0]` cuối cùng là đáp án.

## 11. Edge cases

- Chỉ một hàng.
- Giá trị âm.
- Mọi giá trị bằng nhau.
- Optimal path liên tục đổi giữa child trái/phải.

## 12. Common mistakes

- Scan sai hướng làm mất child state.
- Dùng `max` thay vì `min`.
- Không copy đầy đủ hàng cuối.
- Nhầm adjacency với cùng index ở mọi hàng.

## 13. Pattern recognition / Khi nào tái sử dụng

Bottom-up DP hiệu quả khi mỗi state phụ thuộc vào một số child ở level kế tiếp và level cuối có base case trực tiếp.

## 14. Vocabulary

- **triangle array**: mảng dạng tam giác
- **adjacent number**: số kề
- **bottom-up DP**: quy hoạch động từ dưới lên
- **child state**: trạng thái con
- **minimum path sum**: tổng đường đi nhỏ nhất
