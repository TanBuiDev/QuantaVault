# 138. Copy List with Random Pointer

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.
>
> **VI:** Cho một linked list dài `n`, trong đó mỗi node có thêm pointer `random` có thể trỏ tới bất kỳ node nào trong list hoặc `null`.

> **EN:** Construct a deep copy of the list. The deep copy should consist of exactly n brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the next and random pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.
>
> **VI:** Hãy tạo một **deep copy** gồm đúng `n` node hoàn toàn mới. Mỗi node mới có cùng value với node tương ứng trong list gốc; cả `next` và `random` phải tái tạo đúng cấu trúc nhưng chỉ trỏ tới các node của bản sao. Không pointer nào trong copied list được trỏ về node của original list.

> **EN:** For example, if there are two nodes X and Y in the original list, where X.random --> Y, then for the corresponding two nodes x and y in the copied list, x.random --> y.
>
> **VI:** Ví dụ nếu `X.random -> Y` ở original list thì node copy tương ứng phải có `x.random -> y`.

> **EN:** Return the head of the copied linked list.
>
> **VI:** Trả về head của linked list đã copy.

> **EN:** The linked list is represented in the input/output as a list of n nodes. Each node is represented as a pair of [val, random_index] where:
>
> **VI:** Trong phần mô tả input/output, mỗi node được biểu diễn bằng cặp `[val, random_index]`.

> **EN:** val: an integer representing Node.val
>
> **VI:** `val` là giá trị `Node.val`.

> **EN:** random_index: the index of the node (range from 0 to n-1) that the random pointer points to, or null if it does not point to any node.
>
> **VI:** `random_index` là index node mà `random` trỏ tới, hoặc `null` nếu không trỏ tới node nào.

> **EN:** Your code will only be given the head of the original linked list.
>
> **VI:** Code của bạn chỉ nhận `head` của original linked list.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
```

### Example 2 / Ví dụ 2

```text
Input: head = [[1,1],[2,1]]
Output: [[1,1],[2,1]]
```

### Example 3 / Ví dụ 3

```text
Input: head = [[3,null],[3,0],[3,null]]
Output: [[3,null],[3,0],[3,null]]
```

## Constraints / Ràng buộc

> **EN:** 0 <= n <= 1000
>
> **VI:** `n` nằm trong `[0, 1000]`.

> **EN:** -104 <= Node.val <= 104
>
> **VI:** `Node.val` nằm trong khoảng `[-10^4, 10^4]`.

> **EN:** Node.random is null or is pointing to some node in the linked list.
>
> **VI:** `Node.random` là `null` hoặc trỏ tới một node thuộc linked list.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/copy-list-with-random-pointer/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
