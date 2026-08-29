# Solution / Lời giải — 2. Add Two Numbers

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Hai linked lists lưu chữ số theo thứ tự ngược, nên head chính là hàng đơn vị. Ta có thể cộng giống phép cộng tay từ phải sang trái trên giấy, chỉ khác là list đã đặt digit theo đúng thứ tự cần xử lý.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Chuyển cả list thành integer có bottleneck overflow và làm mất ý nghĩa arbitrary length. Quan sát mỗi bước chỉ cần digit của hai node hiện tại và carry từ bước trước; tạo node kết quả ngay rồi tiến pointers.

**State / invariant / data structure cần hiểu trước code.** p,q trỏ digits chưa xử lý; carry là hàng chục của tổng trước. Invariant: list output đã chứa chính xác các chữ số thấp của tổng, và carry chứa toàn bộ ảnh hưởng còn phải truyền sang digit kế tiếp.

**Dry run mental theo implementation.** Dry run 342 + 465 được lưu 2->4->3 và 5->6->4: 2+5=7; 4+6=10 ghi0 carry1; 3+4+1=8, tạo 7->0->8 biểu diễn 807.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là dừng khi một list hết dù list kia/carry còn, hoặc quên node cuối cho carry. Khi nào dùng: digit lists thường mô phỏng arithmetic từng cột với carry state O(1).
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
