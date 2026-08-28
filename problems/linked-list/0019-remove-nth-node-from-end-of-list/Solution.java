public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Dummy cho phép node cần xóa là head nhưng slow vẫn luôn có một predecessor.
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode fast = dummy;
        ListNode slow = dummy;

        // Tạo gap n+1 cạnh để khi fast chạm null, slow đứng NGAY TRƯỚC target
        // chứ không đứng tại target; nhờ đó deletion chỉ cần một phép rewire.
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        // Cả hai tiến cùng tốc độ nên gap n+1 được giữ bất biến tới cuối list.
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        slow.next = slow.next.next;
        return dummy.next;
    }
}
