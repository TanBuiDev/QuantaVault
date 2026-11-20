# KẾ HOẠCH BỔ SUNG CHÚ THÍCH GIẢI THÍCH OPTIMAL JAVA SOLUTION CHO TOP INTERVIEW 150

**Phạm vi:** toàn bộ 150 bài trong study plan Top Interview 150  
**Mục tiêu:** giữ nguyên thuật toán tối ưu nhưng bổ sung comment ngay trong code Java để người mới học hiểu được **vì sao dòng code khó tồn tại**, thay vì chỉ nhìn thấy một lời giải ngắn đã được nén ý tưởng.

---

## 1. Vấn đề cần giải quyết

Các `solution.md` hiện đã có các phần như Core idea, Observation, Dry run, Correctness và Complexity. Tuy nhiên phần `Optimal Java solution` thường vẫn giữ code rất ngắn và gần như không có chú thích.

Điều này gây khó cho người mới ở những dòng chứa nhiều ý tưởng thuật toán trong một biểu thức.

Ví dụ H-Index:

```java
count[Math.min(citation, n)]++;
```

Người đã hiểu thuật toán có thể đọc được ngay, nhưng newbie cần biết:

1. H-index tối đa chỉ bằng số bài `n`.
2. Vì vậy citation lớn hơn `n` không cần giữ chính xác.
3. `Math.min(citation, n)` đang thực hiện **bucket saturation**.
4. `count[n]` đại diện cho tất cả bài có citation `>= n`.

Tương tự Jump Game II:

```java
if (i == currentEnd) {
    jumps++;
    currentEnd = farthest;
}
```

Điểm khó không phải cú pháp `if`, mà là invariant:

- `currentEnd` = ranh giới cuối của tầng/lần nhảy hiện tại.
- `farthest` = ranh giới xa nhất của tầng/lần nhảy kế tiếp.
- `i == currentEnd` = đã xét hết tất cả lựa chọn thuộc số lần nhảy hiện tại, nên lúc này mới tăng `jumps`.

Kế hoạch này tập trung vào việc đưa những giải thích kiểu trên **vào ngay trong code optimal**.

---

# 2. Nguyên tắc cốt lõi

## 2.1. Comment phải giải thích WHY, không lặp lại WHAT

Không tốt:

```java
// Tăng i lên 1
i++;
```

Không tốt:

```java
// Trả về kết quả
return result;
```

Tốt:

```java
// H-index không thể lớn hơn số paper, nên mọi citation >= n
// có thể gom vào cùng bucket n mà không làm mất thông tin cần thiết.
count[Math.min(citation, n)]++;
```

Tốt:

```java
// Khi i chạm cuối vùng hiện tại, ta đã xét hết mọi vị trí có thể đạt
// bằng số jump hiện tại. Chuyển sang vùng tiếp theo và tính thêm 1 jump.
if (i == currentEnd) {
    jumps++;
    currentEnd = farthest;
}
```

---

## 2.2. Không comment mọi dòng

Mục tiêu không phải biến code thành tài liệu dài dòng.

Chỉ comment khi dòng/block chứa ít nhất một trong các yếu tố:

- invariant khó nhìn ra;
- greedy choice;
- DP transition;
- binary-search boundary;
- pointer movement không hiển nhiên;
- sentinel value;
- overflow prevention;
- bucket/frequency compression;
- prefix/suffix trick;
- monotonic stack invariant;
- heap comparator;
- graph visitation rule;
- union-find optimization;
- bit manipulation trick;
- Java API/cú pháp có khả năng gây nhầm cho newbie;
- một biểu thức đang nén nhiều bước suy luận.

Các dòng hiển nhiên như khai báo đơn giản, `return`, hoặc vòng lặp rất cơ bản không cần comment nếu không mang invariant đặc biệt.

---

## 2.3. Không thay đổi thuật toán trong migration này

Đây là **documentation/comment migration**, không phải algorithm rewrite.

Mỗi bài phải giữ nguyên:

- output;
- asymptotic time complexity;
- asymptotic space complexity;
- data structure chính;
- thuật toán canonical hiện tại.

Nếu phát hiện solution hiện tại có bug hoặc có thể tối ưu hơn, không âm thầm sửa trong cùng batch. Ghi vào report riêng để xử lý bằng task khác.

