# 242. Valid Anagram — Solution

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
