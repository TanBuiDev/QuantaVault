# 76. Minimum Window Substring — Solution

## 1. Core idea / Ý tưởng cốt lõi

Ta cần minimum window thỏa **multiset requirement** của `t`, không chỉ set membership.

Duy trì:

```text
need[c]   = số lần c cần có
window[c] = số lần c đang có
required  = số distinct required characters
formed    = số distinct characters hiện đạt quota
```

Window hợp lệ khi:

```text
formed == required
```

Khi hợp lệ, shrink từ trái tối đa để tìm minimum.

---

## 2. Algorithm

1. Build `need` từ `t`, đồng thời đếm `required`.
2. Mở rộng `right` qua `s`.
3. Với mỗi character cần thiết, tăng `window[c]`; nếu vừa đạt đúng quota thì `formed++`.
4. Trong khi `formed == required`:
   - update best window;
   - remove `s[left]`;
   - nếu required character vừa tụt dưới quota thì `formed--`;
   - `left++`.
5. Nếu chưa từng có valid window, trả `""`.

---

## 3. Java

```java
int[] need = new int[128];
int[] window = new int[128];
int required = 0;

for (char c : t.toCharArray()) {
    if (need[c] == 0) required++;
    need[c]++;
}
```

Main scan:

```java
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    window[c]++;
    if (need[c] > 0 && window[c] == need[c]) formed++;

    while (formed == required) {
        // update best
        char leftChar = s.charAt(left);
        window[leftChar]--;
        if (need[leftChar] > 0 && window[leftChar] < need[leftChar]) formed--;
        left++;
    }
}
```

---

## 4. Why `formed` works

Một character `c` được tính vào `formed` đúng lúc:

```text
window[c] == need[c]
```

Nếu window có nhiều hơn quota, nó vẫn tiếp tục thỏa requirement và `formed` không tăng thêm.

Khi shrink làm:

```text
window[c] < need[c]
```

thì requirement cho `c` vừa bị phá vỡ và `formed--`.

Do đó `formed == required` tương đương với mọi distinct required character đều có đủ multiplicity.

---

## 5. Dry run

```text
s = "ADOBECODEBANC"
t = "ABC"
```

Window đầu tiên đạt đủ requirement là:

```text
"ADOBEC"
```

Sau đó shrink cho tới khi mất `A`.

Khi right tiếp tục tới cuối, window valid cuối cùng có thể shrink thành:

```text
"BANC"
```

length `4`, nhỏ hơn mọi valid window trước đó.

---

## 6. Duplicate requirement example

```text
t = "AABC"
```

Window chứa một `A`, một `B`, một `C` vẫn **không hợp lệ** vì:

```text
need['A'] = 2
```

Frequency tracking giải quyết chính xác case mà set-based solution sẽ sai.

---

## 7. Correctness / Vì sao đúng

Mỗi `right` được mở rộng tuần tự. Khi current window lần đầu trở nên valid cho một `right`, vòng `while` tăng `left` qua mọi valid start liên tiếp và cập nhật best cho từng window, cho tới khi bỏ thêm một character làm requirement bị thiếu.

Vì `left` chỉ tiến và `formed` phản ánh chính xác tính hợp lệ của multiset requirement, shortest valid window kết thúc tại mỗi `right` đều được xét. Global minimum trong tất cả các candidate đó là đáp án.

---

## 8. Complexity

Mỗi index được `right` đi qua một lần và `left` đi qua tối đa một lần:

```text
Time: O(m+n)
```

Với alphabet cố định gồm chữ cái tiếng Anh, hai frequency arrays có kích thước hằng số:

```text
Extra space: O(1)
```

---

## 9. Common mistakes

1. Dùng set thay vì frequency map/array.
2. `formed++` mỗi khi thấy required character, thay vì chỉ khi đạt quota.
3. Khi shrink quên `formed--` lúc frequency tụt dưới quota.
4. Dừng shrink ngay khi tìm valid window đầu tiên.
5. Trả current window cuối cùng thay vì best window đã lưu.
