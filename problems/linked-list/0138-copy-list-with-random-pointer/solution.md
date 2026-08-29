# Solution / Lời giải — 138. Copy List with Random Pointer

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Mỗi node có next và random trỏ tới bất kỳ node nào, nên clone node không đủ; mọi pointer của clone phải trỏ tới clone tương ứng chứ không trỏ original.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** HashMap old->copy là cách trực tiếp O(n) space. Cách interweaving O(1) extra chèn copy ngay sau original, nhờ adjacency đó random copy của node x chính là x.random.next.

**State / invariant / data structure cần hiểu trước code.** Phase1 invariant original X luôn theo sau bởi copy X'. Phase2 set X'.random = X.random?.next. Phase3 tách xen kẽ, đồng thời restore original next links và nối copy list.

**Dry run mental theo implementation.** Dry run A->B với A.random=B: sau weave A->A'->B->B'; vì A.random=B nên A'.random=B.next=B'. Sau tách, original A->B và copy A'->B' độc lập.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là set copy.random=original.random hoặc phá list trước khi random links xong. Khi nào dùng: clone graph-like structure có thể map old->new; interleaving là optimization đặc biệt khi next chain cho phép đặt clone cạnh original.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
