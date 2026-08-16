# 155. Min Stack — Hints / Gợi ý

## Hint 1

**EN:** A normal stack already gives `push`, `pop`, and `top` in `O(1)`. The only challenge is preserving enough information to answer `getMin()` without scanning.

**VI:** Stack thường đã có `push`, `pop`, `top` `O(1)`. Vấn đề duy nhất là lưu đủ thông tin để `getMin()` không phải scan toàn bộ stack.

## Hint 2

**EN:** What if each stack level also remembered the minimum value for the prefix ending at that level?

**VI:** Nếu mỗi level của stack biết minimum của toàn bộ prefix tính tới level đó thì sao?

## Hint 3

**EN:** One simple design uses two synchronized stacks: one for values and one for the minimum-so-far at every depth.

**VI:** Một thiết kế đơn giản dùng hai stack đồng bộ: một stack chứa value, một stack chứa minimum-so-far ở cùng depth.

## Hint 4

**EN:** On push, the new minimum is `min(value, currentMin)`. On pop, pop both stacks. Then the top of the min stack is always the current minimum.

**VI:** Khi push, minimum mới là `min(value, currentMin)`. Khi pop, pop cả hai stack. Vì vậy top của min stack luôn là minimum hiện tại.
