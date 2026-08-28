# Solution / Lời giải — 138. Copy List with Random Pointer

## 1. Core idea

Thay HashMap bằng interleaving: `A -> A' -> B -> B'...`. Khi đó copy của original `X` luôn là `X.next`, nên random target copy được lấy bằng `original.random.next`. Sau đó tách hai lists và restore original.

## 2. Optimal Java solution

```java
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
```

## 3. Correctness

Pass 1 thiết lập mapping `copy(X)=X.next`. Pass 2 dùng mapping đó để biến mọi random edge `X->R` thành `X'->R'`. Pass 3 chỉ tháo interleaving, khôi phục original next edges và nối copy next edges; random copy edges vẫn đúng.

## 4. Complexity

```text
Time: O(n)
Auxiliary space: O(1) excluding copied output nodes
```

## 5. Common mistakes

- Copy random trỏ vào original node.
- Dùng value làm identity key.
- Advance sai và rơi vào copy node ở pass 1/2.
- Không restore original list.
