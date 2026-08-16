# Hints / Gợi ý — 2. Add Two Numbers

## Hint 1

**EN:** The digits are already stored from least significant to most significant. That is exactly the order used by manual addition from right to left.

**VI:** Các chữ số đã được lưu từ hàng thấp nhất tới hàng cao nhất, đúng thứ tự ta cần khi cộng từng chữ số với carry.

## Hint 2

**EN:** At each pair of nodes, add both digit values plus the carry from the previous position. The result digit is `sum % 10`, and the next carry is `sum / 10`.

**VI:** Ở mỗi vị trí, cộng digit của hai list với `carry`. Digit kết quả là `sum % 10`, carry mới là `sum / 10`.

## Hint 3

**EN:** The lists can have different lengths, and a final carry may remain after both lists end. Continue while either list still has a node or `carry != 0`.

**VI:** Hai list có thể dài khác nhau và sau khi cả hai kết thúc vẫn có thể còn carry. Vì vậy tiếp tục khi `l1 != null || l2 != null || carry != 0`.

## Key observation / Quan sát then chốt

Dùng dummy head giúp append node kết quả đồng nhất cho mọi iteration và tránh phải xử lý riêng node đầu tiên.
