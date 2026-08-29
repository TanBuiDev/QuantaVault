# 146. LRU Cache — Solution

## 1. Bắt đầu từ các thao tác mà cache bắt buộc phải làm

LRU Cache có hai operation:

```text
get(key)
put(key, value)
```

và cả hai phải chạy trung bình `O(1)`.

Ngoài chuyện tìm value theo key, cache còn phải biết **key nào lâu nhất chưa được dùng** để xóa khi đầy.

Ví dụ capacity = 2:

```text
put(1, 10)   cache: 1
put(2, 20)   cache: 1, 2
get(1)       key 1 vừa được dùng → 2 trở thành least recent
put(3, 30)   phải xóa key 2
```

Vậy ta cần giải đồng thời hai câu hỏi:

1. `key -> node` phải tìm ngay được trong `O(1)`.
2. “Least recent / most recent là ai?” và “đưa một node thành most recent” cũng phải `O(1)`.

Không có một cấu trúc đơn lẻ thông thường nào làm tốt cả hai việc này.

---

## 2. Từ yêu cầu sinh ra hai data structures

### HashMap giải lookup

```text
cache[key] -> Node
```

`HashMap` cho phép tìm node theo key trung bình `O(1)`.

Nhưng map không cho ta thứ tự sử dụng gần đây.

### Doubly linked list giải thứ tự recency

Ta duy trì list theo quy ước:

```text
head <-> LRU <-> ... <-> MRU <-> tail
```

- `head.next` luôn là real node ít recent nhất.
- `tail.prev` luôn là real node recent nhất.
- Khi một key được `get` hoặc update bằng `put`, node đó phải chuyển sát `tail`.

Vì node có cả `prev` và `next`, ta có thể tháo một node khỏi giữa list trong `O(1)` nếu đã có reference tới node đó.

Map chính là thứ giúp ta có reference đó ngay lập tức.

Đây là partnership quan trọng:

```text
HashMap: key -> vị trí node
Doubly linked list: node -> thứ tự recency
```

Hai cấu trúc phải luôn đồng bộ.

---

## 3. Vì sao cần `head` và `tail` giả?

Nếu list chỉ chứa real nodes, xóa node đầu/cuối thường phải xử lý riêng `null`.

Ta thêm hai sentinel:

```text
head <-> tail
```

Real nodes luôn nằm giữa chúng:

```text
head <-> A <-> B <-> tail
```

Nhờ vậy mọi real node luôn có cả `prev` và `next`. Công thức remove không cần hỏi “node này có phải head thật không?”:

```text
node.prev.next = node.next
node.next.prev = node.prev
```

### Diagram pointer trước khi remove

```text
A <-> B <-> C
     ^ remove B
```

Mục tiêu:

```text
A <------> C
```

Hai mũi tên cần sửa chính là:

```text
A.next = C
C.prev = A
```

Code `remove` chỉ là phiên bản tổng quát của hai mũi tên đó.

---

## 4. Ba helper operation tạo nên toàn bộ cache

### `remove(node)`

Tháo node khỏi vị trí hiện tại.

### `addBeforeTail(node)`

Chèn node vào vị trí MRU:

```text
... <-> oldMRU <-> tail

becomes

... <-> oldMRU <-> node <-> tail
```

### `moveToMostRecent(node)`

Một access mới nghĩa là node vừa được sử dụng:

```text
remove(node)
addBeforeTail(node)
```

Không scan list ở bước nào.

---

## 5. `get` và `put` trở nên rất cơ học

### `get(key)`

```text
không có trong map → -1
có node           → move node thành MRU → return value
```

Một `get` thành công **phải refresh recency**. Chỉ return value mà không move node sẽ làm lần eviction sau sai.

### `put(key, value)` khi key đã tồn tại

```text
update value
move node thành MRU
```

Size không đổi.

### `put(key, value)` khi key mới

```text
tạo node
map.put
addBeforeTail → node mới là MRU
```

Nếu vượt capacity:

```text
lru = head.next
remove(lru)
cache.remove(lru.key)
```

Phải xóa ở **cả list và map**; nếu chỉ xóa một phía, hai representation không còn đồng bộ.

---

## 6. Java Notes

`Map<Integer, Node>` nghĩa là map từ key kiểu `Integer` tới object `Node`.

```java
Node node = cache.get(key);
```

trả `null` khi key không tồn tại.

