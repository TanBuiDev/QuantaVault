# 28. Find the Index of the First Occurrence in a String — Solution

## 1. Core idea / Ý tưởng cốt lõi

Canonical solution dùng **Knuth–Morris–Pratt (KMP)** để tránh so lại những character đã biết.

```text
Time:  O(n + m)
Space: O(m)
```

với `n = haystack.length()` và `m = needle.length()`.

---

## 2. Why brute force can repeat work

Nếu pattern có prefix lặp, ví dụ:

```text
aabaaac
```

sau một mismatch gần cuối, brute force có thể quay start lên một vị trí rồi so lại nhiều character mà trước đó đã biết cấu trúc.

KMP mã hóa cấu trúc prefix/suffix của pattern trong `lps` để quyết định phần match nào vẫn còn hữu ích.

---

## 3. LPS array

`lps[i]` là độ dài của **longest proper prefix** của `needle[0..i]` đồng thời là suffix của đoạn đó.

Ví dụ pattern có một đoạn đã match dài `j`, nhưng current character mismatch. Thay vì đặt `j = 0`, KMP thử prefix ngắn hơn đã biết cũng là suffix của phần vừa match:

```java
j = lps[j - 1];
```

Pointer trong `haystack` không cần lùi.

---

## 4. Search phase

Với mỗi `haystack[i]`:

```java
while (j > 0 && haystack.charAt(i) != needle.charAt(j)) {
    j = lps[j - 1];
}
```

Nếu match:

```java
j++;
```

Khi `j == needle.length()`, toàn bộ pattern vừa kết thúc tại `i`, nên start index là:

```text
i - needle.length() + 1
```

---

## Optimal Java solution

```java
class Solution {
    public int strStr(String haystack, String needle) {
        // lps cho biết phần prefix nào của needle vẫn còn có thể tái sử dụng sau mismatch.
        int[] lps = buildLps(needle);
        // j luôn là số ký tự đầu needle đang match liên tiếp với suffix của phần haystack đã đọc.
        int j = 0;

        for (int i = 0; i < haystack.length(); i++) {
            // Không lùi i: nếu mismatch sau j ký tự đã match, border dài lps[j-1]
            // là candidate dài nhất còn hợp lệ; các start ở giữa đã được cấu trúc prefix/suffix loại trừ.
            while (j > 0 && haystack.charAt(i) != needle.charAt(j)) {
                j = lps[j - 1];
            }

            if (haystack.charAt(i) == needle.charAt(j)) {
                j++;
            }

            // j đạt toàn bộ pattern nghĩa là match vừa kết thúc tại i,
            // nên start index được suy ra bằng cách lùi đúng needle.length() - 1 vị trí.
            if (j == needle.length()) {
                return i - needle.length() + 1;
            }
        }

        return -1;
    }

    private int[] buildLps(String pattern) {
        int[] lps = new int[pattern.length()];
        // length là độ dài border tốt nhất của prefix kết thúc ngay trước i.
        int length = 0;

        for (int i = 1; i < pattern.length(); ) {
            if (pattern.charAt(i) == pattern.charAt(length)) {
                // Match này mở rộng border hiện tại thêm một ký tự.
                lps[i++] = ++length;
            } else if (length > 0) {
                // Không tăng i: border hiện tại thất bại nhưng một border ngắn hơn của chính nó
                // vẫn có thể match tại cùng i, nên fallback qua lps thay vì làm lại từ đầu.
                length = lps[length - 1];
            } else {
                // Không còn border nào để thử, nên prefix kết thúc tại i có LPS bằng 0.
                lps[i++] = 0;
            }
        }

        return lps;
    }
}
```

---

## 5. Alternative approaches / Các hướng khác

### Naive window comparison

Thử mọi start `0..n-m`:

```text
Worst-case: O(nm)
Space: O(1)
```

Với constraints `10^4`, cách này vẫn có thể accepted ở nhiều implementation và dễ trình bày cho Easy problem.

### Built-in `indexOf`

Trong production Java có thể dùng API chuẩn, nhưng interview algorithm question thường muốn tự triển khai matching logic.

### KMP

Tuyến tính worst-case và là pattern quan trọng để học string matching.

---

## 6. Correctness / Vì sao đúng

Khi mismatch, `lps[j-1]` là prefix dài nhất của pattern có thể đồng thời là suffix của phần đã match. Mọi candidate prefix dài hơn đã bị mismatch chứng minh sai; mọi candidate start bỏ qua giữa hai trạng thái không thể tạo match mới mà chưa được đại diện bởi border này. Vì vậy fallback không bỏ qua occurrence hợp lệ.

Search pointer của haystack tăng đơn điệu, và khi `j` đạt pattern length thì `needle` đã match liên tiếp kết thúc tại current index. Start được tính đúng từ độ dài pattern.

---

## 7. Complexity

- Build LPS: `O(m)`.
- Search: `O(n)` amortized/worst-case nhờ mỗi fallback dựa trên prefix lengths.
- LPS memory: `O(m)`.

---

## 8. Common mistakes

1. Khi mismatch đặt `j=0` ngay và bỏ lợi ích KMP.
2. Tăng `i` thủ công trong fallback rồi bỏ character cần thử lại.
3. Build LPS sai khi có nested prefix/suffix.
4. Tính start index thành `i-j` sau khi `j` đã thay đổi.

---

## 9. Pattern recognition

Khi cần substring search tuyến tính và pattern có thể tự lặp, hãy nghĩ tới **failure function / prefix function / LPS**.
