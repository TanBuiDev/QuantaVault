public class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) {
            return null;
        }

        Node current = head;
        while (current != null) {
            Node copy = new Node(current.val);
            copy.next = current.next;
            current.next = copy;
            current = copy.next;
        }

        current = head;
        while (current != null) {
            Node copy = current.next;
            copy.random = current.random == null ? null : current.random.next;
            current = copy.next;
        }

        Node copiedHead = head.next;
        current = head;
        while (current != null) {
            Node copy = current.next;
            Node nextOriginal = copy.next;

            current.next = nextOriginal;
            copy.next = nextOriginal == null ? null : nextOriginal.next;

            current = nextOriginal;
        }

        return copiedHead;
    }
}
