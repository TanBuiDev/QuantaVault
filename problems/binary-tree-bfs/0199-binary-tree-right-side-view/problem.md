# 199. Binary Tree Right Side View

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given the root of a binary tree, imagine standing on its right side. Return the values of the visible nodes from top to bottom.
>
> **VI:** Cho root của một binary tree. Hãy tưởng tượng đứng ở phía bên phải và trả về value của các node nhìn thấy từ trên xuống dưới.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]
```

### Example 2 / Ví dụ 2
```text
Input: root = [1,2,3,4,null,null,null,5]
Output: [1,3,4,5]
```

### Example 3 / Ví dụ 3
```text
Input: root = [1,null,3]
Output: [1,3]
```

### Example 4 / Ví dụ 4
```text
Input: root = []
Output: []
```

## Constraints / Ràng buộc

> **EN:** The number of nodes is in `[0, 100]`; `-100 <= Node.val <= 100`.
>
> **VI:** Số node nằm trong `[0, 100]`; `-100 <= Node.val <= 100`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/binary-tree-right-side-view/

English wording preserved from `raw/top-interview-150/Binary Tree BFS.txt` (blob `20ce0899e516b4822ae7954e35b781e840be2b73`).
