# 123. Best Time to Buy and Sell Stock III — Hints / Gợi ý

## Hint 1

**EN:** Since there are at most two transactions, can you represent the process using four best-so-far states?

**VI:** Vì chỉ có tối đa hai giao dịch, hãy thử biểu diễn quá trình bằng bốn state tốt nhất.

## Hint 2

```text
buy1  -> sell1 -> buy2 -> sell2
```

Mỗi state là best balance sau khi thực hiện hành động tương ứng.

## Hint 3

```text
buy1  = max(buy1, -price)
sell1 = max(sell1, buy1 + price)
buy2  = max(buy2, sell1 - price)
sell2 = max(sell2, buy2 + price)
```

Chỉ cần duyệt giá một lần.
