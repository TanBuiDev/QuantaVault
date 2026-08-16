# 290. Word Pattern — Solution

## 1. Core idea / Ý tưởng cốt lõi

Bài toán yêu cầu bijection giữa hai tập khác kiểu dữ liệu:

```text
pattern character <-> word
```

Vì vậy cần kiểm tra consistency theo **hai chiều**.

---

## 2. Algorithm

1. `words = s.split(" ")`.
2. Nếu `words.length != pattern.length()`, trả `false`.
3. Dùng:

```text
Map<Character,String> charToWord
Map<String,Character> wordToChar
```

4. Với mỗi vị trí:
   - nếu char đã map nhưng target word khác → `false`;
   - nếu word đã map nhưng source char khác → `false`;
   - nếu hợp lệ, ghi cả hai chiều.
5. Hết vòng lặp → `true`.

---

## 3. Why two maps are necessary

Ví dụ:

```text
pattern = "ab"
s = "dog dog"
```

Nếu chỉ lưu `char -> word`:

```text
a -> dog
b -> dog
```

mỗi char vẫn có một mapping nhất quán, nhưng mapping không one-to-one. Reverse map phát hiện `dog` đã thuộc `a` khi xử lý `b`.

---

## 4. Correctness / Vì sao đúng

Invariant: sau khi xử lý prefix đầu tiên `i` cặp, hai maps biểu diễn một bijection giữa các pattern chars và words đã gặp.

Tại vị trí tiếp theo, nếu một chiều đã có mapping không khớp thì không thể mở rộng bijection hợp lệ. Nếu cả hai chiều đều compatible, thêm cặp mới hoặc xác nhận cặp cũ vẫn bảo toàn bijection. Nếu xử lý hết mọi vị trí, toàn bộ chuỗi thỏa cùng pattern.

---

## 5. Complexity

Tách và duyệt toàn bộ input là tuyến tính theo tổng kích thước chuỗi:

```text
Time: O(n)
Space: O(n)
```

Maps có tối đa số distinct pattern chars/words đã gặp.

---

## 6. Common mistakes

- Không kiểm tra số word bằng pattern length.
- Chỉ dùng một map.
- Dùng `==` để so sánh Java `String` thay vì `.equals()`.
- Nhầm bijection với chỉ “mỗi char có một word”.
