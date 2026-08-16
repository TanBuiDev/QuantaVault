# 188. Best Time to Buy and Sell Stock IV — Hints / Gợi ý

## Hint 1

**EN:** Think of each completed transaction count as a DP layer. For each layer, distinguish between holding and not holding a stock.

**VI:** Xem số giao dịch đã hoàn thành như một lớp DP; trong mỗi lớp tách trạng thái đang giữ và không giữ cổ phiếu.

## Hint 2

**EN:** For transaction number `t`, maintain the best balance after buying (`buy[t]`) and after selling (`sell[t]`).

**VI:** Với giao dịch thứ `t`, duy trì số dư tốt nhất sau khi mua (`buy[t]`) và sau khi bán (`sell[t]`).

## Hint 3

```text
buy[t]  = max(buy[t], sell[t - 1] - price)
sell[t] = max(sell[t], buy[t] + price)
```

Mỗi ngày chỉ cần cập nhật các state này, không cần bảng DP theo toàn bộ số ngày.
