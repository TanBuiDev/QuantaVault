# Kế hoạch triển khai Newbie-first Solution Rewrite cho LeetCode Top Interview 150

> Tài liệu này là execution plan dùng để triển khai trong một phiên chat mới. Mục tiêu là nâng cấp toàn bộ `solution.md` của 150 bài từ mức “đúng thuật toán + có WHY comments” thành tài liệu có thể dẫn người mới từ **hiểu đề → tự hình thành tư duy → hiểu optimal solution → đọc được Java code**.

## 0. Execution contract cho phiên chat triển khai tiếp theo

Khi bắt đầu phiên chat mới, **đọc commit chứa file này trước**, sau đó thực hiện theo thứ tự sau:

1. Đọc toàn bộ file kế hoạch này.
2. Kiểm tra `main` hiện tại và không giả định baseline vẫn đứng yên tại commit lúc kế hoạch được tạo.
3. Đọc lại các validator/content scripts hiện có trước khi sửa nội dung, đặc biệt:
   - `tools/audit_java_solution_comments.py`
   - `tools/validate_content.py`
   - workflow CI hiện tại.
4. Kiểm tra số lượng canonical problems và cấu trúc `problems/<section>/<problem>/` thực tế.
5. Tạo **implementation branch mới từ `main` mới nhất**. Không triển khai 150 bài trực tiếp trên branch kế hoạch này.
6. Thực hiện Phase 1 → Phase 7 theo kế hoạch bên dưới.
7. Chạy validator/CI sau mỗi batch hợp lý; không đợi đến cuối mới kiểm tra toàn bộ.
8. Không thay đổi thuật toán của `Solution.java` nếu mục tiêu chỉ là cải thiện cách dạy, trừ khi phát hiện bug/correctness issue riêng và ghi rõ lý do.
9. `Optimal Java solution` trong `solution.md` phải tiếp tục khớp canonical `Solution.java` theo contract hiện có.
10. Khi có thay đổi lớn về tiêu chuẩn, cập nhật plan/report trước khi tiếp tục batch tiếp theo thay vì âm thầm đổi style giữa chừng.

### Baseline tại thời điểm tạo kế hoạch

- Repository: `TanBuiDev/leetcode`
- Default branch: `main`
- `main` tại lúc tạo plan: `f1b4828599c61e66dda10a9649b549d55c876365`
- Repo đã có audit 150 Java solutions và CI kiểm tra WHY comments + exact sync giữa `Solution.java` và `Optimal Java solution` trong `solution.md`.

**Lưu ý:** SHA trên chỉ là historical baseline. Phiên triển khai mới phải kiểm tra `main` mới nhất trước khi bắt đầu.

---

# 1. Bối cảnh và vấn đề cần giải quyết

Đợt cải thiện trước đã giải quyết tốt một vấn đề quan trọng: các canonical Java solutions không còn quá “trần”, đã có WHY comments và có kiểm tra đồng bộ với `solution.md`.

Tuy nhiên, **có comment không đồng nghĩa với dễ học**.

Hiện trạng dễ gặp ở một số bài:

```text
Đề bài
↓
Tên pattern / thuật ngữ DSA
↓
Optimal algorithm
↓
Optimal Java code
↓
Correctness / Complexity
```

Luồng này tốt cho người đã biết nền tảng DSA, nhưng người mới thường bị kẹt trước khi đến phần code:

```text
“Tại sao lại nghĩ tới prefix?”
“Tại sao phải gán trước rồi mới nhân?”
“BFS level ở đâu ra?”
“Tại sao cần HashMap + ArrayList?”
“buy[t] có nghĩa là gì?”
“Tại sao một DFS return chỉ được chọn một child?”
“sentinel / heap / partition / quota / invariant là gì?”
```

Vì vậy phase này **không phải phase thêm comment**, mà là phase **viết lại luồng giải thích để người mới tự hình thành được thuật toán**.

---

# 2. Mục tiêu sản phẩm

Sau khi hoàn tất, mỗi `solution.md` phải giúp người học đi qua được chuỗi tư duy sau:

```text
Đề đang bắt mình tìm gì?
        ↓
Tự giải một ví dụ nhỏ bằng tay
        ↓
Cách tự nhiên đầu tiên mình sẽ nghĩ tới
        ↓
Cách đó chậm/thừa/khó ở đâu?
        ↓
Quan sát nào giúp loại bỏ phần thừa?
        ↓
Từ quan sát đó sinh ra state / variable / data structure nào?
        ↓
Optimal algorithm hình thành như thế nào?
        ↓
Optimal Java code đang hiện thực đúng ý tưởng nào?
        ↓
Dry run theo chính các biến trong code
        ↓
Làm sao nhận ra pattern này ở bài khác?
```

