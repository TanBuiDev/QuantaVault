# Newbie-first Solution Style Guide

> Version 1.0 — reference guide cho migration `solution.md` của LeetCode Top Interview 150.
>
> Mục tiêu của guide này không phải tạo một template cứng. Mục tiêu là giữ **cùng triết lý sư phạm** giữa 150 bài: người mới phải thấy được thuật toán được hình thành từ bài toán, thay vì chỉ thấy tên pattern và code tối ưu.

---

## 1. Reader persona

Reader mặc định:

- đã biết Java cơ bản: biến, `if`, loop, method, array;
- có thể chưa biết hoặc chỉ mới nghe tên các pattern DSA;
- chưa quen suy luận invariant, state transition, pointer boundary, graph model, prefix/suffix, heap, trie, DP;
- có thể đọc code sau khi biết **mỗi biến đang đại diện điều gì**;
- cần một ví dụ cụ thể trước khi tiếp nhận công thức tổng quát.

Không giả định reader biết trước:

- tại sao bài này là greedy/BFS/DP;
- tại sao một state/structure cụ thể cần tồn tại;
- tại sao update order lại đúng;
- tại sao một optimization loại bỏ được bottleneck;
- các Java API ít gặp.

### Success test

Một bài đạt tinh thần newbie-first nếu người đọc có thể trả lời:

1. Đề đang yêu cầu output gì?
2. Nếu tự làm bằng tay trên input nhỏ, mình sẽ làm gì?
3. Cách tự nhiên đầu tiên bị chậm/thừa ở đâu?
4. Observation nào tạo ra optimal idea?
5. Mỗi state/variable/data structure khó đang lưu thông tin gì và vì sao?
6. Code Java hiện thực observation đó ở chỗ nào?
7. Khi gặp bài tương tự, tín hiệu nào gợi lại cách nghĩ này?

Nếu câu trả lời chỉ là “vì đây là pattern X”, bài chưa đạt.

---

## 2. Quy tắc cốt lõi: concrete → abstract

Luôn ưu tiên luồng:

```text
ví dụ cụ thể
→ điều mình quan sát được
→ quy tắc tổng quát
→ tên pattern / thuật ngữ DSA
→ state / data structure
→ code
```

Tránh luồng ngược:

```text
pattern
→ công thức
→ code
→ ví dụ giải thích sau
```

### 2.1. Bắt đầu từ câu hỏi người học thật sự có

Ví dụ:

- “Ở ngày hôm nay, mình cần nhớ gì từ các ngày trước?”
- “Nếu bỏ phần tử này đi, kết quả tại index `i` cần những số nào?”
- “Tại sao tăng `left` mà không tăng `right`?”
- “Nếu mình đã đi được `k` bước, những vị trí nào đang reachable?”
- “Hàm DFS này trả gì cho parent, và đáp án toàn cục đang lưu gì?”

Những câu hỏi này nên xuất hiện trước thuật ngữ học thuật nếu chúng giúp sinh ra intuition.

### 2.2. Không dùng một khái niệm chưa giải thích để giải thích khái niệm khác

Không tốt:

```text
`currentEnd` là BFS level boundary.
```

Tốt hơn:

```text
Sau cùng một số lần nhảy, ta có thể đứng trong một vùng liên tiếp.
`currentEnd` là vị trí cuối của vùng đó. Khi duyệt hết vùng này, ta buộc phải dùng thêm một jump.
Cách nhìn này tương đương việc hoàn thành một level trong BFS.
```

---

## 3. Cấu trúc nội dung linh hoạt

Không bắt buộc mọi bài có cùng heading. Tuy nhiên nội dung nên bao phủ các layer phù hợp dưới đây.

### Layer A — Hiểu đề

- Bài toán thực sự hỏi gì?
- Input/output cần hiểu thế nào?
- Constraint hoặc semantics nào dễ hiểu sai?
- Một ví dụ nhỏ giải bằng tay.

