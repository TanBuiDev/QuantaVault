# 130. Surrounded Regions

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an `m x n` board containing `X` and `O`, capture every region of connected `O` cells that is completely surrounded by `X`. A region touching the board edge is not surrounded. Replace captured `O` cells with `X` in-place.
>
> **VI:** Cho board `m x n` chứa `X` và `O`. Hãy capture mọi region gồm các `O` nối 4 hướng và bị `X` bao quanh hoàn toàn. Region chạm biên không bị capture. Thay các `O` bị capture thành `X` ngay trên board.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input:  [[X,X,X,X],[X,O,O,X],[X,X,O,X],[X,O,X,X]]
Output: [[X,X,X,X],[X,X,X,X],[X,X,X,X],[X,O,X,X]]
```

### Example 2 / Ví dụ 2
```text
Input: [[X]]
Output: [[X]]
```

## Constraints / Ràng buộc

> **EN:** `1 <= m, n <= 200`; every cell is `X` or `O`.
>
> **VI:** `1 <= m, n <= 200`; mỗi cell là `X` hoặc `O`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/surrounded-regions/

English wording preserved from `raw/top-interview-150/Graph General.txt` (blob `17bdb083b5c628079da7c7553fefe2e356774020`).