Đây là tiêu chuẩn cốt lõi của toàn bộ migration.

---

# 3. Non-goals

Phase này **không** nhằm:

1. Viết lại `problem.md` trừ khi phát hiện statement bị sai/nghèo semantics riêng.
2. Biến mỗi solution thành giáo trình Java toàn diện.
3. Comment mọi dòng code.
4. Làm mọi bài dài bằng nhau.
5. Thay canonical optimal solution bằng phiên bản “dễ đọc hơn nhưng kém tối ưu” mà không có lý do rõ ràng.
6. Thay đổi business/UI của web app nếu không cần cho content migration.
7. Nhồi thuật ngữ DSA để tài liệu trông học thuật hơn.
8. Ép tất cả 150 bài vào một template cứng có cùng số heading.

---

# 4. Nguyên tắc sư phạm bắt buộc

## 4.1. Giải thích bài toán trước khi gọi tên pattern

Không mở đầu bằng:

```text
This is BFS on an implicit unweighted graph.
```

Mà phải tạo mental model trước:

```text
hit → hot → dot → dog → cog
```

Sau đó mới nói:

```text
Nếu coi mỗi word là một node và một phép đổi 1 ký tự là một edge,
đây trở thành graph; vì cần số bước ngắn nhất nên BFS phù hợp.
```

## 4.2. Không dùng khái niệm chưa giải thích để giải thích khái niệm khác

Không viết:

```text
currentEnd = BFS level boundary
```

nếu người đọc chưa biết BFS level.

Nên viết:

```text
Với cùng số lần nhảy hiện tại, ta có thể đứng trong một vùng liên tiếp.
currentEnd là vị trí cuối của vùng đó.
Cách nhìn này tương đương một level trong BFS.
```

## 4.3. Từ concrete → abstract

Ưu tiên thứ tự:

```text
ví dụ cụ thể
→ điều quan sát được
→ quy tắc tổng quát
→ thuật ngữ DSA
→ code
```

Không làm ngược.

## 4.4. Optimal idea phải được “sinh ra”, không xuất hiện như phép thuật

Ví dụ bài prefix/suffix:

```text
answer[i]
= tích bên trái i
* tích bên phải i
```

phải xuất hiện trước `prefix` và `suffix` variables.

Ví dụ DP:

```text
Nếu ngày hôm nay đang giữ cổ phiếu thì mình cần biết điều gì?
Nếu hôm nay không giữ thì mình cần biết điều gì?
```

phải xuất hiện trước `buy[t]`, `sell[t]`.

## 4.5. Comment trong code phải ngắn

Phần giải thích dài đặt **trước code**.

Trong `Optimal Java solution`, comment tập trung vào:

- invariant khó;
- WHY của thứ tự update;
- edge case dễ sai;
- pointer/state transition khó;
- data structure synchronization.

Không comment các dòng hiển nhiên như:

```java
return true; // trả về true
```

## 4.6. Java syntax/API chỉ giải thích khi nó cản trở hiểu thuật toán

Ví dụ có thể cần `Java note` cho:

- `Map<K,V>` / `HashMap`
- `ArrayList.add/get/set/remove`
- `Integer` vs `int`
- enhanced for
- `Deque.push/pop/peek`
- `PriorityQueue.offer/poll/peek`
- `Collections.reverseOrder()`
- `computeIfAbsent`
- lambda cơ bản
- `Math.max/min`
- `Integer.MAX_VALUE/MIN_VALUE`
- bit operators `&`, `|`, `^`, `<<`, `>>`, `>>>`
- ternary `?:`
- `Character.isDigit`
- generics `<>`

Không lặp lại một tutorial Java dài trong mọi bài.

## 4.7. Correctness phải dễ đọc trước khi formal

Có thể dùng invariant, nhưng phải giải thích invariant bằng ngôn ngữ đơn giản trước.

Không nên chỉ viết:

```text
Invariant: ...
```

mà không nói nó có nghĩa gì trong ví dụ.

---

# 5. Target structure cho `solution.md`

Không bắt buộc đúng số heading, nhưng mỗi bài nên bao phủ các layer sau nếu phù hợp.

## Layer A — Hiểu đề

### A1. Bài toán thực sự hỏi gì?

Nói lại bằng tiếng Việt đời thường.

### A2. Ví dụ bằng tay