`private static class Node` là class phụ chỉ dùng bên trong `LRUCache`. Mỗi node giữ cả `key` lẫn `value`; việc giữ `key` rất quan trọng vì khi lấy victim từ `head.next`, ta cần `lru.key` để xóa entry tương ứng khỏi map.

---

## 7. Optimal Java solution

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
    private final Map<Integer, Node> cache;
    private final Node head;
    private final Node tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);

        // Sentinels đảm bảo mọi real node luôn có cả prev và next, nên remove/add
        // dùng cùng một pointer formula cho cả LRU/MRU mà không cần null edge cases.
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = cache.get(key);
        if (node == null) {
            return -1;
        }

        // Successful get là một lần sử dụng, nên recency phải được refresh.
        moveToMostRecent(node);
        return node.value;
    }

    public void put(int key, int value) {
        Node node = cache.get(key);
        if (node != null) {
            node.value = value;

            // Update existing key không tăng size nhưng vẫn là recent access.
            moveToMostRecent(node);
            return;
        }

        Node added = new Node(key, value);
        cache.put(key, added);
        addBeforeTail(added);

        if (cache.size() > capacity) {
            // List invariant là head <-> LRU ... MRU <-> tail, nên head.next
            // luôn là victim duy nhất cần evict khi capacity vừa bị vượt.
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
        // Ngay trước tail là MRU position; four pointer writes splice node vào
        // mà không cần scan list, giữ get/put ở average O(1).
        node.prev = tail.prev;
        node.next = tail;
        tail.prev.next = node;
        tail.prev = node;
    }
}
```

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 8. Dry run theo map và list cùng lúc

Capacity = 2.

### `put(1, 10)`

```text
map  = {1 -> N1}
list = head <-> N1 <-> tail
```

### `put(2, 20)`

```text
map  = {1 -> N1, 2 -> N2}
list = head <-> N1 <-> N2 <-> tail
                 LRU    MRU
```

### `get(1)`

Map tìm `N1` ngay. `moveToMostRecent(N1)` tháo N1 rồi chèn trước tail:

```text
list = head <-> N2 <-> N1 <-> tail
                 LRU    MRU
```

### `put(3, 30)`

Chèn N3 thành MRU:

```text
head <-> N2 <-> N1 <-> N3 <-> tail
```

Size = 3 > capacity = 2, nên victim là:

```text
head.next = N2
```

Xóa N2 khỏi list **và** map:

```text
map  = {1 -> N1, 3 -> N3}
list = head <-> N1 <-> N3 <-> tail
```

Đây chính là LRU behavior mong muốn.

---

## 9. Vì sao cấu trúc này đúng?

Ta giữ hai invariant:

1. Map chứa đúng một entry cho mỗi real node trong list và trỏ đúng node đó.
2. List luôn có thứ tự từ least recent sau `head` tới most recent trước `tail`.

Mọi `get`/update thành công gọi `moveToMostRecent`, nên node vừa dùng luôn về cuối recency order. Node mới cũng được chèn ở MRU. Vì vậy khi size vượt capacity, `head.next` chắc chắn là key lâu nhất chưa được dùng.

Mọi insertion/lookup/removal chỉ dùng map lookup hoặc một số cố định pointer writes, nên không có scan tuyến tính.

---

## 10. Complexity

```text
get: average O(1)
put: average O(1)
space: O(capacity)
```

HashMap là average `O(1)`; linked-list operations là worst-case `O(1)` khi đã có node reference.

---

## 11. Lỗi thường gặp và dấu hiệu nhận dạng

Lỗi hay gặp:

- `get` thành công nhưng quên move node thành MRU.
- update existing key tạo node mới thay vì update/move node cũ.
- eviction xóa khỏi list nhưng quên `cache.remove(lru.key)` hoặc ngược lại.
- dùng singly linked list: biết victim thì vẫn khó xóa node bất kỳ `O(1)` vì thiếu `prev`.
- không dùng sentinels và để hàng loạt special case head/tail làm pointer code dễ lỗi.
- chèn node sai phía khiến `head.next` không còn là LRU.

Pattern transfer:

> Khi một bài vừa cần lookup theo key `O(1)`, vừa cần duy trì một thứ tự có thể move/remove node `O(1)`, hãy nghĩ tới **map + linked structure**, và xác định rõ invariant đồng bộ giữa hai representation trước khi code.
