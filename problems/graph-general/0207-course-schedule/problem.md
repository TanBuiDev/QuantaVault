# 207. Course Schedule

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** There are `numCourses` courses labeled from `0` to `numCourses - 1`. Each prerequisite pair `[a,b]` means course `b` must be finished before course `a`. Return `true` if it is possible to finish all courses, otherwise return `false`.
>
> **VI:** Có `numCourses` course đánh số từ `0` tới `numCourses - 1`. Mỗi pair prerequisite `[a,b]` nghĩa là phải học xong course `b` trước course `a`. Trả `true` nếu có thể hoàn thành tất cả course, ngược lại trả `false`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
```

### Example 2 / Ví dụ 2
```text
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
```

## Constraints / Ràng buộc

> **EN:** `1 <= numCourses <= 2000`; prerequisite pairs refer to valid course labels and contain no duplicate edges.
>
> **VI:** `1 <= numCourses <= 2000`; các prerequisite pair dùng course label hợp lệ và không có duplicate edge.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/course-schedule/

English wording preserved from `raw/top-interview-150/Graph General.txt` (blob `17bdb083b5c628079da7c7553fefe2e356774020`).
