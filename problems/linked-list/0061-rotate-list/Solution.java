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

        // Mỗi length rotations đưa list về nguyên trạng, nên modulo loại toàn bộ
        // vòng dư và giữ thời gian phụ thuộc n thay vì phụ thuộc k có thể rất lớn.
        k %= length;
        if (k == 0) {
            return head;
        }

        // Tạo cycle tạm để rotation chỉ còn là chọn một cạnh mới để cắt.
        tail.next = head;

        // Suffix dài k sẽ thành prefix, nên new tail là node thứ length-k
        // tính 1-based, tức cần đi length-k-1 cạnh từ old head.
        int stepsToNewTail = length - k - 1;
        ListNode newTail = head;
        for (int i = 0; i < stepsToNewTail; i++) {
            newTail = newTail.next;
        }

        ListNode newHead = newTail.next;
        // Cắt cycle đúng sau new tail tạo thứ tự suffix -> old prefix.
        newTail.next = null;
        return newHead;
    }
}