Tự tính output của một input nhỏ, ưu tiên input đủ để lộ ý tưởng chính.

## Layer B — Hình thành tư duy

### B1. Cách nghĩ tự nhiên đầu tiên

Brute force / simulation / extra array / enumerate / recursive search... miễn là cách đó hợp lý với người mới.

### B2. Vấn đề của cách đầu tiên

Chỉ ra chính xác bottleneck:

- lặp lại phép tính;
- shift mảng;
- scan toàn bộ;
- state bị recompute;
- không đảm bảo thứ tự;
- exponential search;
- cần shortest path;
- cần lookup nhanh;
- memory thừa.

### B3. Quan sát giúp tối ưu

Đây là section quan trọng nhất.

Ví dụ:

```text
Để bán hôm nay, chỉ cần biết giá nhỏ nhất trước đó.
```

hoặc:

```text
Nếu xóa giữa ArrayList sẽ shift, nhưng nếu thay bằng phần tử cuối thì không cần shift.
```

### B4. Từ observation → variable/state/data structure

Giải thích tại sao tồn tại:

```text
minPrice
farthest
currentEnd
prefix
suffix
left/right
need/window
buy[t]/sell[t]
heap lower/upper
map + doubly linked list
```

## Layer C — Implementation

### C1. Optimal Java solution

Canonical code, giữ WHY comments ngắn.

### C2. Java notes

Chỉ khi cần.

### C3. Dry run

Theo chính biến trong implementation.

## Layer D — Tổng kết

- Correctness
- Complexity
- Edge cases
- Common mistakes
- Pattern recognition

---

# 6. Phân loại độ dài theo độ khó sư phạm

Không dùng số dòng cố định. Dùng 3 mức.

## Tier 1 — Straightforward

Ví dụ dạng simple scan / direct mapping / basic two pointers.

Yêu cầu tối thiểu:

```text
Hiểu đề
→ Observation
→ Code
→ Dry run ngắn
→ Complexity / mistakes
```

## Tier 2 — Pattern-heavy

Ví dụ sliding window, stack, interval, linked-list manipulation, tree traversal, standard binary search variants.

Cần thêm:

```text
Naive approach
→ bottleneck
→ pattern derivation
→ variable meaning
→ worked example
```

## Tier 3 — Concept-heavy / Hard

Ví dụ:

- Median of Two Sorted Arrays
- Basic Calculator
- LRU Cache
- Binary Tree Maximum Path Sum
- Word Search II
- Stock IV
- advanced DP/graph/bit/math.

Cần mental model, multiple worked examples nếu cần, giải thích rõ data structure/state transition và dry run đủ chi tiết để trace.

---

# 7. Phase 1 — Tạo Newbie Solution Style Guide

Tạo file mới trong implementation branch:

```text
docs/content/newbie-solution-style-guide.md
```

Style guide phải chứa:

1. Mục tiêu reader persona.
2. Concrete → abstract rule.
3. Quy tắc thuật ngữ.
4. Quy tắc comment trong code.
5. Quy tắc Java note.
6. Quy tắc dry run.
7. Quy tắc correctness/invariant.
8. Quy tắc độ dài theo Tier 1/2/3.
9. Ví dụ “bad vs good” cho ít nhất:
   - greedy;
   - BFS;
   - DP;
   - prefix/suffix;
   - linked list pointers;
   - Java collections.
10. Checklist reviewer cho một `solution.md`.

### Exit criteria Phase 1

- Style guide đủ cụ thể để hai người khác nhau viết hai bài vẫn ra cùng philosophy.
- Không yêu cầu template cứng.
- Có reference snippets “bad → good”.

---

# 8. Phase 2 — Audit toàn bộ 150 bài trước khi rewrite

Không sửa từng bài ngay khi đọc. Trước tiên tạo baseline audit.

Artifacts:

```text
docs/reports/solution-newbie-audit.md
docs/reports/solution-newbie-audit.json
```

## 8.1. Rubric 12 điểm

Mỗi bài chấm 6 tiêu chí, mỗi tiêu chí `0..2`.

### Criterion 1 — Hiểu yêu cầu mà chưa biết DSA

- `0`: gần như lặp lại thuật ngữ đề / pattern.
- `1`: có recap nhưng vẫn abstract.
- `2`: nói rõ input → output → constraint logic bằng ngôn ngữ thường.

### Criterion 2 — Worked example trước thuật toán

- `0`: không có.
- `1`: có example nhưng chủ yếu sau code.
- `2`: example giúp tự hình thành intuition trước optimal algorithm.

