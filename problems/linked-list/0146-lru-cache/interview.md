# 146. LRU Cache — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I combine a HashMap with a doubly linked list. The map gives `O(1)` average lookup from key to node, while the list stores keys from least to most recently used. Every successful `get` and every `put` moves its node to the MRU end. When capacity is exceeded, I remove the node at the LRU end and delete its key from the map. Sentinel head and tail nodes keep all list operations constant-time and uniform.

**VI:** Em kết hợp HashMap với doubly linked list. Map tìm node theo key trong `O(1)` trung bình; list lưu thứ tự LRU → MRU. Mỗi `get` thành công hoặc `put` đều đưa node về MRU; khi vượt capacity thì xóa node LRU.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why do you need both a HashMap and a doubly linked list?

**Q (VI):** Vì sao cần cả HashMap lẫn doubly linked list?

### Short answer (EN)

The map provides constant-time lookup; the list provides constant-time recency updates and LRU eviction.

### Trả lời ngắn (VI)

Map cho lookup `O(1)`; doubly linked list cho move/evict theo recency trong `O(1)`.

### Standard answer (EN)

A hash table alone cannot identify the least recently used key in constant time, while a linked list alone cannot find an arbitrary key in constant time. Mapping keys directly to list nodes combines the strengths of both structures and lets every required operation avoid scanning.

### Trả lời chuẩn (VI)

HashMap một mình không tìm LRU trong `O(1)`, còn linked list một mình không lookup key tùy ý trong `O(1)`. Map `key -> node` kết hợp hai ưu điểm và loại bỏ việc scan.

### Q2

**Q (EN):** Why must the list be doubly linked rather than singly linked?

**Q (VI):** Vì sao dùng doubly linked list thay vì singly linked list?

### Short answer (EN)

Given a node reference, removing it in `O(1)` requires access to its predecessor.

### Trả lời ngắn (VI)

Muốn xóa node bất kỳ trong `O(1)` khi đã có reference thì cần biết predecessor.

### Standard answer (EN)

The map gives us the exact node to move. In a singly linked list we would still need to find that node's predecessor, which can take linear time. A doubly linked node stores `prev`, so detach and reinsert are both constant-time.

### Trả lời chuẩn (VI)

Map đã cho exact node nhưng singly list vẫn phải tìm node trước nó. Doubly list có `prev`, nên detach/reinsert đều `O(1)`.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What invariant does the doubly linked list maintain?

**Q (VI):** Doubly linked list duy trì invariant gì?

### Short answer (EN)

Nodes are ordered from least recently used after `head` to most recently used before `tail`.

### Trả lời ngắn (VI)

Node được sắp theo recency từ LRU ngay sau `head` tới MRU ngay trước `tail`.

### Standard answer (EN)

Whenever a key is accessed or written, its node is removed from its old position and appended immediately before the tail, making it the most recent. No other node changes relative recency. Therefore `head.next` always represents the least recently used live key.

### Trả lời chuẩn (VI)

Mỗi lần key được dùng, node của nó được chuyển về trước `tail`; relative recency của các node khác không đổi. Vì vậy `head.next` luôn là LRU key hiện tại.

### Q4

**Q (EN):** Why does updating an existing key also move it to the MRU position?

**Q (VI):** Vì sao `put` cập nhật key cũ cũng phải đưa key đó thành MRU?

### Short answer (EN)

A write is a use of the key, so it resets that key's recency.

### Trả lời ngắn (VI)

Ghi/update cũng là một lần sử dụng key nên phải refresh recency.

### Standard answer (EN)

The cache policy tracks the most recent operation involving a key, not only reads. Updating an existing entry is an access to that entry, so failing to move it would make future eviction order inconsistent with LRU semantics.

### Trả lời chuẩn (VI)

LRU theo dõi lần sử dụng gần nhất, không chỉ read. Update một entry là một access, nên nếu không move thì thứ tự eviction sau đó sẽ sai.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5

