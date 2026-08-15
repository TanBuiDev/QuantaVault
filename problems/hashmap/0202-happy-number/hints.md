# 202. Happy Number — Hints / Gợi ý

## Hint 1

Quá trình biến đổi là một deterministic function `next(x)`: cùng một `x` luôn sinh cùng một giá trị kế tiếp.

## Hint 2

Nếu không đi tới `1`, vì trạng thái sớm trở nên hữu hạn/bounded nên cuối cùng phải lặp lại một giá trị và tạo cycle.

## Hint 3

Có thể dùng HashSet để phát hiện repeat, nhưng hãy thử Floyd cycle detection với slow/fast pointers.

## Hint 4

`slow` đi một bước `next`, `fast` đi hai bước. Nếu `fast == 1` thì happy; nếu `slow == fast` trước khi tới `1`, đã gặp cycle không chứa `1`.
