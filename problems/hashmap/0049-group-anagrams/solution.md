# 49. Group Anagrams — Solution

## 1. Core idea / Ý tưởng cốt lõi

Anagram không phụ thuộc thứ tự ký tự mà phụ thuộc **multiset** ký tự. Với lowercase English letters, vector 26 frequency là canonical representation tự nhiên.

---

## 2. Build a signature

Với mỗi word:

```java
int[] count = new int[26];
for (char c : word.toCharArray()) {
    count[c - 'a']++;
}
```

Sau đó encode thành key có delimiter:

```text
#1#0#0#2...
```

Hai word có cùng key iff chúng có cùng count cho mọi letter.

---

## 3. Hash bucketing

```java
Map<String, List<String>> groups = new HashMap<>();
for (String word : strs) {
    String key = signature(word);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);
}
return new ArrayList<>(groups.values());
```

---

## 4. Why the signature is correct

Nếu hai strings là anagram, mỗi letter xuất hiện cùng số lần nên 26-count vectors giống nhau và keys bằng nhau.

Ngược lại, keys bằng nhau nghĩa là mọi letter count bằng nhau; vì alphabet chỉ gồm `a..z`, hai strings có cùng multiset nên có thể rearrange thành nhau.

---

## 5. Why delimiter matters

Nếu nối raw counts không có separator, vectors khác nhau có thể tạo chuỗi mơ hồ, ví dụ counts bắt đầu bằng `[1,11,...]` và `[11,1,...]`. Prefix delimiter/structured encoding giữ ranh giới từng count.

---

## 6. Complexity

Gọi `C` là tổng số characters trong tất cả strings. Mỗi character được count một lần và mỗi word tạo key từ 26 entries:

```text
Time: O(C + 26*k) = O(C + k)
```

Thường viết gọn là `O(total characters)` vì 26 là hằng số. Output và hash buckets cần bộ nhớ tỷ lệ dữ liệu được nhóm.

---

## 7. Alternative: sorted string key

Sort từng word rồi dùng sorted word làm key. Cách này ngắn nhưng mất `O(L log L)` cho mỗi word. Frequency signature tận dụng fixed alphabet để đạt tuyến tính theo số ký tự.

---

## 8. Common mistakes

- Dùng character set thay vì frequency.
- Tạo key mơ hồ không delimiter.
- Assume output group/order phải giống example; đề cho phép any order.
- Sort input strings in-place mà không cân nhắc mutation nếu không cần thiết.
