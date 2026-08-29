# 188. Best Time to Buy and Sell Stock IV — Solution

## 1. Tại sao bài này cần nhiều state hơn bài Stock 121?

Ở bài 121, ta chỉ được làm một giao dịch nên chỉ cần nhớ giá mua thấp nhất và profit tốt nhất.

Ở đây ta được làm tối đa `k` giao dịch. Khi nhìn một ngày có giá `price`, câu hỏi không còn chỉ là “giá mua thấp nhất trước đây là gì?”, mà còn là:

> Nếu đang ở giao dịch thứ `t`, trạng thái tốt nhất của mình là đang giữ cổ phiếu hay đã bán xong?

Ví dụ `k = 2`, ta phải phân biệt:

```text
đang giữ cổ phiếu của transaction 1
đã bán xong tối đa transaction 1
đang giữ cổ phiếu của transaction 2
đã bán xong tối đa transaction 2
```

Nếu gộp các trạng thái này lại, ta không biết một lần mua mới có vượt quá giới hạn giao dịch hay không.

---

## 2. Định nghĩa state bằng câu đầy đủ trước khi viết công thức

Với `t = 1..k`:

```text
buy[t]
= lượng cash tốt nhất có thể có khi hiện đang giữ một cổ phiếu,
  sau khi đã bắt đầu transaction thứ t
```

```text
sell[t]
= profit/cash tốt nhất khi hiện không giữ cổ phiếu,
  sau khi đã hoàn thành tối đa t transactions
```

`buy` có thể âm vì mua cổ phiếu là bỏ tiền ra.

Ban đầu chưa mua gì:

```text
sell[0] = 0
```

Còn trạng thái “đã mua transaction t” là chưa thể đạt được, nên `buy[t]` được khởi tạo bằng một số âm rất nhỏ.

---

## 3. Tự suy ra transition của `buy[t]`

Ở ngày hôm nay, để kết thúc ngày trong trạng thái `buy[t]`, có hai lựa chọn.

### Lựa chọn A — không làm gì hôm nay

Ta vẫn giữ state cũ:

```text
buy[t]
```

### Lựa chọn B — mua hôm nay

Trước khi bắt đầu transaction thứ `t`, ta phải đang ở trạng thái không giữ cổ phiếu sau tối đa `t-1` giao dịch:

```text
sell[t - 1]
```

Mua ở giá `price` làm cash giảm:

```text
sell[t - 1] - price
```

Chọn tốt hơn:

```text
buy[t] = max(buy[t], sell[t - 1] - price)
```

Không cần học thuộc transition; nó chỉ là hai hành động hợp lệ dẫn tới state “đang giữ”.

---

## 4. Tự suy ra transition của `sell[t]`

Để kết thúc ngày không giữ cổ phiếu sau tối đa `t` giao dịch:

### Không bán hôm nay

Giữ:

```text
sell[t]
```

### Bán hôm nay

Ta phải xuất phát từ state đang giữ của transaction `t`:

```text
buy[t] + price
```

Do đó:

```text
sell[t] = max(sell[t], buy[t] + price)
```

Sau khi quét hết ngày, đáp án là:

```text
sell[k]
```

vì ta muốn cash tốt nhất khi cuối cùng không giữ cổ phiếu, với tối đa `k` giao dịch.

---

## 5. Update order có làm “mua và bán cùng ngày” sai không?

Trong loop một ngày, code update `buy[t]` rồi dùng ngay `buy[t]` để update `sell[t]`.

Điều đó có thể biểu diễn một buy rồi sell cùng giá trong cùng ngày:

```text
sell[t-1] - price + price = sell[t-1]
```

Profit thêm là `0`. Nó không thể tạo kết quả tốt hơn một sequence hợp lệ không thực hiện giao dịch vô ích đó.

Vì vậy in-place update theo thứ tự này vẫn bảo toàn optimum.

---

## 6. Java Notes

```java
int[] buy = new int[k + 1];
int[] sell = new int[k + 1];
```

Ta dùng index `1..k`; index `0` là base state trước khi bắt đầu giao dịch nào.

```java
Arrays.fill(buy, Integer.MIN_VALUE / 4);
```

đặt mọi `buy[t]` thành trạng thái rất xấu/chưa reachable.

Dùng `/ 4` thay vì đúng `Integer.MIN_VALUE` tạo khoảng an toàn khi sau đó cộng `price`, tránh arithmetic gần overflow mà vẫn đủ nhỏ để không thắng một state hợp lệ.

Enhanced for:

```java
for (int price : prices)
```

cho `price` là giá trị của ngày hiện tại.

---

## 7. Optimal Java solution

