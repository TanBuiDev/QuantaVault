# 380. Insert Delete GetRandom O(1) — Solution

## 1. Core idea / Ý tưởng cốt lõi

Không có một cấu trúc Java built-in đơn lẻ nào đồng thời cho ta:

```text
membership lookup  -> average O(1)
insert             -> average O(1)
remove arbitrary   -> average O(1)
uniform random     -> O(1)
```

Ta kết hợp:

```text
ArrayList<Integer> values
HashMap<Integer, Integer> indexByValue
```

- `HashMap`: tìm value và index của nó trong average `O(1)`.
- `ArrayList`: truy cập một random index trong `O(1)`.
- Xóa giữa list bằng **swap with last**, nên không shift.

---

## 2. Data-structure invariant / Bất biến cấu trúc

Sau mọi operation:

```text
values chứa mỗi phần tử của set đúng một lần
indexByValue.get(value) == vị trí thực của value trong values
values.size() == indexByValue.size()
```

Giữ invariant này là toàn bộ cốt lõi của bài.

---

## 3. Insert

Nếu map đã có `val`, trả `false`.

Nếu chưa:

```java
indexByValue.put(val, values.size());
values.add(val);
```

Append vào cuối `ArrayList` là amortized `O(1)` và put vào hash map là average `O(1)`.

---

## 4. Remove — swap with last

Đây là phần khó nhất.

Giả sử:

```text
values = [10, 20, 30, 40]
remove(20)
```

Nếu gọi `values.remove(1)`, ArrayList phải shift `30` và `40`, tốn `O(n)`.

Thay vào đó:

```text
removeIndex = 1
lastValue = 40

[10, 20, 30, 40]
     ^          ^
```

Ghi `40` vào index 1:

```text
[10, 40, 30, 40]
```

Cập nhật map:

```text
40 -> 1
```

Rồi xóa phần tử cuối:

```text
[10, 40, 30]
```

Cuối cùng xóa mapping của `20`.

Không có phần tử nào phải shift.

---

## 5. Why removing the last value also works

Nếu `val` chính là phần tử cuối:

```text
lastValue == val
removeIndex == lastIndex
```

Ta set phần tử cuối bằng chính nó, cập nhật mapping tạm thời rồi remove cuối và remove mapping `val`. Kết quả vẫn đúng. Không cần branch đặc biệt.

---

## 6. GetRandom and uniformity

Vì mỗi set value xuất hiện **đúng một lần** trong `values`, và:

```java
random.nextInt(values.size())
```

chọn mỗi index với cùng xác suất, nên mỗi value cũng có cùng xác suất được trả về.

Đây là lý do `ArrayList` là thành phần cần thiết; iteration order của `HashSet` không cung cấp random access theo index trong `O(1)`.

---

## 7. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

class RandomizedSet {
    private final List<Integer> values;
    private final Map<Integer, Integer> indexByValue;
    private final Random random;

    public RandomizedSet() {
        values = new ArrayList<>();
        indexByValue = new HashMap<>();
        random = new Random();
    }

    public boolean insert(int val) {
        if (indexByValue.containsKey(val)) {
            return false;
        }

        // List cho random access O(1), còn map phải luôn lưu đúng index của value
        // trong list; append ở cuối giữ cả hai cấu trúc đồng bộ với amortized O(1).
        indexByValue.put(val, values.size());
        values.add(val);
        return true;
    }

    public boolean remove(int val) {
        Integer removeIndex = indexByValue.get(val);
        if (removeIndex == null) {
            return false;
        }

        int lastIndex = values.size() - 1;
        int lastValue = values.get(lastIndex);

        // Xóa trực tiếp giữa ArrayList sẽ phải shift O(n). Đưa lastValue vào lỗ trống
        // rồi xóa tail biến deletion thành O(1), nhưng phải sửa map trước khi bỏ tail.
        values.set(removeIndex, lastValue);
        indexByValue.put(lastValue, removeIndex);

        values.remove(lastIndex);
        indexByValue.remove(val);
        return true;
    }

    public int getRandom() {
        // Mỗi set member xuất hiện đúng một lần trong dense list, nên uniform random
        // index cũng chính là uniform random value mà không cần duyệt HashMap.
        return values.get(random.nextInt(values.size()));
    }
}
```

---

## 8. Complexity

### `insert`

```text
Average: O(1)
```

`ArrayList.add` amortized `O(1)`, `HashMap` average `O(1)`.

### `remove`

```text
Average: O(1)
```

Map lookup/update + constant-number list accesses/removal at end.

### `getRandom`

```text
O(1)
```

Random index + `ArrayList.get`.

### Space

```text
O(n)
```

List và map cùng lưu `n` phần tử/mapping.

---

## 9. Correctness / Vì sao đúng

- `insert` chỉ append value chưa tồn tại và ghi đúng index, nên invariant được giữ.
- `remove` thay slot bị xóa bằng last value và cập nhật mapping của last value trước khi bỏ tail; mọi value còn lại vẫn có đúng một slot và đúng mapping.
- `getRandom` chọn uniform index trên list chứa một bản sao của mỗi set member, nên chọn uniform member.

Do đó cả semantics của set lẫn yêu cầu random đều đúng.

---

## 10. Edge cases

- Insert value đã tồn tại → `false`.
- Remove value không tồn tại → `false`.
- Remove phần tử cuối list.
- Remove phần tử giữa list rồi tiếp tục remove phần tử đã swap vào.
- Set chỉ có một phần tử: `getRandom()` luôn trả phần tử đó.

---

## 11. Common mistakes

1. Chỉ dùng `HashSet` rồi cố chọn random element bằng iteration → không `O(1)`.
2. Chỉ dùng `ArrayList` rồi remove giữa → `O(n)`.
3. Swap last value nhưng quên cập nhật index của nó trong map.
4. Xóa mapping `val` trước khi lấy `removeIndex`.
5. Dùng random theo value range thay vì random theo occupied indices.

---

## 12. Pattern recognition

**Hash map + dense array + swap-with-last** là pattern rất mạnh khi cần:

```text
insert / delete / membership + random access
```

với average `O(1)`.
