# 3. Longest Substring Without Repeating Characters — Solution

## 1. Core idea / Ý tưởng cốt lõi

Ta giữ invariant:

```text
s[left..right] không có duplicate character
```

Khi gặp một ký tự đã xuất hiện trong current window, thay vì tăng `left` từng bước, ta dùng last seen index để nhảy thẳng qua lần xuất hiện trước.

---

## 2. Algorithm

```java
Map<Character, Integer> lastSeen = new HashMap<>();
int left = 0;
int best = 0;

for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);

    if (lastSeen.containsKey(c)) {
        left = Math.max(left, lastSeen.get(c) + 1);
    }

    lastSeen.put(c, right);
    best = Math.max(best, right - left + 1);
}
```

---

## 3. Why `Math.max` is necessary

Ví dụ:

```text
s = "abba"
```

Khi tới ký tự `a` cuối cùng, previous `a` ở index `0`, nhưng `left` đã ở index `2` vì duplicate `b` trước đó.

Nếu viết:

```text
left = previous + 1
```

thì `left` sẽ lùi từ `2` về `1`, phá invariant.

Phải dùng:

```text
left = Math.max(left, previous + 1)
```

---

## 4. Dry run

```text
s = "abcabcbb"
```

- `a,b,c`: window lớn dần tới length `3`.
- gặp `a` ở index `3`: previous `a=0` → `left=1`.
- gặp `b` ở index `4`: previous `b=1` → `left=2`.
- gặp `c` ở index `5`: previous `c=2` → `left=3`.

`best` vẫn là `3`.

---

## 5. Correctness / Vì sao đúng

Trước khi thêm `s[right]`, window hiện tại không có duplicate. Nếu ký tự mới chưa xuất hiện trong window, invariant tiếp tục đúng. Nếu nó đã xuất hiện tại `previous >= left`, mọi substring kết thúc ở `right` mà bắt đầu tại hoặc trước `previous` đều chứa hai bản sao, nên không hợp lệ. Đưa `left` tới `previous+1` loại đúng duplicate gần nhất và giữ lại window dài nhất có thể kết thúc tại `right`.

`left` không bao giờ lùi nhờ `Math.max`, nên mỗi right endpoint đều cho ta longest valid window kết thúc tại đó. Lấy maximum qua mọi `right` cho global optimum.

---

## 6. Alternative: set + shrink loop

Có thể dùng `HashSet<Character>` và khi duplicate thì remove `s[left]` tới khi hợp lệ. Cách đó vẫn `O(n)`, nhưng last-seen map cho phép jump trực tiếp và thường dễ giải thích hơn trong interview.

---

## 7. Complexity

Mỗi character được xử lý một lần ở `right`; hash map lookup/update trung bình `O(1)`:

```text
Time: O(n)
Space: O(min(n, alphabet))
```

---

## 8. Edge cases

- Empty string → `0`.
- Một ký tự → `1`.
- Tất cả ký tự giống nhau → `1`.
- Toàn bộ chuỗi unique → `n`.
- Duplicate nằm ngoài current window như case `"abba"`.

---

## 9. Common mistakes

1. Quên `Math.max` và làm `left` đi lùi.
2. Nhầm substring với subsequence.
3. Chỉ lưu boolean seen mà không biết duplicate ở đâu.
4. Update best trước khi điều chỉnh `left`.
