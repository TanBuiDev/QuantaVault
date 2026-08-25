# 141. Linked List Cycle

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given `head`, the `head` of a linked list, determine if the linked list has a `cycle` in it.
>
> **VI:** Cho `head` là node đầu của một linked list. Hãy xác định linked list đó có chứa cycle hay không.

> **EN:** There is a `cycle` in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, pos is used to denote the index of the node that tail's `next` pointer is connected to. Note that pos is not passed as a parameter.
>
> **VI:** Linked list có cycle nếu tồn tại một node có thể được đi tới lần nữa bằng cách liên tục theo con trỏ `next`. Trong mô tả input, `pos` được dùng nội bộ để chỉ index của node mà `next` của tail nối tới. Lưu ý `pos` không được truyền vào hàm.

> **EN:** Return `true` if there is a `cycle` in the linked list. Otherwise, return `false`.
>
> **VI:** Trả về `true` nếu linked list có cycle. Ngược lại trả về `false`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
```

**VI:** Tail nối lại node ở index `1`, vì vậy khi đi theo `next` ta sẽ quay lại một node đã đi qua.

### Example 2 / Ví dụ 2

```text
Input: head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
```

**VI:** Tail nối lại node đầu tiên nên danh sách tạo thành một vòng lặp.

### Example 3 / Ví dụ 3

```text
Input: head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.
```

**VI:** Node duy nhất có `next = null`, do đó không có cycle.

## Constraints / Ràng buộc

> **EN:** The number of the nodes in the list is in the range [0, 10^4].
>
> **VI:** `The number of the nodes in the list is in the range [0, 10^4].`

> **EN:** -10^5 <= `Node`.val <= 10^5
>
> **VI:** `-10^5 <= Node.val <= 10^5`

> **EN:** pos is -1 or a valid index in the linked-list.
>
> **VI:** `pos` bằng `-1` hoặc là một index hợp lệ của linked list.

## Follow-up / Câu hỏi mở rộng

> **EN:** Can you solve it using O(1) (i.e. constant) memory?
>
> **VI:** Bạn có thể giải bài bằng `O(1)` bộ nhớ phụ hay không?

## Source / Nguồn

LeetCode: https://leetcode.com/problems/linked-list-cycle/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
