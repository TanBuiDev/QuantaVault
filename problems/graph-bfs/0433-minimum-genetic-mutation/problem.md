# 433. Minimum Genetic Mutation

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** A gene string has length 8 and contains only `A`, `C`, `G`, and `T`. One mutation changes exactly one character. Given `startGene`, `endGene`, and a `bank` of valid genes, return the minimum number of mutations needed to transform start into `end`, or `-1` if impossible. Every intermediate gene after a mutation must appear in the `bank`.
>
> **VI:** Gene string dài 8 và chỉ chứa `A`, `C`, `G`, `T`. Một mutation đổi đúng một ký tự. Cho `startGene`, `endGene` và bank gene hợp lệ, hãy trả số mutation ít nhất để biến start thành end, hoặc `-1` nếu không thể. Mọi gene trung gian sau mutation phải có trong bank.

## Examples / Ví dụ

### Example 1 / Ví dụ 1
```text
Input: startGene = "AACCGGTT", endGene = "AACCGGTA", bank = ["AACCGGTA"]
Output: 1
```

### Example 2 / Ví dụ 2
```text
Input: startGene = "AACCGGTT", endGene = "AAACGGTA", bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]
Output: 2
```

## Constraints / Ràng buộc

> **EN:** All gene strings have length 8 and use only `A/C/G/T`; `bank` entries are unique.
>
> **VI:** Mọi gene string dài 8, chỉ dùng `A/C/G/T`; các bank entry là duy nhất.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/minimum-genetic-mutation/

English wording preserved from `raw/top-interview-150/Graph BFS.txt` (blob `9eca86e57c1fadb2e22fe85524edd686ff35b23a`).
