# Hints / Gợi ý — 21. Merge Two Sorted Lists

## Hint 1

**EN:** Look only at the current head of each list. Since both lists are sorted, the smaller head must be the next node of the merged list.

**VI:** Chỉ cần nhìn head hiện tại của hai list. Vì cả hai đã sorted, node có value nhỏ hơn chắc chắn là node tiếp theo của result.

## Hint 2

**EN:** After choosing one node, advance only the pointer of the list that contributed that node.

**VI:** Sau khi chọn một node, chỉ advance pointer của list đã cung cấp node đó.

## Hint 3

**EN:** Once one list becomes null, append the entire remaining suffix of the other list; it is already sorted.

**VI:** Khi một list hết, nối thẳng toàn bộ suffix còn lại của list kia vì phần đó vốn đã sorted.

## Key observation / Quan sát then chốt

Dummy head giúp thao tác nối node đồng nhất và cho phép reuse node input với `O(1)` extra space.
