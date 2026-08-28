public class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        // prev luôn là node cuối cùng chắc chắn được giữ trong result prefix.
        ListNode prev = dummy;
        ListNode current = head;

        while (current != null) {
            if (current.next != null && current.val == current.next.val) {
                int duplicateValue = current.val;

                // Sorted order gom toàn bộ duplicate value thành một contiguous run;
                // nhảy qua cả run để bài II không giữ lại dù chỉ một bản sao.
                while (current != null && current.val == duplicateValue) {
                    current = current.next;
                }
                prev.next = current;
            } else {
                // Chỉ advance prev khi current được chứng minh unique; nếu đang xóa run,
                // prev phải đứng yên để có thể nối qua toàn bộ run đó.
                prev = current;
                current = current.next;
            }
        }

        return dummy.next;
    }
}
