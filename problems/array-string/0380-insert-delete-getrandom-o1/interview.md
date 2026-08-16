# 380. Insert Delete GetRandom O(1) — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I combine a dynamic array with a hash map from value to array index. The array gives `O(1)` random access, and the map gives average `O(1)` membership and index lookup. To remove an arbitrary value without shifting the array, I move the last array element into the removed slot, update that element's index in the map, and pop the tail. Because each set element occupies exactly one array position, choosing a uniform random index also chooses a uniform random element.

**VI:** Em kết hợp dynamic array với hash map `value -> index`. Array cho random access `O(1)`, map cho membership/index lookup average `O(1)`. Để xóa arbitrary value mà không shift, em đưa phần tử cuối vào slot cần xóa, cập nhật index của phần tử đó trong map rồi pop tail. Vì mỗi set element chiếm đúng một vị trí trong array, chọn uniform random index cũng cho uniform random element.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why do you need both a hash map and an array?

**Q (VI):** Vì sao cần cả hash map và array?

### Short answer (EN)

The map gives constant-average membership/index lookup; the array gives constant-time random indexing.

### Trả lời ngắn (VI)

Map cho membership/index lookup trung bình hằng số; array cho random indexing hằng số.

### Standard answer (EN)

A hash set alone cannot efficiently select a uniform element by index, while an array alone cannot find and remove an arbitrary value without a search or shift. The map tells me exactly where a value is in the dense array, so the two structures complement each other.

### Trả lời chuẩn (VI)

Hash set một mình không chọn phần tử uniform theo index hiệu quả; array một mình không tìm/xóa arbitrary value mà không search hoặc shift. Map chỉ đúng vị trí value trong dense array, nên hai cấu trúc bù điểm yếu cho nhau.

### Deep answer (EN)

The requirement combines two incompatible access patterns if handled by one ordinary container: key-based access and index-based random access. The map is the key-to-position indirection layer, while the dense array is the position space over which uniform random sampling is trivial.

### Trả lời sâu (VI)

Yêu cầu kết hợp hai access pattern khó đạt đồng thời trong một container thông thường: truy cập theo key và random access theo index. Map là lớp ánh xạ key sang position, còn dense array là không gian position nơi uniform sampling rất đơn giản.

---

### Q2

**Q (EN):** How do you remove in average `O(1)` without shifting elements?

**Q (VI):** Làm sao xóa average `O(1)` mà không shift?

### Short answer (EN)

Swap or overwrite the removed slot with the last value, update its map index, then remove the array tail.

### Trả lời ngắn (VI)

Đưa last value vào slot cần xóa, cập nhật index của nó trong map, rồi xóa tail.

### Standard answer (EN)

The map gives the removed value's index. I copy the last array value into that slot, point the last value's map entry to the new index, pop the final array position, and remove the deleted value from the map. All of those are constant-average operations.

### Trả lời chuẩn (VI)

Map cho index của value cần xóa. Em copy last value vào slot đó, cập nhật mapping của last value sang index mới, pop vị trí cuối và xóa mapping của value cũ. Tất cả đều average constant time.

---

### Q3

**Q (EN):** Why is `getRandom()` uniform?

**Q (VI):** Vì sao `getRandom()` uniform?

### Short answer (EN)

Each set value appears exactly once in the array, and every array index is chosen with equal probability.

### Trả lời ngắn (VI)

Mỗi set value xuất hiện đúng một lần trong array và mọi index được chọn với cùng xác suất.

### Standard answer (EN)

For a set of size `n`, the array has exactly `n` occupied positions and a one-to-one mapping from positions to values. `nextInt(n)` selects each position with probability `1/n`, so each value is also selected with probability `1/n`.

### Trả lời chuẩn (VI)

Với set size `n`, array có đúng `n` vị trí occupied và mapping một-một giữa position và value. `nextInt(n)` chọn mỗi position xác suất `1/n`, nên mỗi value cũng xác suất `1/n`.

---

### Q4

**Q (EN):** What happens when the removed element is already the last element?

**Q (VI):** Nếu phần tử cần xóa chính là phần tử cuối thì sao?

### Short answer (EN)

The same code still works; it overwrites the value with itself and then removes the tail and map entry.

### Trả lời ngắn (VI)

Cùng code vẫn đúng; value tự ghi đè chính nó rồi tail và mapping bị xóa.

### Standard answer (EN)

`removeIndex == lastIndex` and `lastValue == val`. Updating the last value's mapping is temporarily redundant, but the final `indexByValue.remove(val)` removes it. No special branch is required.

### Trả lời chuẩn (VI)

Khi đó `removeIndex == lastIndex` và `lastValue == val`. Việc update mapping chỉ là dư tạm thời; lệnh `remove(val)` cuối xóa nó. Không cần branch riêng.

---

### Q5

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

Average `O(1)` for insert and remove, `O(1)` for getRandom, and `O(n)` space.

### Trả lời ngắn (VI)

Insert/remove average `O(1)`, getRandom `O(1)`, space `O(n)`.

### Standard answer (EN)

Hash-map operations are average `O(1)`, appending and removing the tail of an ArrayList are amortized `O(1)`, and indexed access is `O(1)`. The two structures store linear total state.

### Trả lời chuẩn (VI)

HashMap operations average `O(1)`, append/remove tail của ArrayList amortized `O(1)`, indexed access `O(1)`. Hai cấu trúc dùng tổng state tuyến tính.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** How would you support duplicates?

**Q (VI):** Nếu cần hỗ trợ duplicate thì sao?

**EN:** A value can no longer map to one index. I would map each value to a set of indices, keep the dense array, and carefully update one stored index when swapping with the last element. This is the idea behind RandomizedCollection.

**VI:** Khi có duplicate, một value không còn map tới một index duy nhất. Em sẽ map value tới một set các indices, vẫn giữ dense array và cập nhật index tương ứng khi swap last element. Đây là ý tưởng của RandomizedCollection.

### Follow-up 2

**Q (EN):** Can `HashSet` alone satisfy the requirement?

**Q (VI):** Chỉ dùng `HashSet` có được không?

**EN:** Not with `O(1)` uniform random selection using the standard API. To choose an arbitrary set element uniformly, I would need to traverse or copy elements, which is linear.

**VI:** Không với standard API nếu cần uniform random `O(1)`. Muốn chọn một set element ngẫu nhiên thường phải duyệt hoặc copy, thành tuyến tính.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through `remove`?

**Q (VI):** Bạn có thể giải thích hàm `remove` không?

**EN:** I look up the target index in the map. If absent, I return false. Otherwise I read the last array value, write it into the target slot, update the last value's map entry, pop the array tail, delete the target's map entry, and return true. This keeps the array dense and every remaining map index correct.

**VI:** Em lookup target index trong map; nếu không có thì `false`. Nếu có, em lấy last value, ghi vào target slot, cập nhật mapping của last value, pop tail, xóa mapping target rồi trả `true`. Như vậy array luôn dense và mọi map index còn lại đều đúng.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Dùng ArrayList.remove(index) giữa list và vô tình `O(n)`.
- Quên update mapping của last value sau overwrite.
- Nói `HashSet` hỗ trợ random access `O(1)`.
- Không chứng minh uniformity.
- Không phân biệt worst-case hash complexity với average complexity mà đề yêu cầu.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- dynamic array — mảng động
- dense array — mảng không có lỗ trống
- value-to-index mapping — ánh xạ value sang index
- swap with last — đổi với phần tử cuối
- arbitrary removal — xóa phần tử bất kỳ
- uniform probability — xác suất đồng đều
- amortized — khấu hao
- average-case complexity — độ phức tạp trung bình
