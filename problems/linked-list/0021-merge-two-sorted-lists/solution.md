# Solution / Lời giải — 21. Merge Two Sorted Lists

## 1. Core idea / Ý tưởng chính

Đây là thao tác merge giống bước merge của Merge Sort. Vì hai linked list đều sorted, tại mọi thời điểm node nhỏ nhất chưa xử lý chỉ có thể là head hiện tại của `list1` hoặc `list2`.

Ta dùng `tail` trỏ vào cuối result và luôn nối node có value nhỏ hơn. Các node input được **reuse**, không cần tạo bản sao.

---

## 2. Algorithm / Thuật toán

1. Tạo `dummy` và `tail = dummy`.
2. Trong khi cả `list1` và `list2` đều khác `null`:
   - Nếu `list1.val <= list2.val`, nối `list1` vào `tail` rồi advance `list1`.
   - Ngược lại nối `list2` rồi advance `list2`.
   - Advance `tail`.
3. Khi một list hết, nối thẳng list còn lại vào `tail.next`.
4. Return `dummy.next`.

---

## 3. Why it works / Vì sao đúng

### Invariant

Trước mỗi iteration:

- Result từ `dummy.next` đến `tail` đã sorted.
- Nó chứa chính xác tất cả node đã chọn từ hai input.
- Mọi node chưa chọn của mỗi list vẫn nằm trong một suffix sorted.

Vì mỗi suffix sorted, phần tử nhỏ nhất chưa chọn của toàn bộ hai list phải là `list1.val` hoặc `list2.val`. Chọn giá trị nhỏ hơn vì vậy luôn chọn đúng node kế tiếp theo sorted order và duy trì invariant.

Khi một list hết, mọi node còn lại chỉ thuộc list kia và suffix đó đã sorted; hơn nữa tất cả giá trị của nó không nhỏ hơn node vừa chọn trước đó. Nối toàn bộ suffix vẫn giữ result sorted và đầy đủ.

---

## 4. Dry run / Chạy thử

```text
list1 = [1,2,4]
list2 = [1,3,4]
```

Các lựa chọn:

```text
1 (list1) -> result [1]
1 (list2) -> result [1,1]
2 (list1) -> result [1,1,2]
3 (list2) -> result [1,1,2,3]
4 (list1) -> result [1,1,2,3,4]
```

`list1` hết nên nối suffix `[4]` của `list2`:

```text
[1,1,2,3,4,4]
```

---

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }

        tail.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}
```

---

## 6. Complexity / Độ phức tạp

Gọi `m`, `n` là số node của hai list.

- **Time:** `O(m + n)`.
- **Extra space:** `O(1)` vì reuse input nodes và chỉ dùng vài pointer.

---

## 7. Recursive alternative / Hướng đệ quy

Có thể chọn head nhỏ hơn rồi recursively merge phần còn lại:

```text
if list1 == null: return list2
if list2 == null: return list1
if list1.val <= list2.val:
    list1.next = merge(list1.next, list2)
    return list1
else:
    list2.next = merge(list1, list2.next)
    return list2
```

Logic đẹp và ngắn, nhưng recursion stack có thể dùng `O(m+n)` memory. Iterative solution phù hợp hơn khi interview hỏi tối ưu space.

---

## 8. Edge cases / Trường hợp biên

- Cả hai list rỗng → `null`.
- Một list rỗng → return list còn lại.
- Các value bằng nhau.
- Một list chứa toàn bộ value nhỏ hơn list kia.
- Negative values.
- Một node mỗi list.

---

## 9. Common mistakes / Lỗi thường gặp

- Tạo node mới cho mọi value dù đề nói splice/reuse node.
- Quên advance pointer của input sau khi chọn node.
- Quên advance `tail`.
- Khi một list hết vẫn tiếp tục so sánh và gây null dereference.
- Dùng `<` hay `<=` đều có thể cho output values đúng, nhưng `<=` giúp lựa chọn deterministic từ `list1` khi bằng nhau.
