# 56. Merge Intervals — Hints / Gợi ý

## Hint 1

**EN:** Overlap is hard to detect globally when the intervals are in arbitrary order. What ordering would make the next possible overlap local?

**VI:** Khi các interval ở thứ tự bất kỳ, rất khó biết interval nào cần so với interval nào. Hãy nghĩ đến cách sắp xếp để overlap tiếp theo luôn nằm gần current interval.

## Hint 2

**EN:** Sort intervals by their start value. Then keep one current merged interval while scanning from left to right.

**VI:** Sort theo `start`. Sau đó scan từ trái sang phải và chỉ cần giữ một current merged interval.

## Hint 3

**EN:** If `nextStart <= currentEnd`, the intervals overlap, including the case where they only touch at one endpoint.

**VI:** Nếu `nextStart <= currentEnd` thì hai interval overlap; dấu `<=` rất quan trọng vì `[1,4]` và `[4,5]` cũng phải merge.

## Hint 4

**EN:** When there is no overlap, emit the current interval and start a new merged interval. Do not forget to emit the final interval after the loop.

**VI:** Khi không overlap, đưa current interval vào kết quả rồi bắt đầu interval mới. Sau vòng lặp nhớ flush interval cuối cùng.
