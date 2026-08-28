public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;

        // Guard cả fast và fast.next vì fast nhảy hai cạnh; nếu một trong hai
        // chạm null thì path hữu hạn và không thể có cycle reachable từ head.
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            // So sánh node identity, không so val: cycle là quay lại cùng object,
            // còn hai node khác nhau hoàn toàn có thể chứa cùng giá trị.
            if (slow == fast) {
                return true;
            }
        }

        return false;
    }
}
