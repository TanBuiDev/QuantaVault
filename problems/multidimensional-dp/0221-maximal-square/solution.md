# 221. Maximal Square — Solution

## 1. Core idea / Intuition

Bài toán hỏi **diện tích** hình vuông toàn `1` lớn nhất. Điểm khó là một ô `1` riêng lẻ chưa đủ để biết ta có thể mở rộng thành hình vuông lớn đến đâu.

Ta định nghĩa trạng thái theo góc dưới-phải:

```text
dp[i][j] = độ dài cạnh lớn nhất của hình vuông toàn 1
           có góc dưới-phải tại matrix[i - 1][j - 1]
```

Nếu ô hiện tại là `0`, không có hình vuông toàn `1` nào kết thúc tại đó:

```text
dp[i][j] = 0
```

Nếu ô hiện tại là `1`, muốn tạo hình vuông cạnh lớn hơn 1 thì ba vùng ngay phía trên, bên trái và chéo trên-trái đều phải hỗ trợ. Vì cạnh mới bị giới hạn bởi vùng nhỏ nhất trong ba vùng đó:

```text
dp[i][j] = 1 + min(dp[i - 1][j],
                   dp[i][j - 1],
                   dp[i - 1][j - 1])
```

Theo dõi `maxSide` trong lúc duyệt, cuối cùng trả về:

```text
maxSide * maxSide
```

## 2. Requirement recap / Tóm tắt yêu cầu

Input là ma trận ký tự `'0'` và `'1'`.

Ta cần tìm hình vuông:

- các cạnh song song với hàng/cột của ma trận;
- mọi ô bên trong đều là `'1'`;
- có diện tích lớn nhất.

Đề bài yêu cầu trả về **area**, không phải side length.

## 3. Key observations / Nhận xét quan trọng

### Observation 1 — Trạng thái nên gắn với một góc cố định

Nếu chỉ ghi nhận "largest square seen so far" thì ta không biết trạng thái nào có thể nối với ô tiếp theo. Chọn **bottom-right corner** làm điểm neo giúp trạng thái có quan hệ cục bộ với ba hàng xóm.

### Observation 2 — Ba hàng xóm đều cần thiết

Giả sử ô hiện tại là `1`.

- `top` cho biết phía trên hỗ trợ được cạnh bao nhiêu;
- `left` cho biết phía trái hỗ trợ được cạnh bao nhiêu;
- `diagonal` cho biết phần lõi trên-trái hỗ trợ được cạnh bao nhiêu.

Chỉ cần một trong ba nhỏ hơn, hình vuông mới cũng bị giới hạn theo giá trị nhỏ nhất đó.

### Observation 3 — Ô `0` reset trạng thái

Một hình vuông toàn `1` không thể có góc dưới-phải tại ô `0`, nên trạng thái phải trở về `0` ngay lập tức.

### Observation 4 — Không cần lưu toàn bộ bảng DP

Mỗi trạng thái chỉ dùng:

```text
top       = previous row, same column
left      = current row, previous column
diagonal  = previous row, previous column
```

Do đó có thể nén từ `O(mn)` xuống `O(n)` bộ nhớ.

## 4. Alternative approaches / Các hướng khác

### Approach A — Brute force từ mỗi ô

Có thể xem mỗi ô `1` là góc trên-trái, thử tăng dần kích thước hình vuông rồi kiểm tra toàn bộ vùng.

Cách này lặp lại rất nhiều phép kiểm tra và có thể tốn thời gian bậc cao hơn đáng kể so với `O(mn)`.

### Approach B — Prefix sum 2D

Ta có thể xây prefix sum để kiểm tra một hình vuông có toàn `1` hay không trong `O(1)`, sau đó thử nhiều kích thước/candidate squares.

Cách này khả thi nhưng phức tạp hơn cần thiết và vẫn phải quản lý không gian tìm kiếm các hình vuông.

### Approach C — 2D DP

Dùng bảng `dp[m + 1][n + 1]` giúp recurrence rất trực quan:

```text
if matrix[i - 1][j - 1] == '1':
    dp[i][j] = 1 + min(top, left, diagonal)
```

Độ phức tạp:

```text
Time:  O(mn)
Space: O(mn)
```

### Approach D — Rolling 1D DP

Giữ một mảng `dp[n + 1]` và một biến `diagonal`.

Đây là implementation canonical của repository:

```text
Time:  O(mn)
Space: O(n)
```

## 5. Optimal approach / Hướng tối ưu

Dùng `dp[j]` để đại diện cho trạng thái tại cột `j`.

Trước khi overwrite:

```text
dp[j] = top
```

Sau khi xử lý cột trước trong cùng hàng:

```text
dp[j - 1] = left
```

Ta giữ biến:

```text
diagonal = old dp[j - 1] from previous row
```

Ở mỗi ô:

1. Lưu `top = dp[j]` trước khi overwrite.
2. Nếu matrix là `'1'`, cập nhật:

```text
dp[j] = 1 + min(dp[j], dp[j - 1], diagonal)
```

3. Nếu matrix là `'0'`, đặt `dp[j] = 0`.
4. Cập nhật `maxSide`.
5. Đặt `diagonal = top` để dùng cho cột tiếp theo.

Việc thêm cột sentinel `dp[0] = 0` loại bỏ các nhánh xử lý riêng cho biên trái.

## 6. Java solution overview

