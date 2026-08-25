# 909. Snakes and Ladders

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** You are given an `n x n` `board` whose squares are labeled from `1` to `n^2` in boustrophedon order starting from the bottom-`left`. From square `curr`, one die roll may choose any square from `curr+1` through `min(curr+6,n^2)`. If that chosen square starts a snake or ladder, you must move to its destination. Return the minimum number of rolls needed to reach `n^2`, or `-1` if impossible.
>
> **VI:** Cho board `n x n` được đánh số từ `1` tới `n^2` theo kiểu boustrophedon bắt đầu ở góc dưới trái. Từ `curr`, một lần gieo xúc xắc có thể chọn một square trong `[curr+1, min(curr+6,n^2)]`. Nếu square đó bắt đầu snake/ladder thì phải đi tới destination. Trả về số lần roll ít nhất để tới `n^2`, hoặc `-1` nếu không thể.

> **EN:** A snake or ladder is taken at most once per die roll; do not chain a second jump immediately.
>
> **VI:** Mỗi lần roll chỉ đi qua tối đa một snake/ladder; không chain jump lần thứ hai ngay lập tức.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]
Output: 4
```

### Example 2 / Ví dụ 2
```text
Input: board = [[-1,-1],[-1,3]]
Output: 1
```

## Constraints / Ràng buộc

> **EN:** `2 <= n <= 20`; `board` cells contain `-1` or valid destination labels.
>
> **VI:** `2 <= n <= 20`; cell chứa `-1` hoặc destination label hợp lệ.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/snakes-and-ladders/

English wording preserved from `raw/top-interview-150/Graph BFS.txt` (blob `9eca86e57c1fadb2e22fe85524edd686ff35b23a`).
