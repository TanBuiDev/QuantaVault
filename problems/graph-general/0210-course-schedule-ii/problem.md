# 210. Course Schedule II

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** There are `numCourses` courses labeled `0..numCourses-1`. Each pair `[a,b]` means course `b` must be completed before `a`. Return one valid order in which to finish all courses. If it is impossible, return an empty array.
>
> **VI:** Có `numCourses` course đánh số `0..numCourses-1`. Mỗi pair `[a,b]` nghĩa là course `b` phải hoàn thành trước `a`. Hãy trả về một thứ tự hợp lệ để hoàn thành tất cả course; nếu không thể, trả array rỗng.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: numCourses = 2, prerequisites = [[1,0]]
Output: [0,1]
```

### Example 2 / Ví dụ 2
```text
Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,2,1,3]
```

Multiple valid answers may exist.

### Example 3 / Ví dụ 3
```text
Input: numCourses = 1, prerequisites = []
Output: [0]
```

## Constraints / Ràng buộc

> **EN:** Course labels are valid; prerequisite edges contain no duplicates.
>
> **VI:** Course label hợp lệ và prerequisite edge không bị duplicate.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/course-schedule-ii/

English wording preserved from `raw/top-interview-150/Graph General.txt` (blob `17bdb083b5c628079da7c7553fefe2e356774020`).
