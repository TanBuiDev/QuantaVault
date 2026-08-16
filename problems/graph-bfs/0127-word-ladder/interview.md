# Interview Preparation / Chuẩn bị phỏng vấn — 127. Word Ladder

## 1. 30-second solution pitch

**Q (EN):** Can you summarize your solution?

**Q (VI):** Bạn có thể tóm tắt lời giải không?

### Short answer (EN)

I model words as an implicit unweighted graph and run BFS from `beginWord`. I generate neighbors by changing one character at a time and only enqueue words that are still in the dictionary.

### Trả lời ngắn (VI)

Tôi mô hình các word thành graph không trọng số và chạy BFS từ `beginWord`. Neighbor được sinh bằng cách đổi từng ký tự và chỉ enqueue word còn trong dictionary.

### Standard answer (EN)

Each valid one-letter transformation is an edge with equal cost, so BFS guarantees the shortest transformation sequence. I use a hash set as both the dictionary and the unvisited set. When I enqueue a word, I remove it immediately to avoid duplicate work.

### Trả lời chuẩn (VI)

Mỗi lần đổi một chữ là một edge có cùng cost nên BFS đảm bảo sequence ngắn nhất. Tôi dùng hash set vừa làm dictionary vừa làm tập chưa thăm và xóa word ngay khi enqueue để tránh xử lý trùng.

## 2. Core approach questions

**Q (EN):** Why is BFS a natural fit here?

**Q (VI):** Tại sao BFS phù hợp với bài này?

Short answer (EN): Every transformation costs one step, so BFS explores candidates in increasing path length.

Trả lời ngắn (VI): Mỗi transformation tốn một bước nên BFS duyệt theo độ dài đường đi tăng dần.

Standard answer (EN): The words form an unweighted graph. BFS processes all nodes at distance `d` before distance `d + 1`, so the first time we reach `endWord` we have a shortest path.

Trả lời chuẩn (VI): Các word tạo thành graph không trọng số. BFS xử lý hết node ở distance `d` trước `d + 1`, nên lần đầu đến `endWord` là shortest path.

## 3. Why / correctness questions

**Q (EN):** Why do you remove a word when you enqueue it?

**Q (VI):** Tại sao xóa word ngay khi enqueue?

Short answer (EN): It marks the word visited before another node can enqueue it again.

Trả lời ngắn (VI): Nó đánh dấu visited trước khi node khác có thể enqueue lại word đó.

Standard answer (EN): Once BFS discovers a word at the earliest possible level, any later discovery cannot produce a shorter path. Removing it immediately prevents duplicates without losing an optimal solution.

Trả lời chuẩn (VI): Khi BFS đã khám phá word ở level sớm nhất, các lần khám phá sau không thể tạo đường ngắn hơn. Xóa ngay giúp tránh duplicate mà không mất nghiệm tối ưu.

## 4. Complexity questions

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là gì?

Short answer (EN): About `O(N * L * 26)` neighbor attempts and `O(N * L)` space.

Trả lời ngắn (VI): Khoảng `O(N * L * 26)` lần thử neighbor và `O(N * L)` bộ nhớ.

Standard answer (EN): Each visited word tries 26 letters at each of `L` positions. The set and queue can hold up to `N` words, and storing the strings requires `O(N * L)` space.

Trả lời chuẩn (VI): Mỗi word được thăm thử 26 chữ tại `L` vị trí. Set và queue có thể giữ tối đa `N` word; lưu các string cần `O(N * L)`.

## 5. Edge-case questions

**Q (EN):** What if `endWord` is not in the dictionary?

**Q (VI):** Nếu `endWord` không nằm trong dictionary thì sao?

Short answer (EN): Return `0` immediately.

Trả lời ngắn (VI): Trả `0` ngay.

Standard answer (EN): Every transformed word after the start must belong to `wordList`, including `endWord`, so the sequence is impossible if it is absent.

Trả lời chuẩn (VI): Mọi word sau điểm bắt đầu đều phải thuộc `wordList`, bao gồm `endWord`, nên thiếu nó thì sequence không hợp lệ.

## 6. Alternative approach and trade-off

**Q (EN):** Could you improve BFS further?

**Q (VI):** Có thể tối ưu BFS thêm không?

Short answer (EN): Bidirectional BFS can reduce the explored frontier.

Trả lời ngắn (VI): Bidirectional BFS có thể giảm frontier phải duyệt.

Standard answer (EN): We can search from both `beginWord` and `endWord` and always expand the smaller frontier. The worst-case complexity is still graph-search dependent, but it often explores far fewer states.

Trả lời chuẩn (VI): Có thể search từ hai đầu và luôn mở rộng frontier nhỏ hơn. Worst case vẫn phụ thuộc graph nhưng thực tế thường duyệt ít state hơn.

## 7. Code walkthrough

**Q (EN):** What does `words.remove(next)` accomplish?

**Q (VI):** `words.remove(next)` thực hiện những gì?

Short answer (EN): It checks that the candidate is valid and unvisited, then marks it visited in one operation.

Trả lời ngắn (VI): Nó vừa kiểm tra candidate hợp lệ/chưa thăm vừa mark visited trong một thao tác.

Standard answer (EN): `HashSet.remove` returns true only if the word existed. That means the candidate belongs to the dictionary and has not been used before, so it is safe to enqueue.

Trả lời chuẩn (VI): `HashSet.remove` chỉ trả true khi word tồn tại. Do đó candidate thuộc dictionary và chưa dùng trước đó, nên có thể enqueue.

## 8. Follow-up variations

Likely follow-up: implement bidirectional BFS, reconstruct one shortest sequence, or support a much larger dictionary.

## 9. Common interviewer traps

Do not confuse the number of edges with the requested number of words. Also explain why visited marking happens at enqueue time.

## 10. Useful phrases and vocabulary

- “This is an unweighted shortest-path problem.”
- “I mark a node visited when I enqueue it.”
- “The graph is implicit, so I generate neighbors on demand.”
- `frontier`, `neighbor`, `visited set`, `shortest path`, `bidirectional BFS`