### Criterion 3 — Naive → optimal derivation

- `0`: optimal xuất hiện ngay.
- `1`: có alternative nhưng không thực sự dẫn tới optimal.
- `2`: bottleneck/observation dẫn logic tới optimal.

### Criterion 4 — Variable / data structure meaning

- `0`: tên biến/state xuất hiện nhưng không giải thích why.
- `1`: có mô tả.
- `2`: giải thích cả meaning + reason + invariant/update order.

### Criterion 5 — Java obstacle coverage

- `0`: nhiều syntax/API khó nhưng không giải thích.
- `1`: có giải thích một phần.
- `2`: không có blocker đáng kể hoặc blockers đã được giải thích vừa đủ.

### Criterion 6 — Dry run theo implementation

- `0`: không có.
- `1`: dry run quá ngắn / không theo state code.
- `2`: trace đúng các biến quan trọng và làm rõ dòng khó.

## 8.2. Classification

```text
0–4   = RED    → rewrite lớn
5–8   = YELLOW → bổ sung / tái cấu trúc
9–12  = GREEN  → polish hoặc giữ nguyên
```

## 8.3. Audit report phải có

Cho từng bài:

```text
problem id
title
section
difficulty nếu metadata có
score 0..12
classification
main blockers
recommended actions
pedagogy tier
```

Report tổng hợp:

```text
RED count
YELLOW count
GREEN count
breakdown theo section
breakdown theo difficulty
các blocker lặp lại nhiều nhất
```

### Exit criteria Phase 2

- 150/150 được audit.
- Không có bài “unknown/unreviewed”.
- Có danh sách priority dựa trên RED/YELLOW + độ khó.

---

# 9. Phase 3 — Golden Set trước khi rewrite đại trà

Không rewrite 150 bài ngay.

Rewrite một golden set đại diện cho các failure modes khác nhau.

## Golden problems đề xuất

1. **#121 Best Time to Buy and Sell Stock** — one-pass / running state.
2. **#274 H-Index** — định nghĩa đề khó + bucket saturation.
3. **#45 Jump Game II** — greedy hình thành từ reachable ranges/BFS levels.
4. **#238 Product of Array Except Self** — prefix/suffix + update order.
5. **#224 Basic Calculator** — stack/parser/context.
6. **#124 Binary Tree Maximum Path Sum** — DFS return value khác global answer.
7. **#4 Median of Two Sorted Arrays** — binary-search partition hard.
8. **#188 Best Time to Buy and Sell Stock IV** — DP state transition.

Nếu audit phát hiện một pattern quan trọng chưa được đại diện, có thể thêm tối đa 2 golden problems nữa.

## 9.1. Cách review golden set

Mỗi bài phải vượt checklist:

```text
[ ] Có thể hiểu bài mà chưa biết tên pattern
[ ] Có worked example trước optimal code
[ ] Optimal idea được suy ra từ observation
[ ] Các biến/state khó có meaning + why
[ ] Java blocker được giải thích nếu cần
[ ] Optimal Java comments ngắn, không biến code thành bài văn
[ ] Dry run dùng chính biến code
[ ] Correctness readable
[ ] Complexity đúng
[ ] Common mistakes thực tế
[ ] Pattern recognition không phải “hãy nhớ tên pattern” đơn thuần
```

## 9.2. Freeze style

Sau golden set:

- cập nhật style guide nếu cần;
- chốt naming/heading philosophy;
- chốt mức chi tiết phù hợp;
- không đổi style lớn giữa migration nếu không có review rõ ràng.

### Exit criteria Phase 3

- Golden set được review như reference implementation.
- Style guide được freeze ở version đầu tiên.
- Không còn câu hỏi lớn về format/philosophy.

---

# 10. Phase 4 — Rewrite toàn bộ 150 bài theo section batch

## 10.1. Batch order đề xuất

Đi từ dễ chuẩn hóa tới concept-heavy:

```text
1. array-string
2. two-pointers
3. sliding-window
4. matrix
5. hashmap
6. intervals
7. stack
8. linked-list
9. binary-tree-general
10. binary-tree-bfs
11. binary-search-tree
12. graph-general
13. graph-bfs
14. trie
15. backtracking
16. divide-conquer
17. kadanes-algorithm
18. binary-search
19. heap
20. bit-manipulation
21. math
22. 1d-dp
23. multidimensional-dp
```

Nếu repo section thực tế khác, dùng danh sách thực tế từ `problems/` nhưng giữ triết lý từ dễ → khó.

