# 129. Sum Root to Leaf Numbers

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given the `root` of a binary tree containing digits from `0` to `9` only. Each `root`-to-leaf path represents a number; for `example`, `1 -> 2 -> 3` represents `123`. Return the total sum of all `root`-to-leaf numbers.
>
> **VI:** Cho root của một binary tree chỉ chứa các chữ số từ `0` đến `9`. Mỗi path từ root tới leaf biểu diễn một số; ví dụ `1 -> 2 -> 3` biểu diễn `123`. Hãy trả về tổng của tất cả các số root-to-leaf.

> **EN:** Test cases are generated so that the answer fits in a 32-bit integer. A leaf node has no children.
>
> **VI:** Test được đảm bảo để đáp án vừa trong số nguyên 32-bit. Leaf là node không có child.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: root = [1,2,3]
Output: 25
```

The paths form `12` and `13`, so the total is `25`.

### Example 2 / Ví dụ 2

```text
Input: root = [4,9,0,5,1]
Output: 1026
```

The paths form `495`, `491`, and `40`; their sum is `1026`.

## Constraints / Ràng buộc

> **EN:** The number of nodes in the tree is in the range `[1, 1000]`.
>
> **VI:** Số node nằm trong `[1, 1000]`.

> **EN:** `0 <= `Node`.val <= 9`
>
> **VI:** `0 <= Node.val <= 9`.

> **EN:** The depth of the tree will not exceed `10`.
>
> **VI:** Độ sâu của tree không vượt quá `10`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/sum-root-to-leaf-numbers/

English wording preserved from `raw/top-interview-150/Binary Tree General.txt` (blob `67ddc468f37324188e476da748c186df497ee5a0`).
