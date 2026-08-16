# 123. Best Time to Buy and Sell Stock III — Solution

## 1. Core idea / Intuition

Vì chỉ được hoàn thành tối đa hai giao dịch, toàn bộ DP có thể nén thành bốn state theo đúng thứ tự hành động:

```text
buy1 -> sell1 -> buy2 -> sell2
```

Ý nghĩa:

```text
buy1  = best balance after first buy
sell1 = best profit after first sell
buy2  = best balance after second buy
sell2 = best profit after second sell
```

Với mỗi `price`:

```text
buy1  = max(buy1, -price)
sell1 = max(sell1, buy1 + price)
buy2  = max(buy2, sell1 - price)
sell2 = max(sell2, buy2 + price)
```

## 2. Requirement recap / Tóm tắt yêu cầu

Ta được thực hiện không quá hai cặp mua-bán và không được giữ nhiều vị thế cùng lúc. Đáp án có thể dùng 0, 1 hoặc 2 giao dịch.

## 3. Key observations / Nhận xét quan trọng

- Hai giao dịch tạo đúng bốn giai đoạn hữu ích.
- Mỗi state chỉ cần best value từ prefix đã xử lý.
- `sell1` và `sell2` bắt đầu từ `0`, vì không giao dịch là hợp lệ.
- `buy1` và `buy2` bắt đầu rất âm để tránh trạng thái giữ cổ phiếu giả.

## 4. Alternative approaches / Các hướng khác

Có thể dùng DP theo ngày và số giao dịch với `O(n)` hoặc `O(n * 2)` space, hoặc tách prefix/suffix profit. Tuy nhiên bốn state trực tiếp đạt cùng `O(n)` time với `O(1)` space và code ngắn hơn.

## 5. Optimal approach / Hướng tối ưu

Duyệt từng giá và update bốn state theo thứ tự logic. Mỗi update so sánh giữa giữ nguyên best-so-far và thực hiện hành động mới ở giá hiện tại.

## 6. Java solution overview

```java
class Solution {
    public int maxProfit(int[] prices) {
        int buy1 = Integer.MIN_VALUE / 4;
        int sell1 = 0;
        int buy2 = Integer.MIN_VALUE / 4;
        int sell2 = 0;

        for (int price : prices) {
            buy1 = Math.max(buy1, -price);
            sell1 = Math.max(sell1, buy1 + price);
            buy2 = Math.max(buy2, sell1 - price);
            sell2 = Math.max(sell2, buy2 + price);
        }
        return sell2;
    }
}
```

## 7. Code explanation / Giải thích code

`buy2` chỉ được tạo từ `sell1`, nên giao dịch thứ nhất đã bán xong trước khi giao dịch thứ hai bắt đầu. `sell2` giữ lợi nhuận tốt nhất sau tối đa hai giao dịch.

## 8. Dry run / Chạy thử

Với `[3,3,5,0,0,3,1,4]`, các state cuối cùng tìm ra hai đoạn lợi nhuận tốt: `0 -> 3` và `1 -> 4`, cho `sell2 = 6`.

## 9. Time and space complexity

```text
Time:  O(n)
Space: O(1)
```

## 10. Why the algorithm is correct / Vì sao đúng

Mỗi state đại diện cho best balance sau một prefix hành động hợp lệ. Ở mỗi ngày recurrence xét đủ hai lựa chọn: giữ state cũ hoặc thực hiện hành động tiếp theo tại giá hiện tại. Vì chuỗi phụ thuộc là `buy1 -> sell1 -> buy2 -> sell2`, không state nào vi phạm thứ tự mua-bán. Theo quy nạp trên các ngày, `sell2` cuối cùng là lợi nhuận tối đa với không quá hai giao dịch.

## 11. Edge cases

- Một ngày duy nhất.
- Giá giảm liên tục.
- Chỉ một giao dịch là tối ưu.
- Hai giao dịch tách rời rõ ràng.
- Giá lặp lại hoặc bằng `0`.

## 12. Common mistakes

- Cho `buy2` phụ thuộc trực tiếp vào `0` thay vì `sell1`.
- Trả về `buy2` hoặc `sell1` thay vì best final state.
- Khởi tạo buy states bằng `0`.
- Cộng hai lợi nhuận độc lập có interval chồng lấn.

## 13. Pattern recognition / Khi nào tái sử dụng

Khi số giao dịch là hằng số nhỏ, transaction DP thường nén thành một số state cố định thay vì bảng theo `k`.

## 14. Vocabulary

- **first transaction / second transaction**: giao dịch thứ nhất / thứ hai
- **holding state**: trạng thái đang giữ
- **best-so-far**: tốt nhất đến hiện tại
- **state compression**: nén trạng thái
- **constant extra space**: bộ nhớ phụ hằng số
