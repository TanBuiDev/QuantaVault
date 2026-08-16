# Solution / Lời giải — 133. Clone Graph

## 1. Core idea / Ý tưởng chính

Dùng DFS cùng `Map<Node, Node>` từ original node sang clone tương ứng. Khi lần đầu gặp một node, tạo clone và đưa vào map **trước** khi recurse neighbors. Nếu gặp lại node do cycle, trả clone đã có trong map.

## 2. Algorithm / Thuật toán

1. Nếu input null, trả null.
2. Nếu node đã có trong map, trả clone tương ứng.
3. Tạo `copy = new Node(node.val)` và lưu `copies.put(node, copy)`.
4. Với mỗi neighbor của original, recursively clone rồi append vào `copy.neighbors`.
5. Trả `copy`.

## 3. Why it works / Vì sao đúng

Map duy trì invariant: mỗi original node đã khám phá có đúng một clone object. Vì clone được lưu trước khi traverse neighbors, cycle quay lại node cũ sẽ dùng lại clone thay vì tạo node mới hay recurse vô hạn. Mỗi original edge `u -> v` được tái tạo thành `copy(u) -> copy(v)`, nên cấu trúc graph được bảo toàn; đồng thời mọi clone là object mới nên kết quả là deep copy.

## 4. Optimal Java solution / Java tối ưu

```java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    private final Map<Node, Node> copies = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;
        Node existing = copies.get(node);
        if (existing != null) return existing;

        Node copy = new Node(node.val);
        copies.put(node, copy);
        for (Node neighbor : node.neighbors) {
            copy.neighbors.add(cloneGraph(neighbor));
        }
        return copy;
    }
}
```

## 5. Complexity / Độ phức tạp

- **Time:** `O(V + E)` vì mỗi node và edge được xử lý số lần hằng số.
- **Extra space:** `O(V)` cho map, cộng recursion stack tối đa `O(V)`.

## 6. Common mistakes / Lỗi thường gặp

- Trả original node hoặc reuse original neighbors, không phải deep copy.
- Chỉ dùng `Set<Node>` visited nhưng không có mapping tới clone tương ứng.
- Đưa node vào map sau khi recurse neighbors, gây infinite recursion trên cycle.
- Tạo clone mới mỗi lần gặp lại một node, làm mất shared/cyclic structure.
