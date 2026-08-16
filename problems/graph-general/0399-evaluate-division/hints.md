# Hints / Gợi ý — 399. Evaluate Division

## Hint 1

**EN:** Treat every variable as a graph node. Equation `a / b = v` creates edge `a -> b` with weight `v`.

**VI:** Xem mỗi variable là một graph node. Equation `a / b = v` tạo edge `a -> b` có weight `v`.

## Hint 2

**EN:** The reverse edge has reciprocal weight `1 / v`.

**VI:** Reverse edge có weight nghịch đảo `1 / v`.

## Hint 3

**EN:** The product of edge weights along a path from `x` to `y` equals `x / y`.

**VI:** Tích các edge weight trên path từ `x` tới `y` chính là `x / y`.

## Key observation / Quan sát then chốt

A query becomes a reachability problem in a weighted graph, with multiplication used to accumulate the answer.
