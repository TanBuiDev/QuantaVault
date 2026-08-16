# 188. Best Time to Buy and Sell Stock IV — Solution

## 1. Core idea / Intuition

Bài toán giới hạn nhiều nhất `k` giao dịch. Ta mô hình hóa mỗi giao dịch bằng hai trạng thái:

```text
buy[t]  = số dư tốt nhất sau khi đã mua cổ phiếu cho giao dịch thứ t
sell[t] = lợi nhuận tốt nhất sau khi đã bán xong giao dịch thứ t
```

Khi giá hôm nay là `price`:

```text
buy[t]  = max(buy[t], sell[t - 1] - price)
sell[t] = max(sell[t], buy[t] + price)
```

`buy[t]` hoặc giữ trạng thái cũ, hoặc bắt đầu giao dịch thứ `t` sau khi đã hoàn thành `t - 1` giao dịch. `sell[t]` hoặc giữ lợi nhuận cũ, hoặc bán cổ phiếu đang giữ của giao dịch thứ `t`.

## 2. Requirement recap / Tóm tắt yêu cầu

Ta chỉ được giữ tối đa một cổ phiếu tại một thời điểm và hoàn thành nhiều nhất `k` cặp mua-bán. Mục tiêu là tối đa hóa lợi nhuận cuối cùng.

## 3. Key observations / Nhận xét quan trọng

- Không cần lưu ngày mua/bán cụ thể; chỉ cần best balance cho từng trạng thái.
- `sell[0] = 0` vì chưa có giao dịch nào.
- Các `buy[t]` ban đầu phải là một số âm rất nhỏ để biểu diễn trạng thái chưa hợp lệ.
- Sau khi duyệt hết giá, đáp án là `sell[k]`; việc dùng ít hơn `k` giao dịch vẫn được bao hàm vì mỗi `sell[t]` không bao giờ giảm.

## 4. Alternative approaches / Các hướng khác

### Brute force

Thử mọi cách chọn tối đa `k` cặp ngày mua-bán tạo số tổ hợp rất lớn và không phù hợp.

### Full DP by day and transaction

Có thể dùng bảng theo ngày và số giao dịch với `O(nk)` time và `O(nk)` space.

### State compression

Vì ngày hiện tại chỉ phụ thuộc best state trước đó, ta nén còn hai mảng `buy` và `sell` kích thước `k + 1`.

## 5. Optimal approach / Hướng tối ưu

Khởi tạo:

```java
int[] buy = new int[k + 1];
int[] sell = new int[k + 1];
Arrays.fill(buy, Integer.MIN_VALUE / 4);
```

Với mỗi `price`, cập nhật `t = 1..k`:

```java
buy[t] = Math.max(buy[t], sell[t - 1] - price);
sell[t] = Math.max(sell[t], buy[t] + price);
```

Việc sell rồi buy lại trong cùng một ngày không tạo thêm lợi nhuận vì dùng cùng một mức giá, nên cập nhật in-place theo thứ tự này vẫn giữ kết quả tối ưu.

## 6. Java solution overview

```java
import java.util.Arrays;

class Solution {
    public int maxProfit(int k, int[] prices) {
        int[] buy = new int[k + 1];
        int[] sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE / 4);

        for (int price : prices) {
            for (int t = 1; t <= k; t++) {
                buy[t] = Math.max(buy[t], sell[t - 1] - price);
                sell[t] = Math.max(sell[t], buy[t] + price);
            }
        }
        return sell[k];
    }
}
```

## 7. Code explanation / Giải thích code

`buy[t]` là best cash sau khi mua lần thứ `t`, còn `sell[t]` là best cash sau khi bán lần thứ `t`. Chuyển trạng thái luôn bảo đảm phải bán giao dịch cũ trước khi bắt đầu giao dịch mới thông qua `sell[t - 1]`.

## 8. Dry run / Chạy thử

Với `k = 2`, `prices = [3,2,6,5,0,3]`, state tốt nhất dần ghi nhận giao dịch `2 -> 6` lời `4`, sau đó `0 -> 3` lời `3`. `sell[2]` cuối cùng bằng `7`.

## 9. Time and space complexity

```text
Time:  O(n * k)
Space: O(k)
```

## 10. Why the algorithm is correct / Vì sao đúng

Tại mỗi ngày và mỗi `t`, recurrence xét đầy đủ hai lựa chọn tối ưu: không thực hiện hành động mới hoặc thực hiện đúng hành động hợp lệ tiếp theo (mua từ `sell[t-1]`, bán từ `buy[t]`). Do đó sau khi xử lý prefix các ngày, mỗi state lưu giá trị tốt nhất cho đúng định nghĩa của nó. Theo quy nạp, sau ngày cuối `sell[k]` là lợi nhuận tối đa với không quá `k` giao dịch.

## 11. Edge cases

- Chỉ một ngày: không thể có lợi nhuận.
- Giá giảm liên tục: kết quả `0`.
- `k` lớn hơn số giao dịch thực tế cần thiết.
- Giá bằng `0`.
- Nhiều giao dịch cho cùng tổng lợi nhuận.

## 12. Common mistakes

- Cho phép mua giao dịch mới trước khi bán giao dịch cũ.
- Khởi tạo `buy` bằng `0`, khiến trạng thái giữ cổ phiếu trở nên giả tạo.
- Trả về state đang giữ cổ phiếu.
- Nhầm số lần mua/bán với số giao dịch hoàn thành.

## 13. Pattern recognition / Khi nào tái sử dụng

Dùng transaction-state DP khi có chuỗi thời gian, giới hạn số thao tác mua-bán và mỗi state chỉ cần best-so-far thay vì lịch sử đầy đủ.

## 14. Vocabulary

- **transaction**: giao dịch mua-bán hoàn chỉnh
- **holding state**: trạng thái đang giữ cổ phiếu
- **state compression**: nén trạng thái
- **best balance**: số dư tốt nhất
- **time complexity**: độ phức tạp thời gian
- **space complexity**: độ phức tạp bộ nhớ
