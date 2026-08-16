# Solution / Lời giải — 117. Populating Next Right Pointers in Each Node II

## 1. Core idea / Ý tưởng chính

Duyệt tree theo từng level nhưng không dùng queue. `levelStart` trỏ tới node đầu tiên của level hiện tại. Các `next` pointer đã được tạo cho level đó cho phép ta đi ngang qua toàn bộ level. Trong lúc duyệt, dùng `nextLevelStart` và `nextLevelTail` để xây chain cho level kế tiếp.

## 2. Algorithm / Thuật toán

1. Đặt `levelStart = root`.
2. Với mỗi level:
   - đặt `nextLevelStart = null`, `nextLevelTail = null`;
   - duyệt `current` bằng `current = current.next`;
   - với `current.left` rồi `current.right`, nếu child khác null thì append child vào chain level kế tiếp;
   - sau khi quét xong, gán `levelStart = nextLevelStart`.
3. Trả lại `root`.

## 3. Why it works / Vì sao đúng

Giả sử `next` pointers của level hiện tại đã đúng. Ta duyệt các node của level đó từ trái sang phải và append các child theo đúng thứ tự `left` rồi `right`. Vì vậy mọi node của level kế tiếp được nối theo đúng thứ tự từ trái sang phải, kể cả khi hai node kề nhau có parent khác nhau. Node cuối cùng giữ `next = null`. Base case là root: level đầu chỉ có một node nên chain đã đúng. Theo induction, mọi level đều được nối đúng.

## 4. Dry run / Chạy thử

```text
root = [1,2,3,4,5,null,7]
```

- Level 1: duyệt `1`, tạo chain `2 -> 3`.
- Level 2: duyệt `2 -> 3`, append `4`, `5`, `7` thành `4 -> 5 -> 7`.
- Level 3 không có child, thuật toán kết thúc.

## 5. Optimal Java solution / Java tối ưu

```java
public class Solution {
    public Node connect(Node root) {
        Node levelStart = root;

        while (levelStart != null) {
            Node nextLevelStart = null;
            Node nextLevelTail = null;

            for (Node current = levelStart; current != null; current = current.next) {
                if (current.left != null) {
                    if (nextLevelStart == null) nextLevelStart = current.left;
                    else nextLevelTail.next = current.left;
                    nextLevelTail = current.left;
                }
                if (current.right != null) {
                    if (nextLevelStart == null) nextLevelStart = current.right;
                    else nextLevelTail.next = current.right;
                    nextLevelTail = current.right;
                }
            }

            levelStart = nextLevelStart;
        }

        return root;
    }
}
```

## 6. Complexity / Độ phức tạp

- **Time:** `O(n)` vì mỗi node được duyệt một lần.
- **Extra space:** `O(1)` vì chỉ dùng một số reference; không dùng queue hay collection phụ thuộc `n`.

## 7. Alternative

BFS với queue dễ viết nhưng dùng `O(w)` extra space, với `w` là maximum width của tree, nên không đáp ứng follow-up constant-space.

## 8. Common mistakes / Lỗi thường gặp

- Dùng queue rồi vẫn ghi space là `O(1)`.
- Chỉ nối siblings cùng parent và bỏ sót liên kết giữa hai parent khác nhau.
- Duyệt level kế tiếp trước khi chain `next` của nó hoàn tất.
- Không xử lý tree thưa có nhiều child null.