---

## 2.4. Comment phải gần dòng code mà nó giải thích

Không chỉ viết một đoạn dài ở phía trên `Optimal Java solution` rồi giữ code trống comment.

Người học cần có khả năng đọc:

```text
ý tưởng
  ↓
dòng code tương ứng
```

Comment nên nằm ngay trước statement/block khó.

---

## 2.5. Ưu tiên tiếng Việt dễ hiểu

Comment Java trong bộ học này ưu tiên tiếng Việt đơn giản, giữ các keyword thuật toán bằng tiếng Anh khi chúng giúp tra cứu kiến thức:

```java
// currentEnd là ranh giới của BFS level hiện tại.
// Khi i chạm ranh giới này, ta phải chuyển sang level tiếp theo.
```

Không cần dịch các thuật ngữ phổ biến như:

```text
Greedy
BFS
DFS
DP
sliding window
prefix sum
binary search
heap
monotonic stack
```

Nhưng phải giải thích vai trò của chúng trong bài cụ thể.

---

# 3. Phạm vi file cần xử lý

Mỗi problem hiện có tối thiểu hai nơi liên quan đến optimal Java code:

```text
problems/<section>/<id>-<slug>/Solution.java
problems/<section>/<id>-<slug>/solution.md
```

Migration phải kiểm tra cả hai.

## Quy tắc đồng bộ

Sau migration:

1. `Solution.java` chứa solution Java có comment học tập.
2. Code block trong mục `## Optimal Java solution` của `solution.md` phải khớp với `Solution.java` về logic và comment.
3. Không để tình trạng website hiển thị một bản nhưng file Java canonical lại là bản khác.

Nếu repo đã có hoặc sẽ có cơ chế sinh code block từ `Solution.java`, ưu tiên tự động hóa để tránh duplicate source of truth.

---

# 4. Chuẩn comment cho Optimal Java Solution

## 4.1. Comment cho biến mang invariant

Ví dụ Jump Game II:

```java
int jumps = 0;

// Ranh giới xa nhất có thể đạt với số jump hiện tại.
int currentEnd = 0;

// Trong lúc duyệt vùng hiện tại, đây là ranh giới xa nhất
// mà jump tiếp theo có thể mở rộng tới.
int farthest = 0;
```

Không cần comment biến tên đã tự giải thích nếu không có ý nghĩa đặc biệt.

---

## 4.2. Comment cho biểu thức bị nén

Thay vì để:

```java
count[Math.min(citation, n)]++;
```

comment chuẩn:

```java
// H-index tối đa là n, nên mọi citation >= n có thể gom vào bucket n.
// Ta không cần phân biệt 5, 10 hay 1_000 citations nếu n chỉ bằng 5.
count[Math.min(citation, n)]++;
```

---

## 4.3. Comment cho cumulative state

Ví dụ H-Index:

```java
// Duyệt h từ lớn xuống nhỏ. Sau khi cộng count[h], biến này
// chính là số paper có citation >= h.
papersAtLeastH += count[h];
```

---

## 4.4. Comment cho greedy decision

Ví dụ:

```java
// Chưa cần quyết định nhảy chính xác vào index nào.
// Ta chỉ giữ khả năng đi xa nhất trong toàn bộ vùng hiện tại.
if (i + nums[i] > farthest) {
    farthest = i + nums[i];
}
```

---

## 4.5. Comment cho binary search

Phải giải thích invariant/boundary, không chỉ nói "binary search".

Ví dụ:

```java
// Nếu mid vẫn thỏa điều kiện, đáp án có thể nằm ở mid hoặc bên phải,
// nên giữ mid bằng cách dịch left tới mid thay vì mid + 1 tùy invariant.
```

Mỗi bài phải comment đúng với variant binary search thực tế; không dùng template mù quáng.

---

## 4.6. Comment cho DP

Phải giải thích state và transition.

Ví dụ:

```java
// dp[i] là đáp án tốt nhất khi xét tới i.
// Chọn nums[i] nghĩa là không thể đồng thời chọn trạng thái xung đột trước đó.
```

Không chấp nhận comment kiểu:

```java
// Cập nhật dp
dp[i] = ...;
```

---

