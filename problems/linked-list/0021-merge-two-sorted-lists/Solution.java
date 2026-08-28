public class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (list1 != null && list2 != null) {
            // Vì mỗi suffix đã sorted, global minimum chưa dùng chỉ có thể là
            // một trong hai head hiện tại; chọn head nhỏ hơn giữ result sorted.
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }

        // Một list đã hết thì suffix còn lại vốn sorted và mọi node của nó
        // có thể nối nguyên khối, không cần copy hoặc tiếp tục so sánh từng node.
        tail.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}
