# Solution / Lời giải — 2. Add Two Numbers

## 1. Core idea / Ý tưởng chính

Vì linked list lưu digit theo **reverse order**, node đầu là hàng đơn vị. Ta cộng từ thấp tới cao và truyền `carry` sang node kế tiếp; không cần chuyển toàn bộ list thành integer nên không có nguy cơ overflow với số rất dài.

## 2. Optimal Java solution

```java
public class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Dummy giữ một predecessor cố định để mọi digit mới đều append giống nhau,
        // kể cả digit đầu tiên; không cần special-case khởi tạo result head.
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;

        // carry != 0 phải nằm trong điều kiện để final carry tạo thêm digit cao nhất
        // ngay cả khi cả hai input list đã hết node.
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

            // Lists lưu least-significant digit trước, nên sum % 10 là digit cần
            // append ngay bây giờ; sum / 10 là carry duy nhất truyền sang vị trí kế.
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
            carry = sum / 10;
        }

        return dummy.next;
    }
}
```

## 3. Why it works / Vì sao đúng

Trước mỗi iteration, `carry` là phần nhớ chính xác từ digit thấp hơn. Tổng current digits cộng carry được tách thành `sum % 10` cho digit hiện tại và `sum / 10` cho carry kế tiếp. Invariant đúng từ hàng đơn vị và được duy trì tới hết list; điều kiện loop còn xét carry nên không mất digit cuối.

## 4. Dry run

`[2,4,3] + [5,6,4]` lần lượt tạo `7`, `0` với carry `1`, rồi `8` → `[7,0,8]`.

## 5. Complexity

```text
Time: O(max(m,n))
Extra space: O(1) excluding output
```

## 6. Common mistakes

- Dừng khi một list hết.
- Quên final carry.
- Chuyển toàn bộ số sang `int/long`.
- Không dùng dummy và làm head logic phức tạp.