## 4.7. Comment cho two pointers / sliding window

Phải trả lời:

- Khi nào mở rộng `right`?
- Khi nào thu `left`?
- Window đang duy trì điều kiện gì?
- Vì sao bỏ phần tử bên trái là an toàn?

---

## 4.8. Comment cho stack/heap

Phải giải thích invariant của structure.

Ví dụ monotonic stack:

```java
// Stack giữ index có giá trị giảm dần.
// Khi current lớn hơn top, current là phần tử đầu tiên bên phải
// phá vỡ monotonic order và cho phép chốt đáp án của top.
```

---

## 4.9. Comment cho graph/tree

Ưu tiên giải thích:

- visited dùng để ngăn điều gì;
- DFS return value mang ý nghĩa gì;
- BFS level đại diện cho gì;
- tại sao có thể mark visited lúc enqueue thay vì dequeue;
- recursion đang trả thông tin lên parent như thế nào.

---

## 4.10. Comment cho Java-specific code khó

Những dòng như sau cần cân nhắc comment nếu người mới dễ nhầm:

```java
Integer.MAX_VALUE
Integer.MIN_VALUE
Math.min(...)
Math.max(...)
computeIfAbsent(...)
getOrDefault(...)
PriorityQueue comparator
Arrays.binarySearch(...)
Collections.reverse(...)
StringBuilder manipulation
char - '0'
long cast trước phép nhân
```

Không cần giải thích API ở mọi bài nếu cách dùng hiển nhiên; comment khi API đó là một phần của trick hoặc dễ gây bug.

---

# 5. Mẫu code mong muốn

## 5.1. H-Index sau migration

```java
class Solution {
    public int hIndex(int[] citations) {
        int n = citations.length;

        // H-index không thể lớn hơn số paper n.
        // count[n] vì vậy sẽ đại diện cho tất cả citation >= n.
        int[] count = new int[n + 1];

        for (int citation : citations) {
            // Gom citation vượt n vào bucket n vì phần vượt quá n
            // không thể làm H-index lớn hơn n.
            count[Math.min(citation, n)]++;
        }

        int papersAtLeastH = 0;

        for (int h = n; h >= 0; h--) {
            // Vì duyệt từ lớn xuống, cumulative count tại đây
            // chính là số paper có ít nhất h citations.
            papersAtLeastH += count[h];

            // Đây là đúng định nghĩa H-index. Ta thử từ h lớn nhất xuống,
            // nên h hợp lệ đầu tiên cũng là đáp án lớn nhất.
            if (papersAtLeastH >= h) {
                return h;
            }
        }

        return 0;
    }
}
```

---

## 5.2. Jump Game II sau migration

```java
class Solution {
    public int jump(int[] nums) {
        int jumps = 0;

        // Cuối vùng có thể đạt bằng số jump hiện tại.
        int currentEnd = 0;

        // Trong vùng hiện tại, lưu vị trí xa nhất mà jump kế tiếp có thể tới.
        int farthest = 0;

        for (int i = 0; i < nums.length - 1; i++) {
            if (i + nums[i] > farthest) {
                farthest = i + nums[i];
            }

            // i chạm currentEnd nghĩa là đã xét hết toàn bộ lựa chọn
            // của "tầng" hiện tại. Muốn đi tiếp phải dùng thêm một jump.
            if (i == currentEnd) {
                jumps++;
                currentEnd = farthest;
            }
        }

        return jumps;
    }
}
```

Các comment trên giải thích invariant; không comment những dòng hiển nhiên như `return jumps`.

---

# 6. Phân loại mức độ cần comment

Trong bước audit, mỗi bài được gán một mức:

## Level A — Ít comment

Thuật toán gần như tự mô tả bằng tên biến và control flow.

Ví dụ đặc điểm:

- vòng lặp tuyến tính đơn giản;
- phép đếm trực tiếp;
- không có invariant ẩn.

Mục tiêu: khoảng 1–3 comment có giá trị.

## Level B — Comment trung bình

Có một hoặc nhiều trick cần giải thích:

- two pointers;
- prefix/suffix;
- greedy;
- hash map invariant;
- sorting + scan.

Mục tiêu: comment theo conceptual block, không theo từng dòng.

