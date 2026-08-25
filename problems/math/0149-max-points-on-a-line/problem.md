# 149. Max Points on a Line

## Difficulty / Độ khó

**Hard / Khó**

## Problem / Đề bài

> **EN:** Given an array of `points` where `points[i]` = [xi, yi] represents a point on the X-Y plane, return the maximum number of `points` that lie on the same straight line.
>
> **VI:** Cho mảng `points`, trong đó `points[i] = [xi, yi]` biểu diễn một điểm trên mặt phẳng X-Y, hãy trả về số điểm lớn nhất cùng nằm trên một đường thẳng.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: points = [[1,1],[2,2],[3,3]]
Output: 3
```

### Example 2 / Ví dụ 2

```text
Input: points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]
Output: 4
```

## Constraints / Ràng buộc

> **EN:** `1 <= `points`.length <= 300`
>
> **VI:** Có từ `1` đến `300` điểm.

> **EN:** `points[i].length == 2`
>
> **VI:** Mỗi điểm có đúng hai tọa độ.

> **EN:** `-10^4 <= xi, yi <= 10^4`
>
> **VI:** Mỗi tọa độ nằm trong khoảng `-10^4` đến `10^4`.

> **EN:** `All the `points` are unique.`
>
> **VI:** Tất cả các điểm là duy nhất.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/max-points-on-a-line/

English wording preserved from `raw/top-interview-150/Math.txt` (blob `acbbece61493a6901c8c6e4974b6103cfb12b086`).