### Layer B — Hình thành thuật toán

- Cách nghĩ tự nhiên đầu tiên.
- Bottleneck của cách đó.
- Observation giúp bỏ phần thừa.
- Từ observation sinh ra state/variable/data structure.
- Nếu có invariant hoặc update order khó, giải thích trước code.

### Layer C — Implementation

- `Optimal Java solution` canonical.
- Java note chỉ khi syntax/API là blocker.
- Dry run theo đúng tên biến/state của implementation.

### Layer D — Tổng kết

- Correctness bằng ngôn ngữ dễ đọc.
- Time/space complexity.
- Edge cases.
- Common mistakes.
- Pattern recognition / transfer knowledge.

### 3.1. Không dùng template cứng

Một bài scan đơn giản không cần 13 headings. Một bài như LRU Cache hoặc Median of Two Sorted Arrays có thể cần nhiều diagram và worked examples hơn.

Chất lượng được đo bằng việc reasoning có đủ cầu nối, không phải số heading.

---

## 4. Thuật ngữ và naming

### 4.1. Giải thích trước, gọi tên sau

Không tốt:

```text
Dùng sliding window.
```

Tốt hơn:

```text
Ta đang theo dõi một đoạn liên tiếp. Khi thêm phần tử bên phải, đoạn có thể vi phạm điều kiện; khi đó ta bỏ dần phần tử bên trái cho đến khi hợp lệ lại.
Đây chính là mô hình sliding window.
```

### 4.2. Thuật ngữ tiếng Anh được phép, nhưng phải có mental model

Các từ như `prefix`, `suffix`, `invariant`, `partition`, `sentinel`, `frontier`, `heap`, `trie`, `memoization`, `state transition` có thể giữ nguyên để reader quen ngôn ngữ phỏng vấn.

Lần đầu xuất hiện trong một bài, nếu từ đó là chìa khóa để hiểu algorithm, phải kèm giải thích ngắn.

### 4.3. State phải được diễn đạt thành câu đầy đủ

Không tốt:

```text
buy[t]
sell[t]
```

Tốt hơn:

```text
`buy[t]` = số tiền tốt nhất ta có thể còn lại khi đang giữ cổ phiếu sau khi đã mở giao dịch thứ `t`.
`sell[t]` = lợi nhuận tốt nhất sau khi đã hoàn thành tối đa `t` giao dịch và hiện không giữ cổ phiếu.
```

Sau đó mới đưa transition.

---

## 5. Quy tắc comment trong `Optimal Java solution`

Code canonical phải tiếp tục dễ đọc và exact-sync với `Solution.java`.

### 5.1. Comment nên trả lời WHY

Comment tốt tập trung vào:

- invariant khó;
- lý do move pointer;
- lý do update trước/sau;
- edge case dễ sai;
- quan hệ giữa hai data structures;
- giá trị return của recursion khác global answer;
- sentinel/boundary mang ý nghĩa gì.

Ví dụ tốt:

```java
answer[i] = prefix;      // Chỉ dùng các số bên trái i, nên gán trước khi nhân nums[i].
prefix *= nums[i];
```

Ví dụ không tốt:

```java
prefix *= nums[i]; // nhân prefix với nums[i]
```

### 5.2. Phần giải thích dài đặt trước code

Không biến code thành bài văn. Nếu một ý cần ba câu để giải thích, đặt nó trong prose/diagram trước code và để comment trong code là reminder ngắn.

### 5.3. Không comment dòng hiển nhiên

Tránh:

```java
return true; // trả về true
left++;      // tăng left lên 1
```

Trừ khi dòng đó có semantic khó hơn cú pháp bề mặt.

### 5.4. Không thay algorithm chỉ để “dễ giải thích hơn”

Nếu `Solution.java` đang canonical/correct, migration chủ yếu sửa `solution.md`.