```java
import java.util.Arrays;

class Solution {
    public int maxProfit(int k, int[] prices) {
        // buy[t] = best cash while holding stock after starting transaction t;
        // sell[t] = best cash flat after completing at most t transactions.
        int[] buy = new int[k + 1];
        int[] sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE / 4);

        for (int price : prices) {
            for (int t = 1; t <= k; t++) {
                // To enter buy[t], either keep holding or spend today's price after
                // the best state with at most t-1 completed transactions.
                buy[t] = Math.max(buy[t], sell[t - 1] - price);

                // To enter sell[t], either stay flat or sell the stock held by buy[t].
                // Updating in this order may allow same-day buy/sell, which adds zero
                // and cannot improve beyond a valid sequence with fewer effective trades.
                sell[t] = Math.max(sell[t], buy[t] + price);
            }
        }

        return sell[k];
    }
}
```

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 8. Dry run nhỏ: `k=2`, `prices=[2,4,1]`

Chỉ theo dõi `t=1,2`.

Ban đầu:

```text
sell = [0, 0, 0]
buy  = [-∞, -∞, -∞]
```

### price = 2

`t=1`:

```text
buy[1]  = max(-∞, sell[0]-2) = -2
sell[1] = max(0, -2+2)       = 0
```

`t=2`:

```text
buy[2]  = max(-∞, sell[1]-2) = -2
sell[2] = max(0, -2+2)       = 0
```

### price = 4

`t=1`:

```text
buy[1]  = max(-2, 0-4) = -2
sell[1] = max(0, -2+4) = 2
```

`t=2`:

```text
buy[2]  = max(-2, 2-4) = -2
sell[2] = max(0, -2+4) = 2
```

### price = 1

`t=1`:

```text
buy[1]  = max(-2, 0-1) = -1
sell[1] = max(2, -1+1) = 2
```

`t=2`:

```text
buy[2]  = max(-2, 2-1) = 1
sell[2] = max(2, 1+1)  = 2
```

Kết quả:

```text
sell[2] = 2
```

Giao dịch tốt nhất là mua `2`, bán `4`.

State `buy[2] = 1` cuối cùng có ý nghĩa: sau khi đã kiếm `2` từ giao dịch đầu, nếu mua lại ở giá `1`, ta vẫn còn net cash `1`. Nhưng input kết thúc nên chưa có cơ hội bán lần hai để tăng đáp án.

---

## 9. Vì sao DP này đúng?

Mỗi state mô tả đầy đủ hai thông tin ảnh hưởng tới quyết định tương lai:

1. đã dùng tối đa bao nhiêu transaction;
2. hiện đang giữ hay không giữ cổ phiếu.

Ở mỗi ngày, transition liệt kê **tất cả hành động hợp lệ** để kết thúc ngày trong mỗi state:

- `buy[t]`: giữ tiếp hoặc mua hôm nay từ `sell[t-1]`;
- `sell[t]`: đứng yên hoặc bán hôm nay từ `buy[t]`.

Không có cách hợp lệ nào khác để vào hai state đó. Lấy `max` giữ phương án tốt nhất cho mỗi state, nên theo induction sau mỗi ngày các mảng vẫn chứa optimum của mọi sequence đã xét.

Cuối cùng một lời giải hoàn chỉnh không giữ cổ phiếu, nên `sell[k]` là profit tối đa với không quá `k` transactions.

---

## 10. Complexity

```text
Time:  O(n * k)
Space: O(k)
```

Mỗi ngày update `k` cặp state.

---

## 11. Lỗi thường gặp

- Không định nghĩa rõ transaction được tính ở lúc mua hay lúc bán, làm transition dùng nhầm `t`/`t-1`.
- Viết `buy[t]` từ `sell[t] - price`; như vậy có thể bắt đầu transaction mới mà không tiêu một slot transaction đúng nghĩa.
- Trả `buy[k]`; cuối bài ta muốn profit khi **không giữ** cổ phiếu.
- Khởi tạo `buy` bằng `0`, khiến state “đang giữ cổ phiếu miễn phí” tồn tại từ đầu.
- Tạo DP 3 chiều day × transactions × holding dù mỗi ngày chỉ cần state của prefix đã xử lý; rolling arrays `buy/sell` nén space về `O(k)`.
- Học công thức mà không gắn với action. Nếu quên transition, hãy quay lại câu hỏi “để kết thúc hôm nay trong state này, mình có thể vừa làm gì?”

---

## 12. Cách nhận ra DP state-machine kiểu này

Khi bài có:

- nhiều bước theo thời gian;
- giới hạn số lần thực hiện một loại operation;
- một vài “mode” mutually exclusive như holding/not-holding;
- quyết định hôm nay chỉ phụ thuộc best result của các mode trước đó;

hãy thử định nghĩa state bằng câu:

> “Sau khi xử lý prefix đến đây, với `t` resources đã dùng và đang ở mode X, giá trị tốt nhất là gì?”

Chỉ sau khi câu đó rõ mới viết transition. Đây là cách tránh DP trở thành bảng công thức cần học thuộc.
