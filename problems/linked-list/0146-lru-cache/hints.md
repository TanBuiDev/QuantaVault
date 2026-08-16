# Hints / Gợi ý — 146. LRU Cache

## Hint 1

**EN:** A hash table gives `O(1)` average key lookup, but it does not tell you which key is least recently used.

**VI:** Hash table cho phép lookup key trung bình `O(1)`, nhưng không cho biết key nào ít được dùng gần đây nhất.

## Hint 2

**EN:** A doubly linked list can move an accessed node to the most-recently-used end and remove the least-recently-used node in `O(1)` if you already have the node reference.

**VI:** Doubly linked list có thể đưa node vừa truy cập tới đầu MRU và xóa node LRU trong `O(1)` nếu đã có reference tới node.

## Hint 3

**EN:** Combine `HashMap<key, node>` with a doubly linked list. Use sentinel head and tail nodes to avoid special cases for empty, first, and last nodes.

**VI:** Kết hợp `HashMap<key, node>` với doubly linked list. Dùng sentinel head/tail để tránh special case ở đầu/cuối list.

## Key observation / Quan sát then chốt

Mỗi lần `get` thành công hoặc `put` cập nhật/thêm key đều làm key đó trở thành **most recently used**. Khi vượt capacity, evict node ngay sau sentinel head nếu head là phía LRU.
