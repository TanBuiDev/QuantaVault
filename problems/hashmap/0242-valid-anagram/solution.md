# 242. Valid Anagram — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Anagram yêu cầu hai string có đúng cùng số lần xuất hiện của mỗi ký tự. Thứ tự không quan trọng, nên bài toán biến từ so chuỗi thành so frequency vector.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Sort hai string O(n log n) đúng. Nếu alphabet nhỏ cố định, count frequencies O(n) nhanh và ít overhead hơn; một pass tăng theo s và giảm theo t có thể phát hiện mismatch.

**State / invariant / data structure cần hiểu trước code.** count[c] là chênh lệch occurrences s minus t đã xử lý. Invariant cuối cùng mọi count phải bằng 0; length khác nhau có thể reject ngay vì tổng số ký tự không thể match.

**Dry run mental theo implementation.** Dry run anagram/nagaram: mỗi char tăng rồi giảm tương ứng, vector về 0. Với rat/car, count của t/r/c không cân bằng nên còn nonzero.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ so set characters và bỏ qua multiplicity. Khi nào dùng: equality không quan tâm order nhưng quan tâm số lần xuất hiện thường dùng frequency map/array.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Hai chuỗi là anagram khi chúng chứa chính xác cùng multiset ký tự. Vì alphabet là `a..z`, ta dùng 26 counters.

## 2. Optimal Java solution

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }

        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            // Cùng một counter lưu hiệu frequency(s) - frequency(t), nên không cần
            // hai mảng riêng; anagram iff mọi hiệu cuối cùng trở về 0.
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }

        for (int value : count) {
            // Một counter khác 0 chứng minh multiplicity của ít nhất một letter khác nhau.
            if (value != 0) {
                return false;
            }
        }
        return true;
    }
}
```

## 3. Correctness / Vì sao đúng

`count[c]` bằng số lần `c` xuất hiện trong `s` trừ số lần nó xuất hiện trong `t`. Hai chuỗi có cùng multiset iff mọi hiệu này bằng `0`. Length check loại sớm trường hợp tổng số ký tự khác nhau.

## 4. Complexity

```text
Time: O(n)
Extra space: O(1)
```

Array luôn có 26 entries.

## 5. Unicode follow-up

Với Unicode, dùng `HashMap<Integer,Integer>` keyed by Unicode code point thay vì index `c-'a'`; nếu cần xử lý supplementary characters chính xác, duyệt `codePoints()` thay vì Java `char` đơn lẻ.

## 6. Common mistakes

- Chỉ check set ký tự, bỏ qua multiplicity.
- Sort cả hai chuỗi thành `O(n log n)` dù counting đạt `O(n)`.
- Claim array 26 hoạt động cho Unicode.
