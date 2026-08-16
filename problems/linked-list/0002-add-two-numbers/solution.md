# Solution / Lời giải — 2. Add Two Numbers

## 1. Core idea / Ý tưởng chính

Vì linked list lưu các chữ số theo **reverse order**, node đầu tiên chính là hàng đơn vị. Đây là thứ tự thuận lợi nhất cho phép cộng có nhớ: xử lý từ hàng thấp tới hàng cao và mang `carry` sang bước kế tiếp.

Ta không cần chuyển linked list thành số nguyên. Việc đó vừa không cần thiết vừa có thể overflow vì số có tới 100 chữ số.

---

## 2. Algorithm / Thuật toán

1. Tạo dummy node và `tail` để xây result list.
2. Đặt `carry = 0`.
3. Lặp khi `l1 != null || l2 != null || carry != 0`:
   - Bắt đầu `sum = carry`.
   - Nếu `l1` còn node, cộng `l1.val` rồi tiến `l1`.
   - Nếu `l2` còn node, cộng `l2.val` rồi tiến `l2`.
   - Digit hiện tại là `sum % 10`.
   - Carry mới là `sum / 10`.
   - Append digit vào result.
4. Trả `dummy.next`.

---

## 3. Why it works / Vì sao đúng

Ta chứng minh theo từng vị trí chữ số.

Giả sử trước một iteration, `carry` chính xác là phần nhớ sinh ra từ vị trí thấp hơn trước đó. Ở vị trí hiện tại, thuật toán cộng:

```text
current digit of l1 (or 0)
+ current digit of l2 (or 0)
+ carry
```

Trong hệ thập phân:

- `sum % 10` chính xác là chữ số của tổng tại vị trí hiện tại.
- `sum / 10` chính xác là phần nhớ cần truyền sang vị trí kế tiếp.

Vì invariant này đúng ở hàng đơn vị với `carry = 0` và được duy trì sau mỗi iteration, mọi node được tạo ra đều là digit đúng của tổng. Nếu sau node cuối còn carry, điều kiện loop tạo thêm đúng chữ số cao nhất đó. Do đó result list biểu diễn chính xác tổng hai số.

---

## 4. Dry run / Chạy thử

```text
l1 = [2,4,3]  // 342
l2 = [5,6,4]  // 465
```

### Iteration 1

```text
sum = 2 + 5 + 0 = 7
digit = 7
carry = 0
result = [7]
```

### Iteration 2

```text
sum = 4 + 6 + 0 = 10
digit = 0
carry = 1
result = [7,0]
```

### Iteration 3

```text
sum = 3 + 4 + 1 = 8
digit = 8
carry = 0
result = [7,0,8]
```

Kết quả biểu diễn `807`.

---

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;

        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;

            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }

            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }

            tail.next = new ListNode(sum % 10);
            tail = tail.next;
            carry = sum / 10;
        }

        return dummy.next;
    }
}
```

---

## 6. Complexity / Độ phức tạp

Gọi `m`, `n` là số node của hai list.

- **Time:** `O(max(m, n))`.
- **Extra auxiliary space:** `O(1)` nếu không tính output list.
- **Output space:** `O(max(m, n))`, hoặc thêm một node nếu có final carry.

---

## 7. Why not convert to integers? / Vì sao không đổi thành số nguyên?

Input có thể dài tới 100 digits, lớn hơn rất nhiều giới hạn `long`. Dùng `BigInteger` cũng làm mất ý nghĩa linked-list arithmetic của bài và không phải hướng interview mong đợi.

Digit-by-digit addition xử lý trực tiếp representation được cho và không phụ thuộc độ lớn numeric của toàn bộ số.

---

## 8. Edge cases / Trường hợp biên

- `[0] + [0]` → `[0]`.
- Hai list dài khác nhau.
- Một list kết thúc nhưng carry vẫn tiếp tục.
- Final carry tạo thêm node, ví dụ `[5] + [5]` → `[0,1]`.
- Carry lan qua nhiều chữ số `9`, ví dụ `[9,9,9] + [1]` → `[0,0,0,1]`.

---

## 9. Common mistakes / Lỗi thường gặp

- Dừng loop khi một list hết thay vì khi cả hai list và carry đều hết.
- Quên append final carry.
- Tính `carry` trước khi lấy `digit` nhưng ghi đè `sum` sai.
- Cố chuyển toàn bộ list thành `int`/`long` và bị overflow.
- Quên advance `tail` sau khi append node mới.
- Xử lý riêng head của result quá phức tạp thay vì dùng dummy node.
