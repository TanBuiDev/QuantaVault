# 146. LRU Cache

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
>
> **VI:** Hãy thiết kế một cấu trúc dữ liệu tuân theo quy tắc cache **Least Recently Used (LRU)**.

> **EN:** Implement the LRUCache class:
>
> **VI:** Cài đặt class `LRUCache`:

> **EN:** LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
>
> **VI:** `LRUCache(int capacity)` khởi tạo cache với sức chứa dương `capacity`.

> **EN:** int get(int key) Return the value of the key if the key exists, otherwise return -1.
>
> **VI:** `get(key)` trả về value nếu key tồn tại, ngược lại trả `-1`.

> **EN:** void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.
>
> **VI:** `put(key, value)` cập nhật value nếu key đã tồn tại; nếu chưa thì thêm cặp key-value. Nếu vượt capacity, loại bỏ key ít được sử dụng gần đây nhất.

> **EN:** The functions get and put must each run in O(1) average time complexity.
>
> **VI:** Cả `get` và `put` phải chạy với độ phức tạp trung bình `O(1)`.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

```text
Input
["LRUCache","put","put","get","put","get","put","get","get","get"]
[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]

Output
[null,null,null,1,null,-1,null,-1,3,4]
```

Diễn biến chính: `get(1)` làm key `1` trở thành recently used; thêm key `3` sẽ evict key `2`. Sau đó thêm key `4` sẽ evict key `1`.

## Constraints / Ràng buộc

> **EN:** 1 <= capacity <= 3000
>
> **VI:** `1 <= capacity <= 3000`.

> **EN:** 0 <= key <= 104
>
> **VI:** `0 <= key <= 10^4`.

> **EN:** 0 <= value <= 105
>
> **VI:** `0 <= value <= 10^5`.

> **EN:** At most 2 * 105 calls will be made to get and put.
>
> **VI:** Có tối đa `2 * 10^5` lời gọi `get` và `put`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/lru-cache/

English wording preserved from `raw/top-interview-150/Linked List.txt` (blob `830f75f5ef67c4868a67d08873997af9ea8b6eaf`).