```java
class Solution {
    public int maximalSquare(char[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int[] dp = new int[cols + 1];
        int maxSide = 0;

        for (int i = 1; i <= rows; i++) {
            int diagonal = 0;
            for (int j = 1; j <= cols; j++) {
                int top = dp[j];

                if (matrix[i - 1][j - 1] == '1') {
                    dp[j] = Math.min(Math.min(dp[j], dp[j - 1]), diagonal) + 1;
                    maxSide = Math.max(maxSide, dp[j]);
                } else {
                    dp[j] = 0;
                }

                diagonal = top;
            }
        }

        return maxSide * maxSide;
    }
}
```

Code này phải giữ cùng thuật toán với [`Solution.java`](Solution.java).

## 7. Code explanation / Giải thích code

### `int[] dp = new int[cols + 1]`

Phần tử `dp[0]` luôn bằng `0`, đóng vai trò sentinel cho biên trái.

Trong lúc xử lý một hàng:

- `dp[j]` trước update = `top`;
- `dp[j - 1]` sau update = `left`;
- `diagonal` = giá trị cũ của `dp[j - 1]` từ hàng trước.

### `int top = dp[j]`

Phải lưu giá trị cũ trước khi overwrite. Sau khi cập nhật `dp[j]`, ta cần `top` trở thành `diagonal` cho cột kế tiếp.

### `Math.min(...) + 1`

Ba hình vuông hàng xóm phải cùng hỗ trợ phần cạnh chung. Hàng xóm nhỏ nhất là bottleneck.

### `maxSide * maxSide`

`dp` lưu side length. Đề bài yêu cầu area, nên cần bình phương cạnh lớn nhất.

## 8. Dry run / Chạy thử

Với phần ma trận:

```text
1 1
1 1
```

Hàng đầu:

```text
dp -> [0, 1, 1]
maxSide = 1
```

Sang hàng thứ hai:

- ô `(2,1)` có `top=1`, `left=0`, `diagonal=0` => `dp[1]=1`;
- ô `(2,2)` có `top=1`, `left=1`, `diagonal=1` => `dp[2]=2`.

Kết quả:

```text
maxSide = 2
area = 4
```

## 9. Time and space complexity / Độ phức tạp

Mỗi ô được xử lý đúng một lần:

```text
Time: O(m * n)
```

Mảng DP có `n + 1` phần tử:

```text
Space: O(n)
```

Không tính input.

## 10. Why the algorithm is correct / Vì sao thuật toán đúng

Xét một ô `matrix[i - 1][j - 1]`.

Nếu nó là `0`, mọi hình vuông kết thúc tại ô này đều chứa `0`, nên side length lớn nhất bằng `0`.

Nếu nó là `1`, một hình vuông cạnh `k > 1` kết thúc tại ô này tồn tại khi và chỉ khi ba vùng tương ứng ở trên, trái và chéo trên-trái đều chứa được hình vuông cạnh ít nhất `k - 1`. Vì vậy cạnh lớn nhất có thể đạt chính xác là:

```text
1 + min(top, left, diagonal)
```

Theo quy nạp theo thứ tự duyệt hàng-cột, mỗi `dp[j]` sau update bằng side length lớn nhất của hình vuông toàn `1` kết thúc tại ô hiện tại. Lấy maximum trên mọi trạng thái thu được side length lớn nhất trong toàn ma trận; bình phương nó cho area cần trả về.

## 11. Edge cases / Trường hợp biên

- Ma trận chỉ có một ô `0` → `0`.
- Ma trận chỉ có một ô `1` → `1`.
- Toàn bộ ma trận là `0`.
- Toàn bộ ma trận là `1`.
- Ma trận hình chữ nhật rất dài hoặc rất cao.
- Có nhiều square cùng kích thước tối đa.
- Các `1` tạo thành rectangle nhưng không đủ để tạo square lớn hơn.

## 12. Common mistakes / Lỗi thường gặp

- Trả về `maxSide` thay vì `maxSide * maxSide`.
- Dùng `max(top, left, diagonal)` thay vì `min`.
- Quên reset `dp[j] = 0` khi current cell là `0`.
- Overwrite `dp[j]` trước khi lưu giá trị `top`, làm mất diagonal cho bước tiếp theo.
- Nhầm `dp[j - 1]` là previous-row left; trong rolling DP nó đã là current-row left.

## 13. Pattern recognition / Khi nào tái sử dụng ý tưởng

Mẫu này hữu ích khi:

- bài toán hỏi hình chữ nhật/hình vuông lớn nhất trong grid;
- trạng thái tại một cell phụ thuộc vào các neighbor đã xử lý;
- có thể định nghĩa cấu trúc lớn nhất **ending at current cell**;
- bảng DP 2D có thể nén vì chỉ cần previous row.

Từ khóa nhận diện:

```text
binary matrix
largest square
ending at cell
three-neighbor recurrence
rolling DP
```

## 14. Vocabulary and algorithmic terminology / Từ vựng

- **binary matrix**: ma trận nhị phân
- **bottom-right corner**: góc dưới-phải
- **side length**: độ dài cạnh
- **area**: diện tích
- **dynamic programming (DP)**: quy hoạch động
- **recurrence**: công thức chuyển trạng thái
- **rolling array / rolling DP**: nén DP theo hàng
- **diagonal**: ô chéo
- **sentinel**: giá trị/ô đệm để đơn giản hóa xử lý biên
- **bottleneck**: thành phần giới hạn kết quả chung
- **time complexity**: độ phức tạp thời gian
- **space complexity**: độ phức tạp bộ nhớ
