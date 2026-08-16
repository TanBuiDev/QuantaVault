# 221. Maximal Square

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an m x n binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.
>
> **VI:** Cho một ma trận nhị phân kích thước `m x n` chỉ gồm các ký tự `0` và `1`, hãy tìm hình vuông lớn nhất chỉ chứa `1` và trả về diện tích của hình vuông đó.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
```

**Output / Đầu ra**

```text
4
```

### Example 2 / Ví dụ 2

**Input / Đầu vào**

```text
matrix = [["0","1"],["1","0"]]
```

**Output / Đầu ra**

```text
1
```

### Example 3 / Ví dụ 3

**Input / Đầu vào**

```text
matrix = [["0"]]
```

**Output / Đầu ra**

```text
0
```

## Constraints / Ràng buộc

> **EN:** `m == matrix.length`
>
> **VI:** `m` là số hàng của `matrix`.

> **EN:** `n == matrix[i].length`
>
> **VI:** `n` là số cột của mỗi hàng trong `matrix`.

> **EN:** `1 <= m, n <= 300`
>
> **VI:** Số hàng và số cột đều nằm trong khoảng từ `1` đến `300`.

> **EN:** `matrix[i][j] is '0' or '1'.`
>
> **VI:** Mỗi ô `matrix[i][j]` là ký tự `'0'` hoặc `'1'`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/maximal-square/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Multidimensional DP.txt
blob SHA: 0c0e6aa2f7812aa5c83065c7d856912aa0ed8b8f
```

Bản tiếng Việt được thêm theo `docs/content/bilingual-style-guide.md`. Phần này chỉ trình bày và dịch đề bài, không chứa lời giải thuật toán.
