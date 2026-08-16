# Solution / Lời giải — 127. Word Ladder

## 1. Core idea / Trực giác

Mô hình các từ thành một **implicit graph**: mỗi word là một node và hai node nối với nhau nếu khác đúng một ký tự. Vì mỗi transformation có cost bằng 1, **Breadth-First Search (BFS)** sẽ tìm được sequence ngắn nhất.

## 2. Requirement recap / Tóm tắt yêu cầu

Cần trả về **số lượng từ** trong transformation sequence ngắn nhất, không phải số cạnh. Vì vậy queue bắt đầu với `beginWord` ở level `1`. Nếu không thể tới `endWord`, trả `0`.

## 3. Key observations / Nhận xét quan trọng

- Nếu `endWord` không thuộc `wordList`, không thể có sequence hợp lệ.
- Không cần dựng toàn bộ graph trước.
- Với mỗi word, có thể sinh neighbor bằng cách thử 26 chữ cái tại từng vị trí.
- Xóa một word khỏi set ngay khi enqueue để nó không bị đưa vào queue nhiều lần.

## 4. Alternative approaches / Hướng khác

Có thể dựng intermediate pattern như `h*t`, `*ot` để nhóm các word có thể nối với nhau. Cách này giảm số phép thử ký tự trong một số trường hợp nhưng cần thêm cấu trúc dữ liệu. Bidirectional BFS cũng có thể giảm search frontier trên input lớn.

## 5. Optimal approach / Cách tiếp cận tối ưu

1. Đưa toàn bộ `wordList` vào `HashSet`.
2. Nếu set không chứa `endWord`, trả `0`.
3. Đưa `beginWord` vào queue, đặt `length = 1`.
4. Với từng BFS level:
   - nếu current word bằng `endWord`, trả `length`;
   - thử thay từng character bởi `a..z`;
   - nếu candidate có trong set, xóa khỏi set và enqueue.
5. Sau khi xử lý hết một level, tăng `length`.
6. Queue rỗng mà chưa gặp `endWord` thì trả `0`.

## 6. Java solution overview

`HashSet<String>` hỗ trợ membership/removal trung bình `O(1)`. `ArrayDeque<String>` được dùng làm BFS queue.

## 7. Code explanation

`words.remove(next)` vừa kiểm tra membership vừa đánh dấu `next` là visited. Việc đánh dấu lúc enqueue rất quan trọng để cùng một word không được nhiều parent trong cùng level thêm lặp lại.

## 8. Dry run

Với `hit -> cog`:

- Level 1: `hit`
- Sinh được `hot`
- Level 2: `hot`
- Sinh được `dot`, `lot`
- Level 3: `dot`, `lot`
- Sinh được `dog`, `log`
- Level 4: `dog`, `log`
- Sinh được `cog`
- Level 5: gặp `cog` → trả `5`

## 9. Time and space complexity

Gọi `N = wordList.size()` và `L = word length`.

- **Time:** `O(N * L * 26)` neighbor attempts, với chi phí tạo String phụ thuộc `L`.
- **Space:** `O(N * L)` cho dictionary/visited và queue chứa strings.

## 10. Why the algorithm is correct / Vì sao đúng

BFS duyệt graph theo số cạnh tăng dần. Mọi edge đều đại diện cho đúng một lần đổi ký tự và có cùng cost. Vì vậy lần đầu `endWord` được dequeue là đường đi dùng ít transformation nhất. `length` bắt đầu từ 1 nên nó chính xác bằng số word trong sequence.

## 11. Edge cases

- `endWord` không nằm trong dictionary → `0`.
- Chỉ cần một transformation.
- Có nhiều đường đi nhưng chỉ đường ngắn nhất được chọn.
- Có cycle trong implicit graph; visited set ngăn lặp vô hạn.

## 12. Common mistakes / Lỗi thường gặp

- Trả số transformation thay vì số word.
- Chỉ mark visited khi dequeue, gây enqueue trùng.
- Không kiểm tra `endWord` có trong `wordList`.
- Quên restore character gốc sau khi thử một vị trí.

## 13. Pattern recognition / Khi nào tái sử dụng

Dùng BFS khi state có thể biến đổi bằng các bước cùng cost và yêu cầu minimum number of steps: word transformation, genetic mutation, board state, lock combination.

## 14. Vocabulary

- **implicit graph**: graph không cần dựng sẵn toàn bộ edge
- **shortest path**: đường đi ngắn nhất
- **frontier**: lớp node hiện tại của BFS
- **visited**: trạng thái đã được khám phá
- **neighbor generation**: sinh các trạng thái kề