Nếu cần đổi code logic:

- coi đó là correctness change riêng;
- ghi rõ lý do;
- thêm/điều chỉnh test;
- đồng bộ exact block trong `solution.md`.

---

## 6. Java Notes

Java Notes chỉ xuất hiện khi syntax/API thật sự cản trở người mới hiểu thuật toán.

### 6.1. Inline note cho một blocker nhỏ

Ví dụ:

```text
Java note: `for (int price : prices)` cho `price` là value hiện tại, không phải index.
```

### 6.2. Small Java Notes section khi nhiều API phối hợp

Ví dụ `HashMap + ArrayList`:

```text
`values.get(i)`          → lấy value tại index `i`
`values.set(i, x)`       → thay value tại index `i`
`indexByValue.put(v, i)` → lưu ánh xạ value → index
`containsKey(v)`         → kiểm tra key tồn tại
```

### 6.3. API thường cần note khi là blocker

- `Map<K,V>` / `HashMap`
- `ArrayList.add/get/set/remove`
- `Deque.push/pop/peek`
- `PriorityQueue.offer/poll/peek`
- `Collections.reverseOrder()`
- `computeIfAbsent`
- lambda/comparator cơ bản
- `Integer.MAX_VALUE/MIN_VALUE`
- bit operators
- generics
- enhanced for nếu value/index dễ nhầm

### 6.4. Không lặp tutorial Java

Nếu syntax đơn giản không ảnh hưởng reasoning, bỏ qua. Tài liệu là DSA learning, không phải Java language reference.

---

## 7. Worked example và dry run

Worked example và dry run phục vụ hai mục tiêu khác nhau.

### 7.1. Worked example trước algorithm

Mục tiêu: giúp reader **tự nhìn thấy observation**.

Ví dụ Product of Array Except Self:

```text
nums = [2, 3, 4, 5]

i = 2, nums[i] = 4
answer[2] phải dùng 2 × 3 × 5
          = (tích bên trái i) × (tích bên phải i)
```

Từ đây mới sinh `prefix` và `suffix`.

### 7.2. Dry run sau code

Mục tiêu: chứng minh reader hiểu implementation thực tế.

Dry run phải dùng **đúng tên biến code**:

```text
i | prefix trước gán | answer[i] | prefix sau update
0 | 1                | 1         | 2
1 | 2                | 2         | 6
2 | 6                | 6         | 24
```

Sau pass suffix, trace tiếp `suffix` nếu đó là phần dễ sai.

### 7.3. Dry run nên tập trung vào thời điểm state đổi

Không cần trace mọi dòng nếu chúng không giúp học. Ưu tiên:

- lúc window từ valid → invalid → valid;
- lúc greedy commit một bước;
- lúc heap rebalance;
- lúc pointer rewiring;
- lúc DFS update global answer;
- lúc DP transition chọn giữa hai lựa chọn;
- lúc binary search loại một nửa search space.

---

## 8. Correctness và invariant

### 8.1. Giải thích invariant bằng ngôn ngữ thường trước

Không tốt:

```text
Invariant: left partition contains k elements.
```

Tốt hơn:

```text
Ta luôn chọn hai vạch cắt sao cho tổng số phần tử nằm bên trái đúng bằng nửa cần thiết của hai mảng.
Nói theo thuật ngữ formal hơn, đó là invariant về kích thước left partition.
```

### 8.2. Correctness nên trả lời “vì sao không bỏ lỡ đáp án?”

Một proof dễ đọc thường gồm:

1. state/structure đang đại diện đúng thông tin gì;
2. mỗi update giữ thông tin đó đúng như thế nào;
3. tại sao khi kết thúc nó chính là output cần tìm.

### 8.3. Với recursion, tách local return và global answer

Nếu DFS return một loại giá trị nhưng global answer xét một loại path/subtree khác, phải nói rõ hai vai trò.

---

