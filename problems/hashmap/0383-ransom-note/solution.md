# 383. Ransom Note — Solution

## 1. Core idea / Ý tưởng cốt lõi

Mỗi ký tự trong `magazine` chỉ dùng được một lần, nên bài toán là kiểm tra liệu frequency supply của `magazine` có đủ cho frequency demand của `ransomNote` hay không.

Do alphabet cố định là `a..z`, dùng mảng 26 phần tử là đủ.

---

## 2. Algorithm

1. Đếm toàn bộ ký tự trong `magazine` vào `frequency[26]`.
2. Duyệt từng ký tự trong `ransomNote`.
3. Giảm frequency của ký tự đó đi `1`.
4. Nếu frequency vừa âm, `magazine` không đủ ký tự đó → trả `false`.
5. Duyệt hết mà không âm → trả `true`.

```java
int[] frequency = new int[26];
for (char c : magazine.toCharArray()) {
    frequency[c - 'a']++;
}

for (char c : ransomNote.toCharArray()) {
    if (--frequency[c - 'a'] < 0) {
        return false;
    }
}
return true;
```

---

## 3. Why decrementing is correct

Sau khi build inventory, `frequency[x]` là số bản sao của character `x` còn chưa dùng.

Mỗi character trong `ransomNote` bắt buộc tiêu thụ đúng một bản sao. Nếu counter trở thành âm, nghĩa là đã yêu cầu nhiều hơn số bản sao `magazine` cung cấp. Từ thời điểm đó không có ký tự nào phía sau có thể sửa được thiếu hụt này, nên early return là an toàn.

---

## 4. Dry run

```text
ransomNote = "aa"
magazine   = "aab"
```

Sau khi đếm magazine:

```text
a: 2
b: 1
```

Duyệt ransomNote:

```text
'a' -> a: 1
'a' -> a: 0
```

Không counter nào âm → `true`.

Với `magazine = "ab"`:

```text
'a' -> a: 0
'a' -> a: -1
```

Ngay lập tức trả `false`.

---

## 5. Correctness / Vì sao đúng

Invariant: trước khi xử lý mỗi ký tự của `ransomNote`, `frequency[c]` bằng số bản sao của `c` trong `magazine` chưa được dùng cho prefix đã xử lý.

Khi tiêu thụ current character, decrement giữ đúng invariant. Nếu counter âm, prefix hiện tại đã cần nhiều ký tự đó hơn toàn bộ magazine có, nên không thể có lời giải. Nếu hoàn tất toàn bộ ransomNote mà mọi counter không âm, mỗi nhu cầu đều đã được ghép với một bản sao khác nhau trong magazine, nên ransomNote có thể được tạo.

---

## 6. Complexity

Gọi `m = magazine.length`, `n = ransomNote.length`:

```text
Time: O(m+n)
Extra space: O(1)
```

`O(1)` vì array luôn có đúng 26 phần tử.

---

## 7. Alternative approaches

Có thể dùng `HashMap<Character,Integer>`; cách đó phù hợp hơn nếu alphabet không cố định, nhưng với lowercase English letters thì array đơn giản, nhanh và ít overhead hơn.

---

## 8. Common mistakes

- Chỉ kiểm tra character có tồn tại, không kiểm tra số lần xuất hiện.
- Dùng cùng một magazine character nhiều lần.
- Sort hai chuỗi, tốn `O(n log n)` không cần thiết.
- Quên tận dụng fixed alphabet để có constant auxiliary space.