## Level C — Comment bắt buộc chi tiết

Các bài có code optimal ngắn nhưng reasoning khó:

- Jump Game II;
- H-Index bucket saturation;
- binary search boundary khó;
- DP tối ưu space;
- monotonic stack;
- advanced graph/tree recursion;
- heap + lazy deletion;
- bit tricks;
- in-place marking/cycle placement.

Mục tiêu: người mới có thể nối được từng invariant quan trọng với dòng code tương ứng.

---

# 7. Audit toàn bộ 150 bài trước khi sửa

Không sửa ngay từ bài 1 tới 150 mà không có baseline.

Tạo tool/report:

```text
tools/audit_java_solution_comments.py
reports/java-solution-comment-audit.json
reports/java-solution-comment-audit.md
```

Report gợi ý:

```json
{
  "problem_id": 274,
  "slug": "h-index",
  "section": "array-string",
  "solution_java_comment_lines": 0,
  "optimal_block_comment_lines": 0,
  "difficulty_level": "C",
  "hard_constructs": [
    "bucket-saturation",
    "cumulative-count",
    "Math.min"
  ],
  "status": "needs-comments"
}
```

Audit tool không cần cố đánh giá chất lượng ngôn ngữ bằng heuristic phức tạp. Mục tiêu của tool là inventory và tracking; chất lượng comment vẫn cần review theo rubric.

---

# 8. Rubric xác định một dòng/block "khó"

Khi review từng optimal solution, đặt các câu hỏi sau:

1. Newbie có thể hiểu biến này đại diện cho gì chỉ từ tên không?
2. Dòng này có đang nén từ hai bước reasoning trở lên không?
3. Có invariant nào phải luôn đúng sau mỗi vòng lặp không?
4. Nếu thay đổi một boundary (`<`, `<=`, `+1`, `-1`) thì thuật toán có hỏng không?
5. Có greedy choice nào không hiển nhiên là an toàn không?
6. Có dữ liệu nào bị intentionally discard/compress không?
7. Có sentinel/default value nào cần lý do không?
8. Có API Java nào đang thực hiện một trick quan trọng không?
9. Có cumulative state nào chỉ hiểu được nếu biết thứ tự duyệt không?
10. Người mới có khả năng hỏi "tại sao lại có dòng này?" không?

Nếu câu trả lời là có, dòng/block đó là comment candidate.

---

# 9. Quy trình xử lý một bài

Mỗi bài phải đi qua đúng workflow sau.

## Step 1 — Đọc đủ context

Đọc:

```text
problem.md
solution.md
Solution.java
cases.yaml
```

Nếu cần, đọc thêm `hints.md` và `interview.md` để hiểu intended reasoning.

## Step 2 — Xác định algorithm invariant

Trước khi viết comment, ghi ngắn trong scratch/review:

```text
State/invariant:
Greedy/DP choice:
Boundary:
Non-obvious Java constructs:
```

Nếu agent không giải thích được invariant bằng lời thì chưa được sửa code.

## Step 3 — Mark comment candidates

Không edit ngay. Đánh dấu các dòng cần comment.

## Step 4 — Viết comment WHY

Comment ngắn, sát code, dễ hiểu.

## Step 5 — Đồng bộ hai file

Cập nhật:

```text
Solution.java
solution.md -> Optimal Java solution
```

## Step 6 — Kiểm tra semantic diff

Loại bỏ comment và whitespace rồi so sánh code trước/sau.

Mục tiêu:

```text
semantic code before == semantic code after
```

Nếu khác, migration phải dừng để review.

## Step 7 — Test

Chạy validator/test hiện có cho bài hoặc toàn repo theo khả năng tooling.

## Step 8 — Manual review

Reviewer tự hỏi:

> Sau khi chỉ đọc code block này, người mới có hiểu được lý do của các dòng khó hơn trước không?

---

# 10. Triển khai theo batch

Không nên sửa cả 150 bài trong một commit.

## Phase 0 — Chuẩn comment và tooling

Deliverables:

- [ ] Tài liệu chuẩn comment này được duyệt.
- [ ] Audit tool.
- [ ] Progress report.
- [ ] Rule đồng bộ `Solution.java` / `solution.md`.
- [ ] Semantic-diff check.

---

