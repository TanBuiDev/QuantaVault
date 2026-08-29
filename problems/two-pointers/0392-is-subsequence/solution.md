# 392. Is Subsequence — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Subsequence giữ thứ tự nhưng được bỏ ký tự. Ta chỉ cần pointer i cho ký tự tiếp theo của s cần match và scan t từ trái sang phải cho tới khi match hết s.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Recursion/DP có thể giải nhưng thừa cho một query đơn. Quan sát greedy match occurrence s[i] sớm nhất không làm hại tương lai, vì để lại suffix t lớn nhất cho các ký tự sau.

**State / invariant / data structure cần hiểu trước code.** i là độ dài prefix của s đã match. Invariant sau khi scan prefix t, i là số ký tự đầu s có thể match bằng greedy earliest occurrences; i chỉ tăng, không lùi.

**Dry run mental theo implementation.** Dry run s='abc', t='ahbgdc': a match ở0 -> i1; b match ở2 -> i2; c match ở5 -> i3 bằng s.length nên true.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là yêu cầu chars liên tiếp như substring. Khi nào dùng: kiểm tra một sequence có xuất hiện theo thứ tự trong sequence khác thường là two pointers greedy.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Ta quét `t` từ trái sang phải và luôn cố match **ký tự chưa match sớm nhất của `s`**.

State:

```text
sIndex = số ký tự đầu của s đã match thành công
tIndex = vị trí đang quét trong t
```

Nếu hai ký tự bằng nhau, tăng `sIndex`. Dù match hay không, luôn tăng `tIndex`.

Nếu cuối cùng `sIndex == s.length()`, mọi ký tự của `s` đã xuất hiện trong `t` theo đúng thứ tự.

```text
Time:  O(|t|)
Space: O(1)
```

---

## 2. Why the earliest possible match is safe

Giả sử đang cần match `s[i]`. Khi gặp occurrence đầu tiên phù hợp trong phần còn lại của `t`, chọn occurrence đó không thể làm tương lai tệ hơn việc bỏ qua nó để chọn một occurrence muộn hơn.

Occurrence sớm hơn để lại **nhiều suffix của `t` hơn** cho các ký tự còn lại của `s`.

Đây là greedy choice cốt lõi.

---

## 3. Optimal Java solution

```java
class Solution {
    public boolean isSubsequence(String s, String t) {
        int sIndex = 0;
        int tIndex = 0;

        while (sIndex < s.length() && tIndex < t.length()) {
            // Match occurrence sớm nhất có thể là greedy-safe: dùng một vị trí
            // sớm hơn trong t luôn để lại suffix lớn hơn cho các ký tự s còn lại.
            if (s.charAt(sIndex) == t.charAt(tIndex)) {
                sIndex++;
            }

            // t luôn tiến vì mỗi vị trí chỉ có thể được dùng một lần và subsequence
            // yêu cầu các index match tăng dần theo đúng thứ tự.
            tIndex++;
        }

        return sIndex == s.length();
    }
}
```

Empty `s` tự động trả `true` vì `sIndex == s.length()` ngay từ đầu.

---

## 4. Dry run

```text
s = "abc"
t = "ahbgdc"
```

- `a` gặp `a` → match, cần `b`.
- skip `h`.
- `b` gặp `b` → match, cần `c`.
- skip `g,d`.
- `c` gặp `c` → match hết.

Trả `true`.

---

## 5. Correctness / Vì sao đúng

Invariant: sau mỗi bước, `s[0..sIndex-1]` đã được match thành một subsequence của prefix `t[0..tIndex-1]`, và các match được chọn ở các vị trí sớm nhất có thể theo greedy scan.

Khi current characters bằng nhau, chọn current `tIndex` là an toàn vì mọi solution dùng một occurrence muộn hơn vẫn còn khả thi nếu ta dùng occurrence sớm hơn: suffix còn lại không ngắn hơn.

Nếu scan hết `t` mà `sIndex < s.length()`, không còn occurrence nào để match ký tự tiếp theo, nên không subsequence hợp lệ tồn tại. Nếu `sIndex == s.length()`, invariant cung cấp trực tiếp các vị trí tăng dần trong `t`, nên `s` là subsequence.

---

## 6. Follow-up: rất nhiều query `s`

Nếu có `k` cực lớn và cùng một `t`, chạy `O(|t|)` cho mỗi query là lãng phí.

Preprocess:

```text
positions['a'] = sorted indices of 'a' in t
positions['b'] = sorted indices of 'b' in t
...
```

Với mỗi query `s`, giữ `lastPosition`. Cho từng character, binary-search occurrence đầu tiên có index `> lastPosition`.

```text
Preprocess: O(|t|)
Query:      O(|s| log |t|)
```

Một lựa chọn khác là next-occurrence table kích thước khoảng `26 * |t|`, cho query `O(|s|)` nhưng dùng nhiều memory hơn.

---

## 7. Complexity

Single query canonical:

```text
Time: O(|t|)
Space: O(1)
```

`srcIndex` chỉ tăng tối đa `|s|`, `tIndex` chỉ tăng tối đa `|t|`.

---

## 8. Edge cases

- `s = ""` → luôn `true`.
- `t = ""`, `s` không rỗng → `false`.
- Repeated characters phải có đủ occurrences trong đúng thứ tự.
- `s.equals(t)` → `true`.

---

## 9. Common mistakes

1. Dùng `contains` cho từng character mà không giữ relative order.
2. Sau match lại reset search từ đầu `t`.
3. Nghĩ subsequence phải contiguous như substring.
4. Follow-up nhiều query vẫn scan toàn bộ `t` cho mỗi query.

---

## 10. Pattern recognition

Khi cần kiểm tra một sequence có xuất hiện **theo thứ tự nhưng không cần liên tiếp** trong sequence khác, forward two pointers với earliest-match greedy là pattern cơ bản.