## 9. Độ dài theo pedagogy tier

Không áp line-count cứng.

### Tier 1 — Straightforward

Ví dụ: simple scan, direct mapping, basic two pointers.

Tối thiểu nên có:

```text
hiểu đề
→ concrete observation
→ optimal code
→ dry run ngắn
→ complexity + mistakes
```

Không cần brute force dài nếu không tạo thêm insight.

### Tier 2 — Pattern-heavy

Ví dụ: sliding window, interval, stack, linked list manipulation, standard tree traversal, binary search variants.

Thường cần:

```text
natural approach
→ bottleneck
→ pattern derivation
→ meaning của variables
→ worked example
→ code
→ dry run
```

### Tier 3 — Concept-heavy / Hard

Ví dụ: Basic Calculator, LRU Cache, Binary Tree Maximum Path Sum, Median of Two Sorted Arrays, Stock IV, Word Search II.

Thường cần:

- mental model/diagram;
- nhiều hơn một worked step nếu cần;
- state/data-structure contract rõ;
- update order/boundary reasoning;
- dry run đủ chi tiết để trace;
- correctness có bridge từ trực giác sang formal.

---

# 10. Bad → good benchmarks

## 10.1. Greedy — Jump Game II style

### Bad

```text
Use greedy. Track `farthest` and `currentEnd`. When `i == currentEnd`, increment jumps.
```

Vấn đề: reader không biết tại sao `currentEnd` tồn tại và vì sao increment jump tại boundary đó.

### Good

```text
Bắt đầu ở index 0.

- Với 0 jumps, ta chỉ ở index 0.
- Sau 1 jump, ta có thể đến một vùng các index liên tiếp.
- Khi đang quét toàn bộ vùng reachable bằng cùng số jumps, mỗi index lại cho biết ta có thể mở rộng xa nhất tới đâu ở bước kế tiếp.

`currentEnd` = cuối vùng reachable với số jumps hiện tại.
`farthest` = xa nhất mà mọi vị trí đã quét trong vùng này có thể mở ra cho jump tiếp theo.

Khi `i == currentEnd`, ta đã xét hết lựa chọn của level hiện tại. Nếu chưa tới đích, phải dùng thêm một jump và đặt boundary mới thành `farthest`.

Đây là greedy nhìn dưới góc độ các lớp reachable; nó cũng tương đương BFS level nhưng không cần queue.
```

## 10.2. BFS — Word Ladder style

### Bad

```text
This is BFS on an implicit unweighted graph.
```

### Good

```text
Mỗi phép biến đổi được đổi đúng một ký tự.
Ta cần ít phép đổi nhất.

Ví dụ:

hit → hot → dot → dog → cog

Nếu coi mỗi word là một điểm, và nối hai điểm khi chúng khác đúng một ký tự, mỗi edge đều có cùng “chi phí” là 1 lần đổi.
Vì ta cần số edge ít nhất, ta muốn xét tất cả word cách start 1 bước trước, rồi 2 bước, rồi 3 bước. Đó chính là BFS.
```

## 10.3. DP — Stock IV style

### Bad

```text
buy[t] = max(buy[t], sell[t - 1] - price)
sell[t] = max(sell[t], buy[t] + price)
```

### Good

```text
Ở mỗi ngày, với giao dịch thứ `t`, ta cần phân biệt hai trạng thái:

- đang giữ cổ phiếu;
- không giữ cổ phiếu.

`buy[t]` lưu giá trị tốt nhất của trạng thái “đang giữ” sau khi đã bắt đầu giao dịch thứ `t`.
Nếu mua hôm nay, ta phải xuất phát từ trạng thái đã hoàn thành tối đa `t - 1` lần bán: `sell[t - 1] - price`.
Nếu không mua hôm nay, ta giữ nguyên `buy[t]` cũ.

Vì vậy:

`buy[t] = max(buy[t], sell[t - 1] - price)`

Tương tự, `sell[t]` chọn giữa giữ lợi nhuận cũ hoặc bán cổ phiếu đang giữ hôm nay.
```