## Phase 1 — Pilot

Chọn khoảng 8–12 bài đại diện cho nhiều pattern.

Bắt buộc có:

- [ ] #274 H-Index — bucket/cumulative reasoning.
- [ ] #45 Jump Game II — greedy/BFS-level invariant.
- [ ] #55 Jump Game — greedy reach invariant.
- [ ] #121 Best Time to Buy and Sell Stock — running minimum.

Sau đó chọn thêm bài đại diện từ:

```text
binary search
sliding window
two pointers
linked list
tree
graph
DP
heap
stack
matrix
```

Mục tiêu của pilot là điều chỉnh style trước khi mass-edit.

---

## Phase 2 — Batch migration

Sau khi pilot được duyệt, chia 150 bài thành batch nhỏ.

Khuyến nghị:

```text
10–15 bài / batch
```

hoặc theo section nếu section nhỏ.

Mỗi batch phải có:

```text
problem IDs
files changed
comment level A/B/C
semantic diff result
test result
review status
```

Không mở batch mới quá lớn khi batch trước chưa review.

---

## Phase 3 — High-complexity review

Tách riêng toàn bộ Level C để review lần hai.

Đặc biệt kiểm tra:

- binary search off-by-one;
- optimized DP;
- monotonic stack;
- recursive tree state;
- graph state/visited;
- greedy correctness;
- in-place mutation;
- arithmetic overflow;
- Java comparator/casting.

---

## Phase 4 — Full consistency pass

Sau khi đủ 150 bài:

- [ ] kiểm tra không bài nào thiếu `Optimal Java solution`;
- [ ] kiểm tra `Solution.java` và code block sync;
- [ ] kiểm tra comment không stale;
- [ ] kiểm tra không comment sai logic;
- [ ] kiểm tra không over-comment code trivial;
- [ ] chạy full tests/build/validator;
- [ ] sinh final coverage report.

---

# 11. Progress tracking

Tạo manifest/report để tránh bỏ sót bài:

```text
reports/java-solution-comment-progress.csv
```

Schema gợi ý:

```text
problem_id,section,slug,level,status,solution_java_synced,solution_md_synced,semantic_diff,tested,reviewed
```

Status:

```text
pending
audited
in-progress
needs-review
approved
```

Definition của `approved`:

```text
Solution.java updated
+ solution.md updated
+ semantic diff clean
+ tests pass
+ comment rubric pass
```

---

# 12. Validator / CI cần bổ sung

Không thể tự động đánh giá hoàn toàn một comment có "dễ hiểu" hay không, nhưng CI có thể ngăn nhiều lỗi cơ học.

Tạo hoặc mở rộng validator để kiểm tra:

## 12.1. Optimal Java block tồn tại

Mỗi `solution.md` phải có đúng section canonical.

## 12.2. Java code block parse được

Không để comment làm vỡ fenced code block.

## 12.3. Solution.java và solution.md không drift

Có thể normalize whitespace rồi so sánh code block với `Solution.java`.

Nếu comment được giữ ở cả hai nơi, so sánh đầy đủ cả comment.

## 12.4. Không thay code trong comment-only PR ngoài allowlist

Script có thể strip:

```text
// comment
/* comment */
whitespace
```

rồi so sánh với baseline.

Nếu token code thay đổi thì báo lỗi/review required.

## 12.5. Coverage

CI/report phải đếm:

```text
150 total
150 audited
150 synced
150 approved
```

Không dựa vào "ước lượng gần đủ".

---

# 13. Quy tắc cho AI/code agent khi triển khai

Agent phải tuân thủ prompt contract:

> Read the problem, current solution explanation, Java implementation, and tests before editing. Add comments that explain non-obvious algorithmic WHY/invariants directly next to the relevant Optimal Java code. Do not rewrite the algorithm, change complexity, rename variables unnecessarily, or modify raw/problem content. Keep `Solution.java` and the `Optimal Java solution` block in `solution.md` synchronized. If the current algorithm appears incorrect, stop and flag it instead of silently fixing it.

Agent không được:

- tự thay optimal solution bằng một solution khác;
- thêm comment mô tả cú pháp hiển nhiên;
- tạo comment sai chỉ để đạt comment coverage;
- sửa đề bài;
- sửa test để code pass;
- đổi variable name hàng loạt nếu không cần;
- dùng một template comment giống nhau cho mọi pattern.

