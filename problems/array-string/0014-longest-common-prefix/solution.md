# 14. Longest Common Prefix — Solution

## 1. Core idea / Ý tưởng cốt lõi

Dùng chuỗi đầu tiên làm reference và kiểm tra theo **cột ký tự**:

```text
position 0 across all strings
position 1 across all strings
...
```

Vị trí đầu tiên mà một chuỗi hết hoặc có ký tự khác sẽ kết thúc common prefix.

Nếu `S` là tổng số character thực tế được kiểm tra:

```text
Time:  O(S)
Space: O(1) extra
```

---

## 2. Why vertical scanning is natural

Prefix là property theo **vị trí từ đầu chuỗi**. Ta không cần sort và cũng không cần xây Trie nếu chỉ có một query.

Với reference `strs[0]`, tại mỗi index `i` có đúng hai lý do khiến prefix dừng:

1. Một string có length `<= i`.
2. Character tại `i` khác reference.

Mismatch đầu tiên xác định longest possible prefix ngay lập tức.

---

## 3. Algorithm

```java
String first = strs[0];

for (int i = 0; i < first.length(); i++) {
    char expected = first.charAt(i);

    for (int j = 1; j < strs.length; j++) {
        if (i == strs[j].length() || strs[j].charAt(i) != expected) {
            return first.substring(0, i);
        }
    }
}

return first;
```

Nếu reference kết thúc mà chưa có mismatch, toàn bộ reference là common prefix.

---

## Optimal Java solution

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        String first = strs[0];

        for (int i = 0; i < first.length(); i++) {
            char expected = first.charAt(i);

            // Invariant: các vị trí 0..i-1 đã giống nhau ở mọi chuỗi,
            // nên chỉ cần kiểm tra cột i để biết prefix còn có thể kéo dài hay không.
            for (int j = 1; j < strs.length; j++) {
                // Phải kiểm tra length trước charAt(i). Nếu chuỗi đã hết hoặc ký tự khác,
                // không common prefix nào có thể chứa vị trí i nữa.
                if (i == strs[j].length() || strs[j].charAt(i) != expected) {
                    return first.substring(0, i);
                }
            }
        }

        // Nếu reference kết thúc mà không mismatch, nó đã là prefix của mọi chuỗi
        // và không common prefix nào có thể dài hơn chính reference.
        return first;
    }
}
```

---

## 4. Dry run

```text
["flower", "flow", "flight"]
```

- `i=0`: `f/f/f` → match.
- `i=1`: `l/l/l` → match.
- `i=2`: `o/o/i` → mismatch.

Trả:

```text
"flower".substring(0, 2) = "fl"
```

---

## 5. Alternative approaches / Các hướng khác

### Horizontal shrinking

Bắt đầu `prefix = strs[0]`, rồi rút ngắn cho tới khi mỗi string `startsWith(prefix)`. Dễ viết nhưng có thể tạo nhiều substring tạm.

### Sort strings

Sau khi sort lexicographically, chỉ cần tìm common prefix của string đầu và cuối. `O(n log n)` do sorting và làm thay đổi thứ tự nếu sort in-place.

### Trie

Hữu ích nếu cần nhiều prefix queries hoặc muốn xây cấu trúc dùng lại; quá nặng cho một query duy nhất.

---

## 6. Correctness / Vì sao đúng

Giả sử thuật toán đã xác nhận các cột `0..i-1`; khi đó mọi string đều chia sẻ prefix dài `i` bằng `first[0..i-1]`.

Nếu tại cột `i` một string hết hoặc khác character, không common prefix nào có thể chứa vị trí `i`, nên prefix dài `i` là longest possible. Nếu không bao giờ mismatch trước khi `first` kết thúc, toàn bộ `first` xuất hiện ở đầu mọi string và là common prefix dài nhất có thể vì không prefix nào dài hơn `first`.

---

## 7. Complexity

Worst case mọi string chia sẻ prefix dài bằng chuỗi ngắn nhất, nên ta kiểm tra tổng số character liên quan tuyến tính.

```text
Time: O(S)
Extra space: O(1)
```

Returned substring không được tính là working state của thuật toán.

---

## 8. Edge cases

- Chỉ một string → chính string đó.
- Có empty string → `""`.
- Mismatch ngay character đầu → `""`.
- Một string là prefix của mọi string khác → string ngắn đó.

---

## 9. Common mistakes

1. Đọc `charAt(i)` trước khi kiểm tra string có đủ length.
2. Sort toàn bộ dù không cần thiết.
3. Quên input có thể chứa empty string.
4. So sánh suffix/substring thay vì prefix từ index 0.

---

## 10. Pattern recognition

Khi cần một property chung của nhiều strings tại cùng positional prefix, vertical scanning là baseline đơn giản và memory-efficient.
