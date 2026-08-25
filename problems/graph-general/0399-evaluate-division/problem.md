# 399. Evaluate Division

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given `equations` such as `a / b = value` and `queries` such as `x / y`. Return the result of every query, or `-1.0` when it cannot be determined from the given `equations`.
>
> **VI:** Bạn được cho các equation dạng `a / b = value` và các query dạng `x / y`. Hãy trả về kết quả của từng query, hoặc `-1.0` nếu không thể suy ra từ dữ liệu đã cho.

> **EN:** The input is guaranteed to be valid and contains no contradictory `equations`.
>
> **VI:** Input được đảm bảo hợp lệ và không có equation mâu thuẫn.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input:
equations = [["a","b"],["b","c"]]
values = [2.0,3.0]
queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]
Output: [6.0,0.5,-1.0,1.0,-1.0]
```

### Example 2 / Ví dụ 2

```text
Input:
equations = [["a","b"],["b","c"],["bc","cd"]]
values = [1.5,2.5,5.0]
queries = [["a","c"],["c","b"],["bc","cd"],["cd","bc"]]
Output: [3.75,0.4,5.0,0.2]
```

## Constraints / Ràng buộc

> **EN:** Equation and query variables are strings; `values` are positive doubles. A variable that never appears in any equation is unknown.
>
> **VI:** Variable của equation/query là string; value là số thực dương. Variable chưa từng xuất hiện trong equation được xem là unknown.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/evaluate-division/

English wording preserved from `raw/top-interview-150/Graph General.txt` (blob `17bdb083b5c628079da7c7553fefe2e356774020`).