---

# 14. Chất lượng comment mong muốn

## Bad

```java
// Lặp qua mảng
for (int i = 0; i < nums.length; i++) {
```

## Bad

```java
// Tìm max
farthest = Math.max(farthest, i + nums[i]);
```

## Good

```java
// Không cần chọn ngay index sẽ nhảy tới. Trong toàn bộ vùng hiện tại,
// chỉ cần nhớ khả năng đi xa nhất để xác định ranh giới của jump kế tiếp.
farthest = Math.max(farthest, i + nums[i]);
```

## Bad

```java
// Dùng min
count[Math.min(citation, n)]++;
```

## Good

```java
// H-index <= n, nên citation lớn hơn n không mang thêm thông tin.
// Gom toàn bộ citation >= n vào bucket n.
count[Math.min(citation, n)]++;
```

---

# 15. Comment density guideline

Không đặt quota cứng theo số dòng, nhưng có guideline:

```text
Level A: 1–3 conceptual comments
Level B: 2–6 conceptual comments
Level C: đủ comment để cover mọi invariant/trick chính
```

Một conceptual comment có thể dài 1–3 dòng.

Nếu comment dài hơn code quá nhiều, xem xét chuyển phần giải thích chi tiết sang `solution.md` và giữ trong code bản tóm tắt WHY.

Code block phải vẫn đọc được như code, không biến thành essay.

---

# 16. Những nhóm bài cần chú ý đặc biệt

## Array / String

- running min/max;
- prefix/suffix;
- index vs value;
- in-place overwrite;
- bucket counting;
- greedy boundary.

## Two Pointers

- lý do tăng trái/phải;
- invariant của vùng đã xử lý.

## Sliding Window

- window condition;
- khi nào shrink;
- frequency count có ý nghĩa gì.

## Matrix

- coordinate mapping;
- boundary/layer;
- in-place marker.

## Hash Map / Set

- key/value đang đại diện gì;
- tại sao lookup hiện tại đủ để quyết định.

## Intervals

- sorting key;
- overlap invariant;
- merge condition.

## Stack

- stack invariant;
- tại sao pop ở thời điểm hiện tại.

## Linked List

- dummy node;
- slow/fast pointer;
- pointer rewiring order để không mất list.

## Binary Tree

- recursion return contract;
- global vs local state;
- traversal order.

## Graph

- visited timing;
- BFS level;
- DFS state/color;
- cycle detection.

## Heap

- comparator;
- heap giữ top-k theo chiều nào;
- khi nào pop.

## Binary Search

- search space;
- invariant;
- inclusive/exclusive boundary.

## Backtracking

- choice;
- recurse;
- undo;
- pruning reason.

## DP

- state definition;
- base case;
- transition;
- iteration order;
- space optimization.

## Math / Bit

- identity/trick;
- overflow;
- signed behavior;
- masking/shifting.

---

# 17. Test strategy

Comment-only migration vẫn phải test.

## 17.1. Java compile/test

Tất cả `Solution.java` bị thay đổi phải compile bằng cơ chế hiện có của repo.

## 17.2. Existing cases

Không đổi expected output.

## 17.3. Semantic diff

Đây là check quan trọng nhất của migration:

```text
stripComments(newCode) == stripComments(oldCode)
```

sau normalization phù hợp.

Nếu false, cần manual review.

## 17.4. Markdown rendering

Đảm bảo comment Java không phá fenced code block trong website.

## 17.5. Representative visual QA

Mỗi pattern chọn ít nhất một bài để mở trên web và kiểm tra readability.

---

# 18. Commit strategy

Không commit toàn bộ 150 bài một lần.

Gợi ý:

```text
docs: define optimal Java commenting standard
chore(content): add Java solution comment audit
content(java): annotate array-string optimal solutions batch 1
content(java): annotate array-string optimal solutions batch 2
content(java): annotate two-pointers solutions
content(java): annotate sliding-window solutions
...
validation: enforce Java solution sync
content(java): finish Top Interview 150 comment coverage
```

Mỗi commit phải review được độc lập.

---

# 19. Definition of Done cho từng bài

