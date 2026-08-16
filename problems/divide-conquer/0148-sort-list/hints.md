# 148. Sort List — Hints / Gợi ý

## Hint 1
**EN:** Merge sort fits linked lists because merging sorted runs only rewires pointers.

**VI:** Merge sort phù hợp linked list vì merge các run đã sort chỉ cần nối lại pointer.

## Hint 2
**EN:** Recursive top-down merge sort uses `O(log n)` call-stack space. For the follow-up, merge runs iteratively with sizes `1,2,4,8,...`.

**VI:** Top-down dùng stack `O(log n)`; để đạt follow-up hãy merge bottom-up với run size `1,2,4,8,...`.

## Hint 3
Split two consecutive runs of length `size`, merge them, reconnect the merged tail, then continue.
