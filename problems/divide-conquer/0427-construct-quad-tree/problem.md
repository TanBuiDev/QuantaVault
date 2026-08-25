# 427. Construct Quad Tree

## Difficulty / Độ khó
**Medium / Trung bình**

## Problem / Đề bài
> **EN:** Given an `n x n` binary `matrix` `grid`, construct a Quad-Tree. A `uniform` region becomes a leaf whose `val` is that region's bit; otherwise create an internal node and recursively split the region into top-`left`, top-`right`, bottom-`left`, and bottom-`right` quadrants.
>
> **VI:** Cho ma trận nhị phân vuông `grid`, hãy dựng Quad-Tree. Vùng đồng nhất trở thành leaf với `val` bằng bit của vùng; vùng không đồng nhất được chia thành bốn quadrant và xử lý đệ quy.

## Examples / Ví dụ
```text
grid = [[0,1],[1,0]] -> one internal root with four leaf children
a uniform all-1 grid -> one leaf node with val=true
```

## Constraints / Ràng buộc
> **EN:** `n == 2^x` for `0 <= x <= 6`; `grid` contains only 0 and 1.
>
> **VI:** Kích thước là lũy thừa của 2 tối đa 64; grid chỉ chứa 0/1.

## Source / Nguồn
LeetCode: https://leetcode.com/problems/construct-quad-tree/

English wording preserved from `raw/top-interview-150/Divide & Conquer.txt` (blob `bf5f0f59fe418d1671dd7e201ff87d31fe64df59`).