Một bài chỉ được đánh dấu hoàn thành khi:

- [ ] Đã đọc và hiểu solution hiện tại.
- [ ] Đã xác định invariant/trick khó.
- [ ] `Solution.java` có comment WHY phù hợp.
- [ ] `solution.md` Optimal Java block có cùng comment/code.
- [ ] Không thêm comment trivial dư thừa.
- [ ] Không thay đổi thuật toán.
- [ ] Semantic diff pass.
- [ ] Existing tests/cases pass.
- [ ] Reviewer xác nhận comment đúng logic.

---

# 20. Definition of Done cho toàn bộ 150 bài

Migration hoàn tất khi:

- [ ] 150/150 bài đã audit.
- [ ] 150/150 bài có status `approved` hoặc có documented exception.
- [ ] Không còn Level C bài nào chưa manual review.
- [ ] `Solution.java` và `solution.md` đồng bộ 100%.
- [ ] Full validator pass.
- [ ] Full relevant tests pass.
- [ ] Website build pass.
- [ ] Không phát hiện semantic code change ngoài approved exceptions.
- [ ] Coverage report được commit.

---

# 21. Thứ tự triển khai đề xuất

```text
PHASE 0
Duyệt chuẩn comment
        |
        v
PHASE 1
Audit 150 bài + phân Level A/B/C
        |
        v
PHASE 2
Pilot 8–12 bài
(#274, #45, #55, #121 + pattern representatives)
        |
        v
PHASE 3
Review pilot + chỉnh style
        |
        v
PHASE 4
Migration theo batch 10–15 bài
        |
        v
PHASE 5
Level C second review
        |
        v
PHASE 6
Sync validator + semantic diff CI
        |
        v
PHASE 7
Full audit/build/test/visual QA
        |
        v
150/150 APPROVED
```

Không nên bỏ Phase 1 và đi thẳng vào mass edit, vì như vậy rất dễ tạo comment không đồng đều hoặc comment sai invariant.

---

# 22. Checklist triển khai thực tế

## Chuẩn bị

- [ ] Tạo feature branch cho migration.
- [ ] Freeze baseline của 150 `Solution.java`.
- [ ] Freeze baseline của 150 `solution.md`.
- [ ] Viết audit tool.
- [ ] Sinh initial coverage report.

## Pilot

- [ ] #274 H-Index.
- [ ] #45 Jump Game II.
- [ ] #55 Jump Game.
- [ ] #121 Best Time to Buy and Sell Stock.
- [ ] Chọn binary-search representative.
- [ ] Chọn sliding-window representative.
- [ ] Chọn tree/graph representative.
- [ ] Chọn DP representative.
- [ ] Review readability trên website.

## Batch migration

- [ ] Batch 1.
- [ ] Review.
- [ ] Batch 2.
- [ ] Review.
- [ ] Tiếp tục tới 150.

## Validation

- [ ] Semantic diff cho toàn bộ changed Java.
- [ ] Solution.java/solution.md sync check.
- [ ] Existing tests.
- [ ] Validator.
- [ ] Web build.

## Final QA

- [ ] 150/150 audited.
- [ ] 150/150 approved/exception documented.
- [ ] Level C reviewed lần 2.
- [ ] Final coverage report.
- [ ] Final git diff review.

---

# 23. Quy tắc cuối cùng

> **Optimal solution không chỉ cần chạy nhanh; trong một repository dùng để học, người đọc còn phải hiểu vì sao nó đúng.**

Vì vậy comment phải tập trung vào những câu hỏi newbie thực sự gặp:

```text
Tại sao cần biến này?
Biến này đang đại diện cho gì?
Tại sao điều kiện này xuất hiện?
Tại sao có thể bỏ thông tin này?
Tại sao lựa chọn greedy này an toàn?
Tại sao phải duyệt theo thứ tự này?
Tại sao boundary là < thay vì <=?
Tại sao cộng dồn ở đây?
Tại sao dùng Math.min/Math.max tại đây?
Tại sao thuật toán vẫn đúng sau lần lặp này?
```

Nếu comment trả lời được các câu hỏi trên ngay cạnh code, phần `Optimal Java solution` mới thực sự phù hợp cho mục tiêu học và luyện phỏng vấn của repository.