## 10.4. Prefix/suffix — Product Except Self style

### Bad

```text
Use prefix and suffix products in two passes.
```

### Good

```text
Với `nums = [2,3,4,5]`, tại `i = 2` ta phải bỏ `4` và nhân `2 × 3 × 5`.

Nhóm các số còn lại thành hai phía:

- bên trái `i`: `2 × 3`;
- bên phải `i`: `5`.

Vậy `answer[i] = leftProduct × rightProduct`.
Ta không cần lưu hai mảng nếu duyệt một lần từ trái với `prefix`, rồi một lần từ phải với `suffix`.

Điểm dễ sai: phải gán `answer[i] = prefix` **trước** `prefix *= nums[i]`, vì `nums[i]` chính là phần tử cần bị loại khỏi tích tại `i`.
```

## 10.5. Linked list pointers — remove/relink style

### Bad

```text
Set `prev.next = curr.next` and `curr.next.prev = prev`.
```

### Good

```text
Trước khi viết pointer, nhìn liên kết:

A <-> B <-> C
     ^ remove

Sau khi bỏ B, mục tiêu là:

A <------> C

Nghĩa là có hai mũi tên phải sửa:

1. `A.next` phải trỏ tới `C`;
2. `C.prev` phải trỏ lại `A`.

Code pointer chỉ là hiện thực hai mũi tên đó. Diagram phải xuất hiện trước thao tác rewiring phức tạp.
```

## 10.6. Java collections — RandomizedSet style

### Bad

```text
Use HashMap and ArrayList for O(1).
```

### Good

```text
Ta cần hai chiều tra cứu khác nhau:

ArrayList: index → value
HashMap:   value → index

`getRandom()` cần chọn một index ngẫu nhiên nên ArrayList phù hợp.
`remove(value)` cần tìm ngay value đang ở index nào nên HashMap phù hợp.

Nếu xóa giữa ArrayList trực tiếp, các phần tử sau bị shift. Ta tránh việc đó bằng cách chuyển phần tử cuối vào chỗ cần xóa, cập nhật map cho phần tử vừa chuyển, rồi xóa phần tử cuối.

Java note:
- `values.set(i, last)` thay value tại index `i` mà không thay kích thước list;
- `values.remove(values.size() - 1)` xóa cuối list, không gây shift phần tử phía sau.
```

---

# 11. Guidance theo pattern

## 11.1. Array / running state

Luôn hỏi:

```text
Ở vị trí hiện tại, mình thật sự cần nhớ gì từ quá khứ?
```

Nếu chỉ cần một statistic như `minPrice`, `maxSeen`, `prefix`, hãy giải thích tại sao history đầy đủ là thừa.

## 11.2. Two pointers

Phải làm rõ:

- mỗi pointer đại diện boundary nào;
- vùng nào đã xử lý xong;
- tại sao move pointer này chứ không phải pointer kia;
- điều gì đảm bảo không bỏ lỡ đáp án.

## 11.3. Sliding window

Phải trả lời:

```text
window biểu diễn đoạn nào?
condition nào làm window valid?
expand để khám phá điều gì?
shrink để khôi phục điều gì?
khi nào cập nhật answer?
```

## 11.4. Matrix

Nếu có in-place marking, boundary hoặc direction traversal, dùng matrix nhỏ để chỉ state trước/sau.

## 11.5. HashMap / counting

Không chỉ nói “lookup O(1)”. Nêu rõ key và value đang đại diện điều gì.

## 11.6. Intervals

Cho reader thấy hai interval overlap/non-overlap trước điều kiện so sánh endpoint.

## 11.7. Stack

Trước code phải có mental model:

- LIFO;
- pending context;
- unmatched opening token;
- monotonic candidates nếu là monotonic stack.

