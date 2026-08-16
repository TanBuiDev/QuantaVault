# Solution / Lời giải — 138. Copy List with Random Pointer

## 1. Core idea / Ý tưởng chính

Khó khăn của bài không nằm ở `next`, mà ở `random`: khi copy một node, ta cần biết node copy tương ứng với `original.random` là node nào.

Cách phổ biến dùng `HashMap<Node, Node>` để map original → copy, nhưng tốn `O(n)` memory.

Ta có thể lưu mapping **ngay trong linked list** bằng cách chèn copy node ngay sau original node:

```text
A -> B -> C
```

trở thành:

```text
A -> A' -> B -> B' -> C -> C'
```

Lúc này copy của bất kỳ original node `X` luôn là `X.next`.

---

## 2. Three-pass algorithm / Thuật toán 3 lượt

### Pass 1 — Interleave copies

Với mỗi original node `current`:

1. Tạo `copy = new Node(current.val)`.
2. `copy.next = current.next`.
3. `current.next = copy`.
4. Tiến tới original kế tiếp bằng `current = copy.next`.

### Pass 2 — Assign random pointers

Với mỗi original node `current`:

```text
copy = current.next
copy.random = current.random == null ? null : current.random.next
```

Vì `current.random.next` chính là copy của random target.

### Pass 3 — Separate lists

Tách chain xen kẽ:

- restore `original.next` về original kế tiếp;
- nối `copy.next` tới copy kế tiếp.

Trả về head của copied list.

---

## 3. Why it works / Vì sao đúng

### After pass 1

Mỗi original node `X` có đúng một copied node `X'` ngay sau nó. Vì vậy tồn tại mapping trực tiếp:

```text
copy(X) = X.next
```

### After pass 2

Nếu `X.random = R`, ta đặt:

```text
X'.random = R.next
```

Mà `R.next = R'`, nên random pointer của copy trỏ đúng copied target tương ứng. Nếu `X.random = null`, `X'.random` cũng là `null`.

### After pass 3

Ta chỉ tháo các cạnh xen kẽ đã thêm ở pass 1:

- original nodes nối lại đúng như trước;
- copied nodes nối lại theo đúng thứ tự tương ứng.

Random pointers của copied nodes đã trỏ giữa các copied nodes và không phụ thuộc vào interleaving nữa. Do đó ta thu được một deep copy hoàn chỉnh, đồng thời original list được phục hồi.

---

## 4. Dry run / Chạy thử

Giả sử:

```text
A.random = C
B.random = A
C.random = null
```

### Pass 1

```text
A -> A' -> B -> B' -> C -> C'
```

### Pass 2

```text
A'.random = A.random.next = C.next = C'
B'.random = B.random.next = A.next = A'
C'.random = null
```

### Pass 3

```text
Original: A -> B -> C
Copy:     A' -> B' -> C'
```

Copy giữ cùng cấu trúc `next/random`, nhưng mọi node đều là object mới.

---

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) {
            return null;
        }

        Node current = head;
        while (current != null) {
            Node copy = new Node(current.val);
            copy.next = current.next;
            current.next = copy;
            current = copy.next;
        }

        current = head;
        while (current != null) {
            Node copy = current.next;
            copy.random = current.random == null ? null : current.random.next;
            current = copy.next;
        }

        Node copiedHead = head.next;
        current = head;
        while (current != null) {
            Node copy = current.next;
            Node nextOriginal = copy.next;

            current.next = nextOriginal;
            copy.next = nextOriginal == null ? null : nextOriginal.next;

            current = nextOriginal;
        }

        return copiedHead;
    }
}
```

---

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` — ba lượt tuyến tính.
- **Auxiliary space:** `O(1)` nếu không tính `n` copied nodes bắt buộc của output.
- **Output space:** `O(n)`.

---

## 7. Alternative — HashMap

Một hướng dễ hiểu hơn:

1. Pass 1: tạo copy cho từng original và lưu `map.put(original, copy)`.
2. Pass 2: `copy.next = map.get(original.next)` và `copy.random = map.get(original.random)`.

### Trade-off

- Logic ngắn, ít pointer manipulation hơn.
- Time `O(n)` trung bình.
- Extra space `O(n)` cho map.

Trong interview, HashMap thường là hướng đầu tiên tốt; sau đó optimize sang interleaving khi được hỏi giảm space.

---

## 8. Edge cases / Trường hợp biên

- `head = null`.
- Một node với `random = null`.
- Một node có `random` trỏ chính nó.
- Tất cả random đều `null`.
- Nhiều node random trỏ cùng một target.
- Random pointer trỏ backward/forward bất kỳ.
- Các node có value giống nhau: mapping phải dựa vào identity, không dựa vào value.

---

## 9. Common mistakes / Lỗi thường gặp

- Chỉ copy `next` mà quên `random`.
- Cho copied `random` trỏ vào original node — không còn là deep copy.
- Dùng `Node.val` làm key; value không unique.
- Sau interleaving, advance `current = current.next` thay vì bỏ qua copy để tới original tiếp theo.
- Tách list nhưng không restore original `next`.
- Tính `O(n)` copied nodes bắt buộc là auxiliary memory mà không nói rõ convention.
