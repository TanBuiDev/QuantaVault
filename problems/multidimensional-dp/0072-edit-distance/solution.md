# 72. Edit Distance — Solution

## 1. Core idea / Intuition

Edit Distance là bài **prefix dynamic programming** kinh điển. Ta định nghĩa:

```text
dp[i][j] = số thao tác ít nhất để biến word1[0..i) thành word2[0..j)
```

Nếu ký tự cuối của hai prefix giống nhau, ta không cần thao tác mới:

```text
dp[i][j] = dp[i-1][j-1]
```

Nếu khác nhau, thao tác cuối cùng phải là một trong ba loại:

```text
insert  -> dp[i][j-1]
delete  -> dp[i-1][j]
replace -> dp[i-1][j-1]
```

nên:

```text
dp[i][j] = 1 + min(insert, delete, replace)
```

## 2. Requirement recap / Tóm tắt yêu cầu

Mỗi insert, delete, replace có cost `1`. Ta cần tổng cost nhỏ nhất để biến toàn bộ `word1` thành `word2`.

## 3. Key observations / Nhận xét quan trọng

- Prefix rỗng tạo base case tự nhiên.
- Biến chuỗi dài `i` thành chuỗi rỗng cần `i` lần delete.
- Biến chuỗi rỗng thành chuỗi dài `j` cần `j` lần insert.
- Mỗi state chỉ phụ thuộc `top`, `left`, `diagonal`, nên bảng 2D có thể nén còn một hàng.

## 4. Alternative approaches / Các hướng khác

Recursive brute force thử cả ba thao tác ở nhiều vị trí và lặp lại cùng subproblem, dẫn tới exponential time. Memoization giảm xuống `O(mn)` nhưng vẫn thường dùng `O(mn)` memory. Bottom-up DP dễ nén space hơn.

## 5. Optimal approach / Hướng tối ưu

Dùng `dp[j]` cho hàng hiện tại/previous row theo kiểu rolling array.

Khởi tạo:

```text
dp[j] = j
```

Với mỗi hàng `i`:

1. `diagonal = dp[0]` cũ.
2. `dp[0] = i`.
3. Trước khi overwrite `dp[j]`, lưu `top = dp[j]`.
4. Nếu ký tự giống nhau: `dp[j] = diagonal`.
5. Nếu khác: `1 + min(top, dp[j-1], diagonal)`.
6. `diagonal = top` cho cột kế tiếp.

## 6. Java solution overview

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[] dp = new int[n + 1];

        for (int j = 0; j <= n; j++) dp[j] = j;

        for (int i = 1; i <= m; i++) {
            int diagonal = dp[0];
            dp[0] = i;

            for (int j = 1; j <= n; j++) {
                int top = dp[j];
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[j] = diagonal;
                } else {
                    dp[j] = 1 + Math.min(Math.min(top, dp[j - 1]), diagonal);
                }
                diagonal = top;
            }
        }
        return dp[n];
    }
}
```

## 7. Code explanation / Giải thích code

Trong rolling row, `top` là delete candidate, `dp[j-1]` sau update là insert candidate, còn `diagonal` là replace/match candidate. Việc lưu `top` trước overwrite rất quan trọng để diagonal cho cột sau không bị mất.

## 8. Dry run / Chạy thử

Với `word1 = "a"`, `word2 = "b"`:

```text
base row: [0,1]
row i=1 starts [1,1]
chars differ => 1 + min(1,1,0) = 1
```

Kết quả là một lần replace.

## 9. Time and space complexity

```text
Time:  O(m * n)
Space: O(n)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mọi optimal edit sequence cho hai prefix hoặc không cần thao tác mới nếu ký tự cuối bằng nhau, hoặc có thao tác cuối cùng là insert, delete, hay replace. Ba predecessor states tương ứng chính xác với ba trường hợp đó. Lấy minimum cộng cost `1` xét đầy đủ mọi khả năng hợp lệ. Base cases đúng cho prefix rỗng, nên theo quy nạp trên `i,j`, mọi state đều tối ưu.

## 11. Edge cases

- Hai chuỗi rỗng.
- Một chuỗi rỗng.
- Hai chuỗi giống nhau.
- Một ký tự khác nhau.
- Nhiều ký tự lặp lại.

## 12. Common mistakes

- Quên base row/column.
- Nhầm insert với delete predecessor.
- Quên giữ `diagonal` cũ khi nén DP.
- Cộng `1` ngay cả khi hai ký tự bằng nhau.

## 13. Pattern recognition / Khi nào tái sử dụng

Prefix DP phù hợp khi so sánh hoặc biến đổi hai sequence và thao tác cuối quyết định predecessor state: edit distance, sequence alignment, một số bài matching.

## 14. Vocabulary

- **edit distance**: khoảng cách chỉnh sửa
- **insert / delete / replace**: chèn / xóa / thay thế
- **prefix**: tiền tố
- **recurrence**: công thức chuyển trạng thái
- **rolling row**: nén DP theo hàng
- **diagonal state**: trạng thái chéo
