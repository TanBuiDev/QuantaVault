# Hints / Gợi ý — 86. Partition List

## Hint 1

**EN:** The required output is stable: nodes smaller than `x` keep their relative order, and nodes greater than or equal to `x` also keep theirs.

**VI:** Output phải stable: các node `< x` giữ nguyên thứ tự tương đối, và nhóm `>= x` cũng vậy.

## Hint 2

**EN:** Build two chains while scanning once: one for nodes `< x` and one for nodes `>= x`. Append to the tail of each chain rather than inserting at the front.

**VI:** Duyệt một lần và xây hai chain: một cho `< x`, một cho `>= x`. Luôn append vào tail để giữ stable order.

## Hint 3

**EN:** Before joining the two chains, terminate the greater-or-equal chain with `null`. Otherwise an old `next` pointer may create an incorrect tail or a cycle.

**VI:** Trước khi nối hai chain, phải đặt `greaterTail.next = null`; nếu không, liên kết `next` cũ có thể tạo tail sai hoặc cycle.

## Key observation / Quan sát then chốt

Không cần sort. Chỉ cần stable partition bằng hai dummy heads rồi nối hai partition lại.
