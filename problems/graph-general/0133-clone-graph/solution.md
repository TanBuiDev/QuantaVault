# Solution / Lời giải — 133. Clone Graph

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Clone Graph cần mỗi original node tương ứng đúng một clone, kể cả khi graph có cycles và nhiều edges cùng trỏ tới một node. Nếu clone lại mỗi lần gặp neighbor sẽ duplicate nodes hoặc recurse vô hạn.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Tree-style DFS không có visited là sai trên cycles. Quan sát map original->clone vừa là visited vừa là lookup clone đã tạo; tạo clone và put map trước khi recurse neighbors.

**State / invariant / data structure cần hiểu trước code.** Map invariant: mỗi original đã discover có đúng một clone object. DFS(node) trả clone tương ứng; nếu map đã có thì return ngay, nếu chưa thì create/store rồi populate clone.neighbors bằng recursive results.

**Dry run mental theo implementation.** Dry run triangle 1-2-3-1: create clone1/store; recurse2 create/store; recurse3 create/store; edge3->1 thấy map[1] tồn tại nên dùng clone1 thay vì tạo/recurse mới.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là put map sau khi recurse, vẫn infinite cycle. Khi nào dùng: clone arbitrary graph/object network cần identity map old->new được đăng ký trước khi follow edges.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

DFS với map `original -> clone`. Tạo và lưu clone trước khi đi neighbors để vừa giữ object identity vừa chặn recursion vô hạn trên cycle.

## 2. Optimal Java solution

```java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    private final Map<Node, Node> copies = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;

        // Map vừa là visited state vừa là identity mapping original -> clone.
        // Nếu quay lại node do cycle/shared edge, phải reuse đúng clone đã tạo.
        Node existing = copies.get(node);
        if (existing != null) return existing;

        Node copy = new Node(node.val);

        // Quan trọng: publish clone TRƯỚC khi recurse neighbors. Nếu graph có
        // cycle A -> B -> A, lần quay lại A sẽ dừng tại map thay vì recurse vô hạn.
        copies.put(node, copy);
        for (Node neighbor : node.neighbors) {
            copy.neighbors.add(cloneGraph(neighbor));
        }
        return copy;
    }
}
```

## 3. Correctness

Mỗi original node có đúng một clone trong map. Mỗi original edge `u -> v` được rebuild thành `copy(u) -> copy(v)`, kể cả cycle và shared neighbors, nên cấu trúc được bảo toàn mà không reuse original objects.

## 4. Complexity

`O(V + E)` time, `O(V)` map cộng recursion stack.
