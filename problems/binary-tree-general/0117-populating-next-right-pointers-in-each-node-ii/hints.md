# Hints / Gợi ý — 117. Populating Next Right Pointers in Each Node II

## Hint 1

**EN:** Once one level has correct `next` pointers, you can traverse that whole level without a queue.

**VI:** Khi một level đã có `next` pointer đúng, bạn có thể duyệt toàn bộ level đó mà không cần queue.

## Hint 2

**EN:** While scanning the current level, keep references to the first child found on the next level and the most recently linked child.

**VI:** Khi quét level hiện tại, hãy giữ reference tới child đầu tiên của level kế tiếp và child vừa được nối gần nhất.

## Hint 3

**EN:** Append each non-null left child and right child to the next-level chain in left-to-right order.

**VI:** Nối từng left child và right child khác null vào chain của level kế tiếp theo thứ tự trái sang phải.

## Key observation / Quan sát then chốt

The `next` pointers created for one level become the traversal mechanism for processing that level, so no BFS queue is required.
