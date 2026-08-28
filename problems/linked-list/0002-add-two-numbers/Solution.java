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
