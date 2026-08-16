# Hints / Gợi ý — 130. Surrounded Regions

## Hint 1
**EN:** It is easier to identify cells that must not be captured: every `O` connected to a border `O` is safe.

**VI:** Dễ hơn nếu tìm các cell không được capture: mọi `O` nối với một `O` ở biên đều an toàn.

## Hint 2
**EN:** Flood-fill from all border `O` cells and mark the reachable cells temporarily.

**VI:** Flood-fill từ mọi `O` ở biên và đánh dấu tạm các cell reachable.

## Hint 3
**EN:** After marking, flip remaining `O` to `X`, then restore the safe marker to `O`.

**VI:** Sau khi mark, đổi các `O` còn lại thành `X`, rồi restore marker an toàn về `O`.
