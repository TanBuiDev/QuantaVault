public class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) {
            return null;
        }

        Node current = head;
        while (current != null) {
            Node copy = new Node(current.val);

            // Chèn copy ngay sau original biến cấu trúc list thành một implicit map:
            // với mọi original X, copy(X) luôn truy cập được bằng X.next trong O(1).
            copy.next = current.next;
            current.next = copy;
            current = copy.next;
        }

        current = head;
        while (current != null) {
            Node copy = current.next;

            // Nếu original.random = R thì R.next chính là copy(R) nhờ pass 1;
            // vì vậy không cần HashMap original -> copy cho random edge.
            copy.random = current.random == null ? null : current.random.next;
            current = copy.next;
        }

        Node copiedHead = head.next;
        current = head;
        while (current != null) {
            Node copy = current.next;
            Node nextOriginal = copy.next;

            // Khôi phục original list đồng thời nối copied list; random pointers của
            // copies đã trỏ copy-to-copy nên không còn phụ thuộc interleaving này.
            current.next = nextOriginal;
            copy.next = nextOriginal == null ? null : nextOriginal.next;

            current = nextOriginal;
        }

        return copiedHead;
    }
}
