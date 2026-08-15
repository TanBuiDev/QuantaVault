# 97. Interleaving String — Solution

## 1. Core idea / Intuition

Ta cần bảo toàn thứ tự tương đối của ký tự trong cả `s1` và `s2`. Vì vậy state tự nhiên là hai prefix đã dùng:

```text
dp[i][j] = có thể tạo s3[0..i+j) từ s1[0..i) và s2[0..j) hay không
```

Ký tự cuối của prefix `s3` phải đến từ một trong hai nguồn:

```text
s1[i-1] nếu dp[i-1][j] đúng
s2[j-1] nếu dp[i][j-1] đúng
```

## 2. Requirement recap / Tóm tắt yêu cầu

Ta có thể lấy ký tự từ `s1` hoặc `s2`, nhưng không được thay đổi thứ tự bên trong từng chuỗi. Mọi ký tự của cả hai chuỗi phải được dùng để tạo đúng `s3`.

## 3. Key observations / Nhận xét quan trọng

- Nếu tổng độ dài không bằng `s3.length()`, trả `false` ngay.
- State `(i,j)` luôn tương ứng đúng vị trí `i + j - 1` trong `s3`.
- Mỗi transition chỉ cần top và left, nên dùng 1D DP.

## 4. Alternative approaches / Các hướng khác

Backtracking chọn từ `s1` hoặc `s2` có thể phân nhánh exponential khi nhiều ký tự giống nhau. Memoization giảm xuống `O(mn)` nhưng 1D bottom-up DP đạt cùng time với ít memory hơn.

## 5. Optimal approach / Hướng tối ưu

Dùng `boolean[] dp = new boolean[n + 1]`.

Base row (`i = 0`) chỉ dùng `s2`:

```text
dp[j] = dp[j-1] && s2[j-1] == s3[j-1]
```

Mỗi hàng mới:

```text
dp[0] = dp[0] && s1[i-1] == s3[i-1]
```

Sau đó:

```text
dp[j] =
    (dp[j] && s1[i-1] == s3[i+j-1])
    ||
    (dp[j-1] && s2[j-1] == s3[i+j-1])
```

Trong expression này, `dp[j]` trước update là top state, còn `dp[j-1]` sau update là left state.

## 6. Java solution overview

```java
class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length();
        int n = s2.length();
        if (m + n != s3.length()) return false;

        boolean[] dp = new boolean[n + 1];
        dp[0] = true;

        for (int j = 1; j <= n; j++) {
            dp[j] = dp[j - 1] && s2.charAt(j - 1) == s3.charAt(j - 1);
        }

        for (int i = 1; i <= m; i++) {
            dp[0] = dp[0] && s1.charAt(i - 1) == s3.charAt(i - 1);
            for (int j = 1; j <= n; j++) {
                char target = s3.charAt(i + j - 1);
                dp[j] = (dp[j] && s1.charAt(i - 1) == target)
                    || (dp[j - 1] && s2.charAt(j - 1) == target);
            }
        }
        return dp[n];
    }
}
```

## 7. Code explanation / Giải thích code

`dp[j]` mang hai ý nghĩa theo thời điểm update: trước update là state của previous row, sau update là state của current row. Điều này chính xác vì transition chỉ cần top và left.

## 8. Dry run / Chạy thử

Với `s1="a"`, `s2="b"`, `s3="ab"`: base row không tạo được `"a"` từ `s2`, sau đó hàng `i=1` tạo `"a"` từ `s1`, và state `j=1` lấy `b` từ `s2`, nên kết quả `true`.

## 9. Time and space complexity

```text
Time:  O(m * n)
Space: O(n)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mọi interleaving hợp lệ cho prefix `(i,j)` phải có ký tự cuối đến từ `s1` hoặc `s2`. Hai nhánh recurrence kiểm tra chính xác hai khả năng đó cùng predecessor state hợp lệ. Ngược lại, nếu một nhánh đúng thì ta nối ký tự tương ứng vào một interleaving hợp lệ của prefix nhỏ hơn, tạo state hiện tại. Theo quy nạp, `dp[m][n]` đúng khi và chỉ khi `s3` là interleaving hợp lệ.

## 11. Edge cases

- Cả ba chuỗi rỗng.
- Một source string rỗng.
- Tổng độ dài sai.
- Nhiều ký tự lặp khiến cả hai nhánh cùng có thể chọn.
- Prefix khớp lâu rồi thất bại ở cuối.

## 12. Common mistakes

- Quên kiểm tra tổng độ dài.
- Dùng index `i+j` thay vì `i+j-1`.
- Update 1D DP sai thứ tự làm mất top/left semantics.
- Chỉ thử greedy chọn `s1` trước khi cả hai ký tự cùng khớp.

## 13. Pattern recognition / Khi nào tái sử dụng

Dùng grid/prefix DP khi hai sequence cùng đóng góp vào một target và state được xác định bởi số phần tử đã dùng từ mỗi nguồn.

## 14. Vocabulary

- **interleaving**: xen kẽ giữ nguyên thứ tự
- **concatenation**: phép nối chuỗi
- **prefix state**: trạng thái theo prefix
- **source string**: chuỗi nguồn
- **rolling DP**: DP nén theo hàng
