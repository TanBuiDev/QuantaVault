# 205. Isomorphic Strings — Solution

## 1. Core idea / Ý tưởng cốt lõi

Hai chuỗi isomorphic khi pattern lặp của các ký tự giống hệt nhau theo từng vị trí.

Thay vì lưu trực tiếp mapping object, ta lưu **vị trí xuất hiện gần nhất** của mỗi character. Ở index `i`, nếu `s[i]` và `t[i]` thuộc cùng một bijection hợp lệ thì lịch sử last-seen của chúng phải giống nhau.

---

## 2. Algorithm

Dùng hai array cho ASCII:

```java
int[] lastS = new int[256];
int[] lastT = new int[256];
```

Với mỗi index `i`:

```java
char a = s.charAt(i);
char b = t.charAt(i);

if (lastS[a] != lastT[b]) return false;

lastS[a] = i + 1;
lastT[b] = i + 1;
```

Dùng `i+1` để `0` biểu diễn “chưa xuất hiện”.

---

## 3. Why comparing last-seen positions enforces both directions

Nếu một source character cố map sang hai target khác nhau, lần xuất hiện tiếp theo của source có last-seen khác với target mới → fail.

Nếu hai source characters khác nhau cùng cố map vào một target, target đó có last-seen từ source trước nhưng source mới chưa có cùng history → cũng fail.

Vì thế equality của hai last-seen signatures kiểm tra bijection theo cả hai chiều trong một điều kiện.

---

## 4. Dry run

```text
s = "egg"
t = "add"
```

- index 0: `e/a` đều unseen (`0 == 0`) → ghi `1`.
- index 1: `g/d` đều unseen (`0 == 0`) → ghi `2`.
- index 2: `g/d` đều last seen tại encoded position `2` → hợp lệ.

Kết quả `true`.

Với:

```text
s = "f11"
t = "b23"
```

Tới ký tự `1` thứ hai, last-seen phía `s` khác target `3` mới → `false`.

---

## 5. Correctness / Vì sao đúng

Invariant: sau khi xử lý prefix `0..i-1`, hai bảng last-seen ghi cùng một encoded position cho chính xác các cặp character đang tương ứng trong pattern.

Tại `i`, nếu hai last-seen value khác nhau thì một phía đã từng xuất hiện ở vị trí mà phía kia không có cùng partner-history, nên bijection bị vi phạm. Nếu bằng nhau, cặp hiện tại tương thích với toàn bộ prefix; cập nhật cả hai về `i+1` bảo toàn invariant. Duyệt hết nghĩa là mọi vị trí đều tương thích, nên hai chuỗi isomorphic.

---

## 6. Complexity

```text
Time: O(n)
Extra space: O(1)
```

Hai array luôn có 256 entries theo ASCII constraint.

---

## 7. Common mistakes

- Chỉ kiểm tra mapping `s -> t`, bỏ sót hai source characters cùng map vào một target.
- Quên rằng mapping phải nhất quán ở mọi occurrence.
- Dùng index `0` trực tiếp làm last-seen và không phân biệt với unseen.