## 10.2. Workflow cho mỗi section

```text
1. Đọc audit của section
2. Rewrite RED trước
3. Improve YELLOW
4. Review GREEN để đảm bảo không lệch style mới
5. Kiểm tra Optimal Java exact sync
6. Chạy content validators
7. Chạy Java WHY audit
8. Chạy pedagogy audit/warnings
9. Commit section/batch
10. Ghi progress report
```

## 10.3. Quy tắc commit

Ưu tiên commit theo section hoặc coherent batch, ví dụ:

```text
docs(solutions): rewrite array-string for newbie-first learning
docs(solutions): rewrite sliding-window explanations
docs(solutions): improve linked-list mental models
docs(solutions): rewrite graph sections for newbie-first flow
```

Không gom toàn bộ 150 bài vào một commit khổng lồ nếu tránh được.

Không tạo 150 commits lẻ nếu không cần.

## 10.4. Quy tắc sửa `Solution.java`

Mặc định:

```text
solution.md pedagogy changes
Solution.java algorithm unchanged
```

Nếu cần sửa comment trong canonical code để khớp style mới:

- comment phải ngắn;
- semantic code không đổi;
- update cả `Solution.java` và block `Optimal Java solution`;
- validator exact sync phải pass.

Nếu code logic thay đổi:

- coi là separate correctness change;
- ghi rõ trong commit/PR;
- cần test riêng.

---

# 11. Phase 5 — Pedagogy validator / lint

Tạo:

```text
tools/audit_solution_pedagogy.py
```

Mục tiêu không phải “chứng minh bài dễ hiểu bằng regex”, mà bắt regression cấu trúc.

## 11.1. Checks có thể tự động hóa

Ví dụ:

- `solution.md` tồn tại.
- Có đúng một `Optimal Java solution` canonical section theo contract hiện tại.
- Có substantial explanatory content trước optimal code.
- Không để file gần như chỉ có code + complexity.
- Medium/Hard nên có worked example hoặc dry run.
- Có complexity section.
- Có correctness hoặc explanation tương đương cho bài không-trivial.
- Có common mistakes cho bài pattern-heavy.
- Có pattern recognition cho bài phù hợp.
- Detect quá nhiều unexplained English jargon nếu có thể ở mức heuristic.

## 11.2. Warning vs failure

Giai đoạn migration:

```text
structural critical issue → FAIL
pedagogy quality heuristic → WARNING
```

Sau khi 150/150 migration xong mới cân nhắc nâng một số warning thành CI failure.

## 11.3. Không làm validator sai mục tiêu

Không ép:

```text
mọi bài phải có 13 headings
mọi bài phải có 100 dòng
mọi bài phải có Java Notes
mọi bài phải có brute force
```

Validator bảo vệ minimum quality, không thay reviewer.

---

# 12. Phase 6 — Newbie Simulator QA

Đây là quality gate quan trọng nhất.

Với mỗi RED/YELLOW sau rewrite, reviewer phải trả lời:

```text
Nếu xóa tên pattern khỏi phần đầu,
người đọc còn hiểu được vì sao algorithm hình thành không?
```

Nếu câu trả lời là “không”, bài chưa đạt.

## 12.1. QA questions

### Hiểu đề

- Output thực sự là gì?
- Có constraint logic nào dễ hiểu sai không?
- Ví dụ có minh họa đúng phần khó nhất không?

### Hình thành thuật toán

- Cách đầu tiên có tự nhiên không?
- Bottleneck có được chỉ ra cụ thể không?
- Observation có đủ mạnh để dẫn tới optimal không?

### Code

- Người đọc có biết mỗi state/variable quan trọng biểu diễn gì không?
- Có dòng update order nào dễ sai chưa được giải thích không?
- Có syntax Java nào cản trở hiểu ý tưởng không?

### Dry run

- Dry run có trace đúng state thực tế không?
- Có giải thích thời điểm biến thay đổi không?
- Có làm rõ edge case quan trọng không?

### Tổng kết

- Common mistakes có thực tế không?
- Pattern recognition có giúp transfer sang bài khác không?

---

# 13. Java Notes strategy

Không lặp tutorial ở mọi bài.

## 13.1. Inline note khi chỉ có 1 blocker nhỏ

Ví dụ:

```text
Java note: `for (int price : prices)` cho `price` là value, không phải index.
```

## 13.2. Small Java Notes section khi có nhiều API

Ví dụ bài HashMap/ArrayList:

```text
values.get(i)          → lấy value tại index i
values.set(i, x)       → thay value tại index i
indexByValue.put(v, i) → lưu value → index
containsKey(v)         → kiểm tra key tồn tại
```

## 13.3. Không giải thích lại kiến thức đã quá basic nếu không phải blocker

Tài liệu vẫn là LeetCode/DSA learning, không phải Java syntax reference hoàn chỉnh.

---

# 14. Special guidance theo pattern

## 14.1. Array / running state

Luôn hỏi:

```text
Ở vị trí hiện tại, mình thật sự cần nhớ gì từ quá khứ?
```

## 14.2. Two pointers

Phải giải thích:

- mỗi pointer đại diện gì;
- tại sao move pointer đó, không phải pointer kia;
- invariant vùng đã xử lý.

## 14.3. Sliding window

Phải giải thích:

```text
window khi nào valid?
expand để làm gì?
shrink để làm gì?
condition nào làm mất validity?
```

## 14.4. Stack

Trước code phải có mental model LIFO/context/pending work.

## 14.5. Linked list

Ưu tiên ASCII diagram trước pointer writes.

Ví dụ:

```text
A <-> B <-> C
     ↑ remove

A <------> C
```

## 14.6. Tree DFS

Phân biệt rõ:

```text
Hàm recursive trả gì cho parent?
Global answer đang xét gì?
```

Nếu hai giá trị khác nhau, phải minh họa bằng cây nhỏ.

## 14.7. BFS / graph

Giải thích node/edge từ bài toán cụ thể trước khi gọi tên graph.

## 14.8. Trie

Giải thích prefix sharing bằng vài words trước khi đưa `TrieNode[26]`.

## 14.9. Binary search

Không chỉ nói “binary search answer”. Phải nêu:

```text
search space là gì?
điều kiện monotonic là gì?
mid valid thì bỏ nửa nào và tại sao?
```

## 14.10. Heap

Giải thích “mình chỉ cần truy cập phần tử nhỏ/lớn nhất liên tục” trước `PriorityQueue`.

## 14.11. Bit manipulation

Luôn có binary example nhỏ trước bit operator khó.

## 14.12. DP

DP state phải được nói bằng câu đầy đủ trước công thức.

Ví dụ:

```text
dp[i] = ...
```

không được là dòng đầu tiên của intuition.

Cần làm rõ:

```text
state nghĩa là gì?
transition đến từ lựa chọn nào?
base case tại sao như vậy?
update order có quan trọng không?
```

---

# 15. Definition of Done cho một bài

Một problem chỉ được đánh dấu migrated khi đạt tất cả mục phù hợp:

```text
[ ] Người mới hiểu được output cần tìm
[ ] Có ít nhất một concrete/mental example nếu bài không-trivial
[ ] Thuật ngữ quan trọng không xuất hiện trước khi được giải thích
[ ] Optimal idea được suy ra từ observation/bottleneck
[ ] Variable/state/data structure khó có meaning + reason
[ ] Java blocker được giải thích khi cần
[ ] Optimal Java code vẫn canonical/correct
[ ] WHY comments ngắn, đúng chỗ
[ ] Dry run theo chính implementation state
[ ] Correctness readable và đúng
[ ] Complexity đúng
[ ] Common mistakes có giá trị học tập
[ ] Pattern recognition giúp transfer knowledge
[ ] `Solution.java` và `solution.md` exact sync theo contract hiện tại
[ ] Existing validators pass
```

Không phải bài nào cũng cần Java note, brute force hoặc 13 headings; checkbox chỉ áp dụng khi phù hợp.

---

# 16. Definition of Done cho toàn bộ migration

Migration chỉ hoàn tất khi:

```text
150 / 150 problems được audit
150 / 150 có final pedagogy score/classification
0 RED
0 unresolved YELLOW
150 / 150 canonical Java solutions pass existing WHY audit
150 / 150 solution.md optimal Java blocks exact-sync với Solution.java
content validation PASS
pedagogy structural audit PASS
lint/test/build PASS
E2E PASS
```

Tạo final report:

```text
docs/reports/newbie-solution-final-report.md
```

Tối thiểu ghi:

```text
Before migration:
RED    xx
YELLOW xx
GREEN  xx

After migration:
RED      0
YELLOW   0
GREEN  150
```

Ngoài count, report phải có:

- section completion table;
- golden set list;
- top recurring problems fixed;
- validator additions;
- known limitations còn lại;
- CI status cuối.

---

# 17. Suggested repository artifacts sau khi triển khai