**Q (EN):** How do `get` and `put` achieve `O(1)` average time?

**Q (VI):** Vì sao `get` và `put` đạt `O(1)` average?

### Short answer (EN)

HashMap lookup is `O(1)` average, and every doubly linked list detach/append operation is `O(1)`.

### Trả lời ngắn (VI)

HashMap lookup trung bình `O(1)` và các thao tác remove/append trên doubly list đều `O(1)`.

### Standard answer (EN)

Neither operation scans the cache. A map lookup finds the node directly, and the node's `prev` and `next` references allow constant-time removal. Sentinel endpoints allow constant-time insertion and eviction as well. Hash table operations are average constant time, so the complete operations meet the requirement.

### Trả lời chuẩn (VI)

Không thao tác nào scan cache. Map tìm node trực tiếp; `prev/next` cho remove `O(1)`; sentinel cho insert/evict `O(1)`. Vì map là average `O(1)`, toàn bộ API đạt yêu cầu.

### Q6

**Q (EN):** What is the space complexity?

**Q (VI):** Space complexity là bao nhiêu?

### Short answer (EN)

`O(capacity)`.

### Trả lời ngắn (VI)

`O(capacity)`.

### Standard answer (EN)

At most `capacity` live cache nodes are stored, and the map stores one entry per live node. The two sentinels are constant overhead, so space is linear in the configured capacity.

### Trả lời chuẩn (VI)

Cache giữ tối đa `capacity` node và map có một entry cho mỗi node; hai sentinel chỉ là constant overhead.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q7

**Q (EN):** What happens when capacity is one?

**Q (VI):** Capacity bằng 1 thì sao?

### Short answer (EN)

Every insertion of a new key evicts the only previous key.

### Trả lời ngắn (VI)

Mỗi lần thêm key mới sẽ evict key cũ duy nhất.

### Standard answer (EN)

The same general logic handles it: after inserting a second distinct key, the map size becomes two, `head.next` is the old entry, and eviction removes it. No special case is needed because of the sentinel list.

### Trả lời chuẩn (VI)

Logic chung vẫn đúng: thêm key mới làm size vượt 1, `head.next` là entry cũ và bị evict; sentinel giúp không cần special case.

---

## 6. Alternative approach / Hướng khác

### Q8

**Q (EN):** Could you use Java's LinkedHashMap?

**Q (VI):** Có thể dùng `LinkedHashMap` không?

### Short answer (EN)

Yes in production code, but interviews often expect you to design the underlying LRU structure yourself.

### Trả lời ngắn (VI)

Có trong code thực tế, nhưng interview thường muốn tự thiết kế cấu trúc LRU.

### Standard answer (EN)

`LinkedHashMap` supports access ordering and can implement an LRU cache compactly. However, using HashMap plus a custom doubly linked list demonstrates the required data-structure reasoning and makes the `O(1)` operations explicit.

### Trả lời chuẩn (VI)

`LinkedHashMap` có access-order và rất tiện trong production, nhưng HashMap + custom doubly list thể hiện rõ reasoning và cơ chế `O(1)` mà bài phỏng vấn muốn kiểm tra.

---

## 7. Common interviewer traps / Bẫy thường gặp

- `get` không refresh recency.
- `put` update key cũ không refresh recency.
- Evict khỏi list nhưng quên xóa map entry.
- Thêm key cũ như node mới làm size sai.
- Dùng singly linked list khiến remove arbitrary node thành `O(n)`.
- Không dùng sentinel và phát sinh nhiều bug ở head/tail.

## 8. Useful vocabulary / Từ vựng hữu ích

- **least recently used / most recently used** — ít / nhiều được dùng gần đây nhất.
- **eviction policy** — chính sách loại bỏ cache.
- **access order** — thứ tự truy cập.
- **sentinel node** — node canh gác/giả.
- **detach and append** — tháo node và nối lại cuối.
- **cache hit / cache miss** — tìm thấy / không tìm thấy trong cache.
