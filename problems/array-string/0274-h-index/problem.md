# 274. H-Index

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Given an array of integers citations where citations[i] is the number of citations a researcher received for their ith paper, return the researcher's h-index.
>
> **VI:** Cho mảng số nguyên `citations`, trong đó `citations[i]` là số lượt trích dẫn của bài báo thứ `i`, hãy trả về **h-index** của nhà nghiên cứu.

> **EN:** According to the definition of h-index on Wikipedia: The h-index is defined as the maximum value of h such that the given researcher has published at least h papers that have each been cited at least h times.
>
> **VI:** Theo định nghĩa h-index: đó là giá trị lớn nhất `h` sao cho nhà nghiên cứu có ít nhất `h` bài báo, và mỗi bài trong số đó được trích dẫn ít nhất `h` lần.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: citations = [3,0,6,1,5]
Output: 3
```

> **EN:** Explanation: [3,0,6,1,5] means the researcher has 5 papers in total and each of them had received 3, 0, 6, 1, 5 citations respectively. Since the researcher has 3 papers with at least 3 citations each and the remaining two with no more than 3 citations each, their h-index is 3.
>
> **VI:** Giải thích: Có 5 bài với số citation lần lượt `3,0,6,1,5`. Có ít nhất 3 bài đạt từ 3 citation trở lên, nhưng không thể đạt h-index lớn hơn, nên đáp án là `3`.

### Example 2 / Ví dụ 2

```text
Input: citations = [1,3,1]
Output: 1
```

## Constraints / Ràng buộc

> **EN:** `n == citations.length`
>
> **VI:** `n` bằng độ dài `citations`.

> **EN:** `1 <= n <= 5000`
>
> **VI:** `n` từ `1` đến `5000`.

> **EN:** `0 <= citations[i] <= 1000`
>
> **VI:** Mỗi `citations[i]` nằm trong khoảng `0` đến `1000`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/h-index/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
