# 139. Word Break — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch

**EN:** I use prefix DP. `dp[i]` means the first `i` characters can be segmented using dictionary words. For each end position, I try valid earlier prefix positions and check whether the last substring is in a hash set. I also limit checks by the maximum dictionary-word length. The solution uses O(n) DP space and polynomial time.

**VI:** Tôi dùng prefix DP kết hợp HashSet lookup và giới hạn theo max word length.

## 2. Core approach questions

**Q (EN):** What does `dp[i]` represent?

**Q (VI):** `dp[i]` biểu diễn gì?

### Short answer (EN)
Whether `s[0..i)` can be segmented into dictionary words.

### Trả lời ngắn (VI)
Prefix dài `i` có segment hợp lệ được không.

### Standard answer (EN)
It summarizes all possible segmentations of the prefix into one boolean. A future word can extend the prefix only when this state is true.

### Trả lời chuẩn (VI)
Nó gộp mọi segmentation của prefix thành một boolean để các từ sau mở rộng từ state reachable.

## 3. Why / correctness questions

**Q (EN):** Why does checking the last word cover every segmentation?

**Q (VI):** Vì sao xét từ cuối bao phủ mọi segmentation?

### Short answer (EN)
Every valid segmentation has a final dictionary word and a valid prefix before it.

### Trả lời ngắn (VI)
Mọi segmentation hợp lệ đều có một từ cuối và prefix hợp lệ trước nó.

### Standard answer (EN)
If the final word starts at `j`, then `dp[j]` must be true and `s[j..i)` must be in the dictionary. The transition checks exactly that pair for every possible split.

### Trả lời chuẩn (VI)
Nếu từ cuối bắt đầu tại `j`, recurrence kiểm tra đúng `dp[j]` và segment `j..i` thuộc dictionary.

## 4. Complexity questions

**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
O(n^2) transition checks in the general bound and O(n) DP space, plus the dictionary set.

### Trả lời ngắn (VI)
Tổng quát O(n²) transition checks và O(n) DP space ngoài dictionary.

### Standard answer (EN)
The maximum word length can reduce the number of split points considered for each `i`. Java substring creation also has a cost proportional to substring length, which is bounded here by the dictionary word limit.

### Trả lời chuẩn (VI)
Max word length giảm số split; chi phí substring cũng bị giới hạn bởi độ dài word tối đa.

## 5. Edge-case questions

**Q (EN):** Can a dictionary word be reused?

**Q (VI):** Có được dùng lại một word không?

### Short answer (EN)
Yes, the DP does not consume words from the set.

### Trả lời ngắn (VI)
Có; DP không xóa word khỏi set.

### Standard answer (EN)
Each transition performs membership lookup only, so the same word can participate in any number of segments as required by the problem.

### Trả lời chuẩn (VI)
Transition chỉ lookup membership nên word được dùng lại tùy ý.

## 6. Alternative-approach and trade-off questions

**Q (EN):** Why can greedy segmentation fail?

**Q (VI):** Vì sao greedy segmentation có thể sai?

### Short answer (EN)
A locally matching word can lead to an impossible suffix while a different split succeeds.

### Trả lời ngắn (VI)
Một match cục bộ có thể để lại suffix không thể tách, trong khi split khác thành công.

### Standard answer (EN)
DP keeps all reachable prefix boundaries instead of committing to one word choice too early.

### Trả lời chuẩn (VI)
DP giữ mọi boundary reachable thay vì commit sớm vào một word.

## 7. Code walkthrough questions

**Q (EN):** Why is `dp[0]` true?

**Q (VI):** Vì sao `dp[0] = true`?

### Short answer (EN)
The empty prefix is a valid base before choosing the first word.

### Trả lời ngắn (VI)
Prefix rỗng là base hợp lệ trước từ đầu tiên.

### Standard answer (EN)
Without this base state, a dictionary word that starts at index zero could never create its ending DP state.

### Trả lời chuẩn (VI)
Không có base này thì word bắt đầu tại index 0 không thể tạo state reachable đầu tiên.

## 8. Follow-up variations

**Q (EN):** How would you return one actual segmentation?

**Q (VI):** Nếu cần trả về một segmentation cụ thể thì sao?

### Short answer (EN)
Store the predecessor split index when setting each reachable state.

### Trả lời ngắn (VI)
Lưu predecessor split khi set mỗi state true.

### Standard answer (EN)
After reaching `dp[n]`, follow predecessor indices backward and reverse the collected words.

### Trả lời chuẩn (VI)
Sau `dp[n]`, lần theo predecessor ngược rồi reverse danh sách word.

## 9. Common interviewer traps

- Greedy longest-word selection.
- Forgetting dictionary words may be reused.
- Missing the empty-prefix base case.
- Checking a suffix without a reachable prefix.

## 10. Useful phrases and vocabulary

```text
reachable prefix
last dictionary word
try every split point
reuse dictionary words
prefix dynamic programming
```
