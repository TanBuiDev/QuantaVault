# Solution / Lời giải — 61. Rotate List

## 1. Core idea / Ý tưởng chính

Nếu list dài `n`, xoay phải `n` lần không thay đổi list. Vì vậy rotation thực tế chỉ là `k %= n`.

Sau khi xoay phải `k` vị trí, suffix dài `k` node trở thành prefix mới. Tương đương new tail nằm sau `n-k-1` cạnh tính từ old head, và node ngay sau nó là new head.

Cách gọn nhất là nối old tail về old head thành một cycle tạm, đi tới new tail rồi cắt cycle.

## 2. Algorithm / Thuật toán

1. Nếu `head == null`, `head.next == null` hoặc `k == 0`, return `head`.
2. Duyệt list để tìm `tail` và length `n`.
3. `k %= n`; nếu `k == 0`, return `head`.
4. Nối `tail.next = head` để tạo cycle.
5. Số bước từ old head tới new tail là `n - k - 1`.
6. Đi tới `newTail`.
7. `newHead = newTail.next`.
8. Cắt cycle: `newTail.next = null`.
9. Return `newHead`.

## 3. Why it works / Vì sao đúng

Một right rotation `k` đưa chính xác `k` node cuối lên trước `n-k` node đầu mà không thay đổi thứ tự bên trong hai phần. Trong cycle tạm, đi `n-k-1` bước từ old head tới node cuối của prefix cũ. Node kế tiếp chính là node đầu của suffix cần đưa lên trước. Cắt cạnh sau new tail biến cycle thành thứ tự `suffix -> old prefix`, đúng kết quả rotate.

## 4. Dry run / Chạy thử

Với `[1,2,3,4,5]`, `k=2`:

```text
n = 5
k = 2
new tail index = n-k-1 = 2 => node 3
new head = node 4
```

Tạo cycle:

```text
1 -> 2 -> 3 -> 4 -> 5 -> 1
```

Cắt sau `3`:

```text
4 -> 5 -> 1 -> 2 -> 3
```

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null || k == 0) {
            return head;
        }

        int length = 1;
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
            length++;
        }

        k %= length;
        if (k == 0) {
            return head;
        }

        tail.next = head;

        int stepsToNewTail = length - k - 1;
        ListNode newTail = head;
        for (int i = 0; i < stepsToNewTail; i++) {
            newTail = newTail.next;
        }

        ListNode newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(1)`.

## 7. Edge cases / Trường hợp biên

- Empty list.
- Một node.
- `k = 0`.
- `k` là bội số của `n`.
- `k > n`, kể cả rất lớn.
- `k = 1`.

## 8. Common mistakes / Lỗi thường gặp

- Không dùng `k % n`, dẫn tới làm thừa hoặc time phụ thuộc `k` rất lớn.
- Off-by-one khi tìm new tail.
- Tạo cycle nhưng quên cắt lại.
- Tính new head trước/sau khi thay đổi pointer sai thứ tự.
- Rotate từng bước một làm complexity thành `O(k*n)`.
