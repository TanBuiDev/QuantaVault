# 134. Gas Station

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].
>
> **VI:** Có `n` trạm xăng nằm trên một tuyến đường tròn; lượng xăng tại trạm thứ `i` là `gas[i]`.

> **EN:** You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.
>
> **VI:** Xe có bình xăng không giới hạn và cần `cost[i]` đơn vị xăng để đi từ trạm `i` tới trạm kế tiếp. Bạn bắt đầu với bình rỗng tại một trạm nào đó.

> **EN:** Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.
>
> **VI:** Cho hai mảng `gas` và `cost`, hãy trả về index trạm xuất phát nếu có thể đi hết một vòng theo chiều kim đồng hồ; nếu không thể thì trả `-1`. Nếu lời giải tồn tại, đề đảm bảo nó là duy nhất.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
```

> **EN:** Starting at station 3 allows the tank balance to remain non-negative throughout the full circuit.
>
> **VI:** Bắt đầu ở trạm `3` giúp lượng xăng trong bình luôn không âm trong suốt một vòng.

### Example 2 / Ví dụ 2

```text
Input: gas = [2,3,4], cost = [3,4,3]
Output: -1
```

> **EN:** There is not enough total gas to complete the circuit from any start.
>
> **VI:** Tổng lượng xăng không đủ để hoàn thành cả vòng từ bất kỳ điểm xuất phát nào.

## Constraints / Ràng buộc

> **EN:** `n == gas.length == cost.length`
>
> **VI:** `gas` và `cost` có cùng độ dài `n`.

> **EN:** `1 <= n <= 105`
>
> **VI:** `n` từ `1` đến `10^5`.

> **EN:** `0 <= gas[i], cost[i] <= 104`
>
> **VI:** Mỗi `gas[i]` và `cost[i]` nằm trong khoảng `0` đến `10^4`.

> **EN:** The input is generated such that the answer is unique.
>
> **VI:** Input được tạo sao cho nếu có đáp án thì đáp án là duy nhất.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/gas-station/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
