# Solution / Lời giải — 86. Partition List

## 1. Core idea / Ý tưởng chính

Ta cần partition theo `x` nhưng **không được làm thay đổi thứ tự tương đối** trong mỗi nhóm. Vì vậy thay vì swap hoặc sort, ta duyệt list đúng một lần và append mỗi node vào một trong hai linked list tạm:

- `less`: các node có `val < x`.
- `greater`: các node có `val >= x`.

Cuối cùng nối `less` với `greater`.

## 2. Algorithm / Thuật toán

1. Tạo `lessDummy`, `greaterDummy` và hai tail tương ứng.
2. Duyệt `current` qua original list:
   - nếu `current.val < x`, append vào `lessTail`;
   - ngược lại append vào `greaterTail`.
3. Đặt `greaterTail.next = null` để loại bỏ mọi liên kết cũ còn sót.
4. Nối `lessTail.next = greaterDummy.next`.
5. Return `lessDummy.next`.

## 3. Why it works / Vì sao đúng

Mỗi node được đưa vào đúng một partition dựa trên điều kiện `val < x`. Vì ta luôn append vào tail theo thứ tự duyệt từ trái sang phải, thứ tự tương đối giữa các node trong cùng partition không đổi. Sau khi duyệt hết, nối partition `< x` trước partition `>= x` đảm bảo mọi node nhỏ hơn `x` đứng trước mọi node còn lại. Không node nào bị mất hoặc tạo mới.

## 4. Dry run / Chạy thử

Với:

```text
head = [1,4,3,2,5,2], x = 3
```

Trong lúc duyệt:

```text
less:    1 -> 2 -> 2
greater: 4 -> 3 -> 5
```

Nối lại:

```text
1 -> 2 -> 2 -> 4 -> 3 -> 5
```

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public ListNode partition(ListNode head, int x) {
        ListNode lessDummy = new ListNode(0);
        ListNode greaterDummy = new ListNode(0);
        ListNode lessTail = lessDummy;
        ListNode greaterTail = greaterDummy;

        ListNode current = head;
        while (current != null) {
            if (current.val < x) {
                lessTail.next = current;
                lessTail = current;
            } else {
                greaterTail.next = current;
                greaterTail = current;
            }
            current = current.next;
        }

        greaterTail.next = null;
        lessTail.next = greaterDummy.next;
        return lessDummy.next;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)`.
- **Extra space:** `O(1)` vì reuse các node input; chỉ dùng dummy nodes và vài pointer.

## 7. Edge cases / Trường hợp biên

- Empty list.
- Tất cả node `< x`.
- Tất cả node `>= x`.
- Các node bằng `x` phải thuộc partition thứ hai.
- Nhiều value lặp quanh pivot.

## 8. Common mistakes / Lỗi thường gặp

- Sort lại list, làm mất yêu cầu stable relative order.
- Insert vào head của partition khiến thứ tự trong nhóm bị đảo.
- Quên `greaterTail.next = null`, để lại liên kết cũ và có thể tạo cycle.
- Dùng `<= x` thay vì `< x` cho partition đầu.
