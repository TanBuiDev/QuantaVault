# 452. Minimum Number of Arrows to Burst Balloons

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** There are some spherical balloons taped onto a flat wall that represents the XY-plane. The balloons are represented as a 2D integer array points where points[i] = [xstart, xend] denotes a balloon whose horizontal diameter stretches between xstart and xend. You do not know the exact y-coordinates of the balloons.
>
> **VI:** Có một số quả bóng hình cầu được dán lên một bức tường phẳng biểu diễn mặt phẳng XY. Mỗi balloon được mô tả bởi `points[i] = [xstart, xend]`, tức đường kính ngang của nó trải từ `xstart` đến `xend`. Tọa độ `y` chính xác không được biết.

> **EN:** Arrows can be shot up directly vertically (in the positive y-direction) from different points along the x-axis. A balloon with xstart and xend is burst by an arrow shot at x if xstart <= x <= xend. There is no limit to the number of arrows that can be shot. A shot arrow keeps traveling up infinitely, bursting any balloons in its path.
>
> **VI:** Mũi tên được bắn thẳng đứng theo chiều dương của trục `y` từ một vị trí `x` trên trục hoành. Balloon `[xstart, xend]` bị bắn vỡ nếu `xstart <= x <= xend`. Không giới hạn số mũi tên, và một mũi tên tiếp tục bay lên vô hạn nên có thể xuyên qua nhiều balloon cùng chứa vị trí `x` đó.

> **EN:** Given the array points, return the minimum number of arrows that must be shot to burst all balloons.
>
> **VI:** Cho `points`, hãy trả về số mũi tên ít nhất cần bắn để làm vỡ toàn bộ balloon.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input: points = [[10,16],[2,8],[1,6],[7,12]]
Output: 2
```

> **EN:** Explanation: The balloons can be burst by 2 arrows:
> - Shoot an arrow at x = 6, bursting the balloons [2,8] and [1,6].
> - Shoot an arrow at x = 11, bursting the balloons [10,16] and [7,12].
>
> **VI:** Có thể dùng 2 mũi tên: một tại `x = 6` để bắn `[2,8]` và `[1,6]`, một tại `x = 11` để bắn `[10,16]` và `[7,12]`.

### Example 2 / Ví dụ 2

```text
Input: points = [[1,2],[3,4],[5,6],[7,8]]
Output: 4
```

> **EN:** Explanation: One arrow needs to be shot for each balloon for a total of 4 arrows.
>
> **VI:** Các balloon không có điểm chung nên mỗi balloon cần một mũi tên riêng, tổng cộng `4`.

### Example 3 / Ví dụ 3

```text
Input: points = [[1,2],[2,3],[3,4],[4,5]]
Output: 2
```

> **EN:** Explanation: The balloons can be burst by 2 arrows:
> - Shoot an arrow at x = 2, bursting the balloons [1,2] and [2,3].
> - Shoot an arrow at x = 4, bursting the balloons [3,4] and [4,5].
>
> **VI:** Có thể bắn tại `x = 2` và `x = 4`; touching endpoints vẫn được tính vì điều kiện chứa điểm là inclusive.

## Constraints / Ràng buộc

> **EN:** `1 <= points.length <= 105`
>
> **VI:** Số balloon nằm trong giới hạn được nêu trong source.

> **EN:** `points[i].length == 2`
>
> **VI:** Mỗi balloon có đúng hai endpoint.

> **EN:** `-231 <= xstart < xend <= 231 - 1`
>
> **VI:** Mỗi interval có `xstart < xend` và endpoint có thể âm hoặc dương trong miền integer được nêu trong source.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/

English wording preserved from `raw/top-interview-150/Intervals.txt` (blob `113c3211b5e02ebaa87bbba24f74f41109da627d`).
