# Solution / Lời giải — 146. LRU Cache

## 1. Core idea / Ý tưởng chính

Bài yêu cầu đồng thời:

- tìm key trong `O(1)` trung bình;
- cập nhật recency trong `O(1)`;
- tìm và xóa LRU key trong `O(1)`.

Một cấu trúc riêng lẻ không đáp ứng thuận tiện cả ba. Ta kết hợp:

- `HashMap<Integer, Node>` để map `key -> node` trong `O(1)` trung bình;
- doubly linked list để duy trì thứ tự sử dụng.

Quy ước:

```text
head <-> LRU ... MRU <-> tail
```

`head` và `tail` là sentinel nodes. Node vừa được dùng luôn được chuyển tới ngay trước `tail`.

## 2. Operations / Các thao tác

### get(key)

1. Tìm node trong map.
2. Không có → return `-1`.
3. Có → remove node khỏi vị trí cũ, append về MRU end, return value.

### put(key, value)

- Nếu key đã tồn tại:
  - cập nhật value;
  - move node về MRU end.
- Nếu key mới:
  - tạo node;
  - thêm vào map và MRU end;
  - nếu size vượt capacity, remove `head.next` (LRU) khỏi list và map.

## 3. Why it works / Vì sao đúng

Doubly linked list luôn sắp node theo recency từ LRU tới MRU. Mỗi successful `get` và mỗi `put` trên key đều biểu diễn một lần sử dụng mới nhất, nên node tương ứng được chuyển về cuối MRU. Vì vậy node ngay sau `head` luôn là key ít được sử dụng gần đây nhất. Khi capacity bị vượt, xóa đúng node đó thực hiện chính xác chính sách LRU.

HashMap và list luôn chứa cùng tập key: insert thêm vào cả hai; eviction xóa khỏi cả hai; update không thay đổi tập key. Do đó lookup luôn trỏ tới đúng node hiện có trong recency list.

## 4. Dry run / Chạy thử

Với capacity `2`:

```text
put(1,1) => [1]
put(2,2) => [1,2]       // 1 LRU, 2 MRU
get(1)   => 1; [2,1]
put(3,3) => evict 2; [1,3]
get(2)   => -1
put(4,4) => evict 1; [3,4]
get(1)   => -1
get(3)   => 3; [4,3]
get(4)   => 4; [3,4]
```

## 5. Optimal Java solution / Java tối ưu

```java
import java.util.HashMap;
import java.util.Map;

class LRUCache {
    private static class Node {
        int key;
        int value;
        Node prev;
        Node next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, Node> cache = new HashMap<>();
    private final Node head = new Node(0, 0);
    private final Node tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = cache.get(key);
        if (node == null) {
            return -1;
        }
        moveToMostRecent(node);
        return node.value;
    }

    public void put(int key, int value) {
        Node node = cache.get(key);
        if (node != null) {
            node.value = value;
            moveToMostRecent(node);
            return;
        }

        Node added = new Node(key, value);
        cache.put(key, added);
        addBeforeTail(added);

        if (cache.size() > capacity) {
            Node lru = head.next;
            remove(lru);
            cache.remove(lru.key);
        }
    }

    private void moveToMostRecent(Node node) {
        remove(node);
        addBeforeTail(node);
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addBeforeTail(Node node) {
        node.prev = tail.prev;
        node.next = tail;
        tail.prev.next = node;
        tail.prev = node;
    }
}
```

## 6. Complexity / Độ phức tạp

- `get`: `O(1)` average.
- `put`: `O(1)` average.
- Space: `O(capacity)`.

## 7. Edge cases / Trường hợp biên

- Capacity = 1.
- `get` key không tồn tại.
- `put` cập nhật key đã có phải refresh recency.
- `get` cũng phải refresh recency.
- Update existing key không được tăng size.
- Eviction sau insert key mới phải xóa đúng LRU key.

## 8. Common mistakes / Lỗi thường gặp

- Dùng chỉ HashMap nhưng không có cách `O(1)` để tìm LRU.
- Dùng `LinkedHashMap` khi interview muốn tự thiết kế cấu trúc.
- `get` trả đúng value nhưng quên move node thành MRU.
- `put` update value nhưng quên refresh recency.
- Evict khỏi list nhưng quên xóa khỏi map, hoặc ngược lại.
- Quản lý head/tail không sentinel dẫn tới nhiều null edge case.