## 11.8. Linked list

Ưu tiên ASCII diagram trước pointer writes. Dummy/sentinel node phải được giải thích như cách tạo một predecessor thống nhất cho cả head.

## 11.9. Tree DFS

Luôn trả lời hai câu nếu phù hợp:

```text
Hàm recursive trả gì cho parent?
Global answer / result đang xét gì?
```

## 11.10. Tree BFS

Giải thích queue đang chứa “frontier tiếp theo” hoặc nodes của level nào; không giả định reader đã có mental model level-order.

## 11.11. BST

Nêu property ordering trước khi tận dụng nó để bỏ subtree/search range.

## 11.12. Graph

Sinh node/edge từ semantics bài toán trước. Với visited, nói rõ “đánh dấu để tránh xử lý lại cùng state”, không chỉ ghi “use visited set”.

## 11.13. Trie

Cho ví dụ words có prefix chung trước `TrieNode[26]` hoặc map children.

## 11.14. Backtracking

Phải phân biệt:

- state hiện tại;
- choices còn lại;
- điều kiện accept;
- thao tác choose → recurse → undo.

## 11.15. Divide and conquer

Nêu rõ bài lớn được tách thành bài con nào và kết quả bài con kết hợp ra sao.

## 11.16. Kadane

Không bắt đầu bằng công thức. Bắt đầu từ câu hỏi:

```text
Nếu subarray tối ưu kết thúc tại i, ta nên nối nums[i] vào đoạn trước hay bắt đầu mới tại i?
```

## 11.17. Binary search

Phải nêu:

```text
search space là gì?
property monotonic là gì?
mid valid/invalid nghĩa là gì?
mid cho phép bỏ nửa nào và tại sao?
```

## 11.18. Heap

Giải thích nhu cầu “liên tục lấy phần tử nhỏ/lớn nhất hiện tại” trước `PriorityQueue`.

## 11.19. Bit manipulation

Luôn có binary example nhỏ trước operator khó. Với mask, nói bit thứ `k` đại diện boolean/property gì.

## 11.20. Math

Nếu dùng biến đổi công thức, cho ít nhất một ví dụ số và chỉ rõ assumption/boundary.

## 11.21. 1D/2D DP

State phải là một câu hoàn chỉnh trước transition. Transition phải gắn với choices thực tế. Base case phải có lý do. Nếu rolling array hoặc update order quan trọng, giải thích tại sao không được overwrite state quá sớm.

---

# 12. Common mistakes section

Common mistakes phải là lỗi thực tế có khả năng xảy ra, không phải danh sách chung chung.

Tốt:

- update `prefix` trước khi gán `answer[i]` làm vô tình nhân cả `nums[i]`;
- shrink sliding window chỉ một lần thay vì `while` cho đến khi valid;
- xóa giữa ArrayList làm mất O(1) của RandomizedSet;
- trả cả hai child branches lên parent trong Maximum Path Sum dù parent chỉ nối được một branch;
- binary search loop không tiến vì boundary update giữ lại `mid` sai cách.

Không tốt:

- “hãy cẩn thận index” mà không chỉ index nào;
- “tránh bug”;
- “nhớ edge case”.

---

# 13. Pattern recognition / transfer knowledge

Phần cuối không chỉ ghi tên pattern. Hãy nêu tín hiệu nhận dạng.

Ví dụ:

```text
Khi bài yêu cầu giá trị tốt nhất tại vị trí hiện tại và toàn bộ quá khứ có thể nén thành một statistic nhỏ (`min`, `max`, `count`, `prefix`), hãy nghĩ đến running state thay vì nested loops.
```

Hoặc:

```text
Khi câu hỏi là “ngắn nhất / ít bước nhất” và mỗi transition có cùng cost, hãy thử dựng state thành node và kiểm tra xem BFS có thể đi theo số bước tăng dần hay không.
```

