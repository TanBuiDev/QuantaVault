# Solution / Lời giải — 141. Linked List Cycle

## 1. Core idea / Ý tưởng chính

Bài toán hỏi liệu khi liên tục đi theo `next`, ta có quay lại một **node object** đã từng đi qua hay không.

Cách trực tiếp là dùng `HashSet<ListNode>` để lưu các node đã thăm. Cách đó chạy `O(n)` nhưng dùng `O(n)` memory.

Follow-up yêu cầu constant memory, nên hướng tối ưu là **Floyd's Cycle Detection** (slow/fast pointers):

- `slow` đi 1 bước.
- `fast` đi 2 bước.
- Nếu không có cycle, `fast` sẽ chạm `null`.
- Nếu có cycle, sau khi cả hai vào vòng, khoảng cách giữa chúng thay đổi modulo độ dài cycle và `fast` cuối cùng sẽ gặp `slow`.

---

## 2. Algorithm / Thuật toán

1. Khởi tạo `slow = head`, `fast = head`.
2. Trong khi `fast != null && fast.next != null`:
   - `slow = slow.next`.
   - `fast = fast.next.next`.
   - Nếu `slow == fast`, return `true`.
3. Nếu vòng lặp kết thúc vì `fast` hoặc `fast.next` là `null`, return `false`.

Điều quan trọng là so sánh **node reference**, không so sánh `val`.

---

## 3. Why it works / Vì sao đúng

### Case A — No cycle / Không có cycle

Một linked list không cycle có một đường đi hữu hạn từ `head` tới `null`. `fast` tiến hai cạnh mỗi vòng lặp nên chắc chắn cuối cùng sẽ gặp `null` hoặc node có `next = null`. Khi đó không thể tồn tại node nào được quay lại, nên trả `false` là đúng.

### Case B — Cycle exists / Có cycle

Giả sử cycle dài `C` node. Sau một số bước, cả `slow` và `fast` đều nằm trong cycle. Mỗi iteration:

- `slow` tiến thêm `1` vị trí modulo `C`.
- `fast` tiến thêm `2` vị trí modulo `C`.

Do đó khoảng cách tương đối của `fast` so với `slow` tăng `1` modulo `C` mỗi iteration. Có đúng `C` trạng thái khoảng cách khả dĩ, vì vậy sau nhiều nhất `C` iteration trong cycle, khoảng cách sẽ bằng `0`. Khi đó `slow == fast`, nên thuật toán phát hiện cycle.

Vì hai trường hợp bao phủ toàn bộ input, thuật toán luôn trả kết quả đúng.

---

## 4. Dry run / Chạy thử

Với:

```text
head = [3,2,0,-4], pos = 1
```

Ta có liên kết:

```text
3 -> 2 -> 0 -> -4
     ^          |
     |__________|
```

Bắt đầu:

```text
slow = 3
fast = 3
```

Sau iteration 1:

```text
slow = 2
fast = 0
```

Sau iteration 2:

```text
slow = 0
fast = 2
```

Sau iteration 3:

```text
slow = -4
fast = -4
```

`slow == fast` nên return `true`.

---

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                return true;
            }
        }

        return false;
    }
}
```

`ListNode` là type do LeetCode cung cấp trong execution environment, nên không cần định nghĩa lại trong submission.

---

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(1)`.

Ở trường hợp có cycle, số bước trước khi gặp nhau vẫn bị chặn tuyến tính theo số node reachable từ `head`.

---

## 7. Alternative approach — HashSet

Có thể làm như sau:

```text
visited = empty set
current = head
while current != null:
    if current already in visited:
        return true
    add current to visited
    current = current.next
return false
```

### Trade-off

- Dễ nghĩ và dễ chứng minh.
- Time vẫn `O(n)` trung bình.
- Nhưng cần `O(n)` extra memory, nên không đáp ứng follow-up tốt bằng Floyd.

---

## 8. Edge cases / Trường hợp biên

- `head = null` → `false`.
- Một node, `next = null` → `false`.
- Một node, `next` trỏ chính nó → `true`.
- Hai node tạo cycle → `true`.
- Danh sách dài không cycle → `fast` chạm `null`.
- Nhiều node có cùng `val` nhưng khác reference → không được coi là cycle chỉ vì value lặp.

---

## 9. Common mistakes / Lỗi thường gặp

- So sánh `slow.val == fast.val` thay vì `slow == fast`.
- Chỉ check `fast != null` nhưng vẫn gọi `fast.next.next`, gây `NullPointerException`.
- Di chuyển `fast` một bước thay vì hai bước, khiến hai pointer luôn giữ cùng khoảng cách.
- Dùng `HashSet<Integer>` chứa value thay vì chứa node reference.
- Nghĩ `pos` là argument của `hasCycle`; thực tế LeetCode chỉ dùng `pos` để mô tả cách tạo testcase.
