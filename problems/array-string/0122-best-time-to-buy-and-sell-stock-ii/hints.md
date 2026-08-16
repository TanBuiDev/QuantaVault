# 122. Best Time to Buy and Sell Stock II — Hints / Gợi ý

## Hint 1

Khác bài 121, lần này bạn được phép thực hiện **nhiều giao dịch** miễn là không giữ hơn một cổ phiếu cùng lúc.

## Hint 2

Nếu giá tăng từ hôm qua sang hôm nay, phần tăng đó có thể đóng góp vào lợi nhuận tối đa hay không?

```text
prices[i] > prices[i - 1]
```

## Hint 3

Một đoạn tăng liên tục:

```text
1 -> 2 -> 3 -> 4 -> 5
```

có tổng các bước tăng:

```text
(2-1) + (3-2) + (4-3) + (5-4) = 5-1
```

Nó bằng đúng lợi nhuận mua ở đáy và bán ở đỉnh.

## Hint 4

Vì vậy hãy cộng mọi chênh lệch dương giữa hai ngày liên tiếp:

```text
if prices[i] > prices[i - 1]
    profit += prices[i] - prices[i - 1]
```