---

# 14. Reviewer checklist cho một `solution.md`

## Hiểu đề

- [ ] Reader hiểu output cần tìm mà chưa cần biết tên pattern.
- [ ] Constraint/semantics dễ nhầm đã được nói lại bằng ngôn ngữ thường.
- [ ] Có concrete example cho bài không-trivial.

## Hình thành thuật toán

- [ ] Cách nghĩ ban đầu hợp lý với người mới.
- [ ] Bottleneck được chỉ rõ, không chỉ nói “too slow”.
- [ ] Observation đủ mạnh để dẫn tới optimal idea.
- [ ] Pattern được gọi tên sau khi mental model đã hình thành.

## State / data structure

- [ ] Mỗi biến/state khó có meaning.
- [ ] Có giải thích lý do nó tồn tại.
- [ ] Update order/invariant quan trọng được giải thích.
- [ ] Nếu có nhiều data structures, quan hệ đồng bộ giữa chúng rõ ràng.

## Java

- [ ] Java API khó có note nếu nó cản trở algorithm comprehension.
- [ ] Không biến solution thành Java tutorial dài.
- [ ] `Optimal Java solution` giữ canonical code.
- [ ] WHY comments ngắn và đúng chỗ.

## Dry run / proof

- [ ] Dry run dùng đúng biến/state trong code.
- [ ] Trace tập trung vào bước khó, không phải noise.
- [ ] Correctness trả lời được tại sao algorithm không bỏ lỡ đáp án.
- [ ] Complexity đúng.

## Tổng kết

- [ ] Common mistakes là lỗi thực tế.
- [ ] Pattern recognition đưa ra transfer signal, không chỉ tên pattern.
- [ ] Độ dài phù hợp Tier 1/2/3.
- [ ] Không dùng jargon chưa được giải thích để giải thích jargon khác.

---

# 15. Newbie Simulator gate

Trước khi đánh dấu một bài migrated, thử tưởng tượng xóa tên pattern khỏi phần đầu.

Hỏi:

> Nếu không nhìn thấy chữ “greedy”, “BFS”, “DP”, “sliding window”, “binary search”… reader có còn theo được vì sao algorithm hình thành không?

- Nếu **có**: reasoning đã đứng được bằng chính semantics của bài.
- Nếu **không**: cần viết lại bridge từ example/bottleneck → observation → state.

Đây là gate quan trọng hơn việc có đủ heading.

---

# 16. Definition of Done cho một bài

Một bài chỉ được coi là migrated khi mọi mục phù hợp đều đạt:

```text
[ ] Hiểu output cần tìm
[ ] Có concrete/mental example nếu bài không-trivial
[ ] Thuật ngữ quan trọng được giải thích trước hoặc ngay khi xuất hiện
[ ] Optimal idea được suy ra từ observation/bottleneck
[ ] Variable/state/data structure khó có meaning + reason
[ ] Java blocker được giải thích khi cần
[ ] Optimal Java code canonical/correct
[ ] WHY comments ngắn, đúng chỗ
[ ] Dry run theo implementation state
[ ] Correctness readable và đúng
[ ] Complexity đúng
[ ] Common mistakes có giá trị học tập
[ ] Pattern recognition giúp transfer knowledge
[ ] `Solution.java` và `solution.md` exact-sync
[ ] Existing validators pass
```

---

# 17. Freeze policy

Guide này là style baseline sau Phase 1.

Trong Phase 3 golden set có thể chỉnh các điểm chưa thực tế. Sau khi golden set được chốt:

- chỉ thay philosophy/heading convention khi có lý do cụ thể;
- ghi thay đổi vào guide và PR progress note;
- không âm thầm đổi style giữa các section;
- pedagogy validator chỉ bảo vệ minimum structure, không được biến thành template police.

Golden set sau khi review sẽ là reference implementation sống cho toàn bộ migration.
