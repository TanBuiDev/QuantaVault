# 155. Min Stack

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.
>
> **VI:** Thiết kế một stack hỗ trợ `push`, `pop`, `top` và lấy phần tử nhỏ nhất trong thời gian hằng số.

> **EN:** Implement the MinStack class:
>
> **VI:** Hãy cài đặt class `MinStack`:

> **EN:** MinStack() initializes the stack object.
>
> **VI:** `MinStack()` khởi tạo stack.

> **EN:** void push(int value) pushes the element value onto the stack.
>
> **VI:** `push(int value)` đưa `value` lên đỉnh stack.

> **EN:** void pop() removes the element on the top of the stack.
>
> **VI:** `pop()` xóa phần tử trên đỉnh stack.

> **EN:** int top() gets the top element of the stack.
>
> **VI:** `top()` trả về phần tử trên đỉnh stack.

> **EN:** int getMin() retrieves the minimum element in the stack.
>
> **VI:** `getMin()` trả về phần tử nhỏ nhất hiện có trong stack.

> **EN:** You must implement a solution with O(1) time complexity for each function.
>
> **VI:** Mỗi operation phải có time complexity `O(1)`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

Output
[null,null,null,null,-3,null,0,-2]
```

> **EN:** Explanation
> MinStack minStack = new MinStack();
> minStack.push(-2);
> minStack.push(0);
> minStack.push(-3);
> minStack.getMin(); // return -3
> minStack.pop();
> minStack.top();    // return 0
> minStack.getMin(); // return -2
>
> **VI:** Sau khi push `-2, 0, -3`, minimum là `-3`. Pop `-3` xong thì top là `0` và minimum quay lại `-2`.

## Constraints / Ràng buộc

> **EN:** `-231 <= val <= 231 - 1`
>
> **VI:** Giá trị nằm trong miền signed 32-bit theo source.

> **EN:** Methods pop, top and getMin operations will always be called on non-empty stacks.
>
> **VI:** `pop`, `top`, `getMin` chỉ được gọi khi stack không rỗng.

> **EN:** At most 3 * 104 calls will be made to push, pop, top, and getMin.
>
> **VI:** Tổng số lời gọi operation tối đa theo constraint là `3 * 10^4`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/min-stack/

English wording preserved from `raw/top-interview-150/Stack.txt` (blob `942ddfc40cd307f8605930897a04d012549bfe32`).