```text
docs/
├── content/
│   ├── ke-hoach-newbie-first-solution-150.md   # plan này
│   └── newbie-solution-style-guide.md
│
└── reports/
    ├── solution-newbie-audit.md
    ├── solution-newbie-audit.json
    └── newbie-solution-final-report.md

tools/
├── audit_java_solution_comments.py             # existing
├── audit_solution_pedagogy.py                  # new
└── validate_content.py                         # existing / extend only if appropriate

problems/
└── <section>/<problem>/
    ├── problem.md
    ├── solution.md                              # primary migration target
    └── Solution.java                            # only comment/sync changes unless correctness issue
```

---

# 18. CI strategy

## Trong migration

CI bắt buộc tiếp tục giữ các checks hiện có.

Thêm pedagogy audit ban đầu ở warning/report mode nếu heuristic chưa đủ ổn định.

Không được hạ chất lượng validator cũ chỉ để batch mới pass.

## Cuối migration

CI minimum:

```text
Validate canonical content
Audit Java WHY comments
Audit solution pedagogy structure
Lint
Test
Build
E2E
```

Nếu pedagogy script có heuristic noisy, chỉ fail trên deterministic structural rules.

---

# 19. Risk management

## Risk 1 — Viết solution quá dài

Mitigation:

- Tier 1/2/3.
- Phần dài đặt trước code, code comments vẫn ngắn.
- Chỉ giữ explanation có tác dụng hình thành tư duy.

## Risk 2 — Rewrite làm lệch canonical Java

Mitigation:

- exact sync validator tiếp tục chạy.
- không manually copy code thiếu comment.
- batch check sau mỗi section.

## Risk 3 — Style drift giữa 150 bài

Mitigation:

- golden set + style guide freeze.
- section review checklist.
- audit reports.

## Risk 4 — Dùng thuật ngữ khó để giải thích thuật ngữ khó

Mitigation:

- concrete → abstract rule.
- newbie simulator QA.

## Risk 5 — Tập trung Java quá mức, loãng thuật toán

Mitigation:

- Java Notes chỉ khi syntax/API là blocker.

## Risk 6 — Validator biến thành template police

Mitigation:

- structural minimum only.
- pedagogy quality vẫn cần review đọc nội dung.

## Risk 7 — Thay đổi main trong lúc migration kéo dài

Mitigation:

- branch từ main mới nhất.
- rebase/merge main định kỳ nếu cần.
- chạy full CI trước merge.

---

# 20. Progress tracking

Trong `solution-newbie-audit.json`, nên có status fields:

```json
{
  "id": 238,
  "section": "array-string",
  "classification_before": "YELLOW",
  "score_before": 7,
  "tier": 2,
  "status": "migrated",
  "score_after": 11,
  "blockers_fixed": [
    "except-self meaning not introduced concretely",
    "prefix update order needed worked example"
  ]
}
```

Status values gợi ý:

```text
not-reviewed
audited
in-progress
migrated
needs-review
blocked
```

Không cần commit progress sau từng bài nếu batch đang làm dở, nhưng report phải đủ để phiên sau tiếp tục chính xác.

---

# 21. Review examples cần dùng làm benchmark

## Benchmark A — #238 Product of Array Except Self

Không chỉ nói:

```text
prefix = product left
suffix = product right
```

Phải làm rõ:

```text
nums = [2,3,4,5]
i = 2 → nums[i] = 4
answer[2] phải dùng 2 * 3 * 5
```

và tại sao:

```java
answer[i] = prefix;
prefix *= nums[i];
```

phải gán trước rồi mới nhân.

## Benchmark B — #380 RandomizedSet

Mental model:

```text
ArrayList: index → value
HashMap:   value → index
```

Remove phải minh họa swap-with-last trước code.

## Benchmark C — #45 Jump Game II

Không bắt đầu bằng greedy/BFS jargon.

Bắt đầu bằng:

```text
0 jumps → vị trí đầu
1 jump  → một vùng reachable
2 jumps → vùng tiếp theo
```

sau đó mới sinh `currentEnd` và `farthest`.

## Benchmark D — #146 LRU Cache

Phải có diagram recency trước pointer manipulation.

## Benchmark E — #4 Median of Two Sorted Arrays

Phải có worked partition example trước sentinels/cross inequalities.

## Benchmark F — #188 Stock IV

Phải giải thích state bằng câu đầy đủ trước transition formula.

---

# 22. Implementation branch / PR strategy

Phiên chat triển khai mới nên:

1. Fetch `main` mới nhất.
2. Tạo branch, ví dụ:

```text
content/newbie-first-solutions-150
```

3. Mở Draft PR sớm để theo dõi migration.
4. Commit theo phase/section coherent batch.
5. Không merge cho tới khi final DoD pass.

PR description nên chứa checklist:

```text
[ ] Style guide
[ ] 150-problem baseline audit
[ ] Golden set
[ ] Array/String family
[ ] Pointer/Window/Matrix/HashMap
[ ] Stack/Linked List
[ ] Tree/BST/BFS
[ ] Graph/Trie/Backtracking
[ ] Divide/Binary Search/Heap
[ ] Bit/Math
[ ] DP/Kadane
[ ] Pedagogy validator
[ ] Final report
[ ] Full CI green
```

---

# 23. Recommended execution sequence trong phiên chat mới

## Step 1 — Repository reconnaissance

Đọc:

```text
docs/content/ke-hoach-newbie-first-solution-150.md
tools/audit_java_solution_comments.py
tools/validate_content.py
.github/workflows/*
```

Kiểm tra cấu trúc `problems/` và metadata thực tế.

## Step 2 — Branch + Draft PR

Tạo implementation branch từ current main.

## Step 3 — Style guide

Viết và review.

## Step 4 — 150 audit

Tạo JSON + Markdown report.

## Step 5 — Golden set

Rewrite 8–10 bài đại diện.

## Step 6 — Freeze style

Review golden set và update guide.

## Step 7 — Batch migration

Rewrite theo section order.

## Step 8 — Pedagogy audit tooling

Thêm deterministic structural audit.

## Step 9 — Full QA

Chạy:

```text
content validation
Java WHY exact-sync audit
pedagogy audit
lint
tests
build
E2E
```

## Step 10 — Final report

Đưa RED/YELLOW về 0.

## Step 11 — PR review readiness

Đảm bảo diff không chứa unintended algorithm changes.

---

# 24. Acceptance examples

## Không đạt

```text
Core idea:
Use BFS over an implicit graph.

Code...
```

Lý do: gọi tên solution trước khi tạo mental model.

## Đạt

```text
Mỗi word có thể đổi đúng 1 ký tự để sang word khác trong dictionary.
Ta cần số lần đổi ít nhất.

Nếu coi mỗi word là một điểm và nối hai điểm khi chúng khác đúng 1 ký tự,
đề bài trở thành tìm đường đi ngắn nhất trên graph không trọng số.
BFS phù hợp vì nó xét mọi đường dài 1 bước trước 2 bước, rồi 3 bước...
```

## Không đạt

```text
buy[t] = max(buy[t], sell[t-1] - price)
```

rồi mới giải thích state ở Correctness.

## Đạt

```text
Sau khi đã hoàn thành tối đa t-1 giao dịch,
nếu mua hôm nay thì số tiền còn lại là sell[t-1] - price.

Vì ta có thể hoặc tiếp tục giữ trạng thái cũ, hoặc mua hôm nay:

buy[t] = max(buy[t], sell[t-1] - price)
```

---

# 25. Final success criteria

Thành công không được đo bằng “150 files đã sửa”.

Thành công được đo bằng:

> Một người chưa biết trước tên pattern vẫn có thể đọc `solution.md`, hiểu đề, theo được quá trình reasoning, biết vì sao optimal state/data structure xuất hiện, rồi đọc được canonical Java solution mà không cảm thấy code xuất hiện từ hư không.

Nếu một bài có WHY comments đầy đủ nhưng người mới vẫn phải hỏi “tại sao lại nghĩ ra biến này?”, bài đó **chưa hoàn tất migration**.

---

# 26. Prompt ngắn gợi ý cho phiên chat mới

Có thể bắt đầu phiên chat mới bằng yêu cầu:

```text
Hãy đọc commit <PLAN_COMMIT_SHA> trong repo TanBuiDev/leetcode, đặc biệt file
`docs/content/ke-hoach-newbie-first-solution-150.md`.

Sau đó kiểm tra main mới nhất và bắt đầu triển khai đúng execution plan trong file:
- tạo implementation branch mới từ current main,
- mở draft PR,
- làm style guide,
- audit đủ 150 bài,
- golden set,
- rồi migration theo batch,
- giữ exact sync Solution.java ↔ Optimal Java solution,
- chạy đầy đủ validator/CI.

Đừng triển khai từ giả định cũ nếu main đã thay đổi; hãy inspect repo trước.
```

Thay `<PLAN_COMMIT_SHA>` bằng SHA commit thực tế chứa file kế hoạch này.
