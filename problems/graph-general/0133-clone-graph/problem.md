# 133. Clone Graph

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given a reference to a node in a connected undirected graph, return a deep copy of the graph. Each node contains an integer `val` and a list of its `neighbors`.
>
> **VI:** Cho một reference tới node trong connected undirected graph, hãy trả về một deep copy của graph. Mỗi node có integer `val` và danh sách `neighbors`.

> **EN:** The clone must contain new node objects while preserving all values and neighbor relationships.
>
> **VI:** Bản clone phải gồm các node object mới nhưng giữ nguyên toàn bộ value và quan hệ neighbor.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
```

### Example 2 / Ví dụ 2

```text
Input: adjList = [[]]
Output: [[]]
```

### Example 3 / Ví dụ 3

```text
Input: adjList = []
Output: []
```

## Constraints / Ràng buộc

> **EN:** The number of nodes is in `[0, 100]`. Node values are unique and match their 1-indexed positions. There are no repeated edges or self-loops, and the graph is connected when non-empty.
>
> **VI:** Số node nằm trong `[0, 100]`. Value là duy nhất và khớp vị trí 1-indexed. Không có repeated edge hoặc self-loop; graph luôn connected khi không rỗng.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/clone-graph/

English wording preserved from `raw/top-interview-150/Graph General.txt` (blob `17bdb083b5c628079da7c7553fefe2e356774020`).
