# 452. Minimum Number of Arrows to Burst Balloons — Hints / Gợi ý

## Hint 1

**EN:** One arrow can burst every balloon whose interval contains the arrow's x-coordinate. So the problem is about choosing shared points for intervals.

**VI:** Một mũi tên có thể bắn vỡ mọi balloon có interval chứa cùng một tọa độ `x`. Hãy nhìn bài toán như chọn các điểm chung cho các interval.

## Hint 2

**EN:** For interval scheduling-style greedy problems, sorting by an endpoint is often useful. Which endpoint lets you preserve the most room for future balloons?

**VI:** Với interval greedy, sort theo endpoint thường rất mạnh. Hãy nghĩ xem chọn endpoint nào sẽ để lại nhiều cơ hội nhất cho các balloon phía sau.

## Hint 3

**EN:** Sort by `xend` ascending and shoot the first arrow at the earliest ending balloon's `xend`.

**VI:** Sort theo `xend` tăng dần và đặt mũi tên đầu tiên tại `xend` của balloon kết thúc sớm nhất.

## Hint 4

**EN:** As long as the next balloon starts at or before the current arrow position, that same arrow already bursts it. Only when `nextStart > arrowX` do you need a new arrow.

**VI:** Nếu `nextStart <= arrowX`, mũi tên hiện tại vẫn nằm trong balloon đó. Chỉ khi `nextStart > arrowX` mới cần bắn mũi tên mới.
