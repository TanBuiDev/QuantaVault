# 151. Reverse Words in a String — Solution

## 1. Core idea / Ý tưởng cốt lõi

Output cần word cuối trước, nên scan từ phải sang trái và lấy từng word theo đúng thứ tự cần append.

Trong Java, `String` immutable, vì vậy follow-up in-place không áp dụng trực tiếp cho input `String`; canonical solution dùng `StringBuilder` cho output.

```text
Time:  O(n)
Space: O(n) for the returned string
```

---

## 2. Algorithm

Với pointer `i` bắt đầu ở cuối:

1. Skip toàn bộ spaces.
2. Nếu hết chuỗi, dừng.
3. Ghi `end = i`.
4. Đi lùi trong word cho tới space hoặc đầu chuỗi.
5. Append word `s[i+1..end]`.
6. Chèn đúng một space giữa các word output.

Không cần `trim()` hoặc regex.

---

## 3. Why spacing becomes correct automatically

Input spaces chỉ dùng để xác định boundary giữa words; ta **không copy chúng**.

Output separator được tạo bởi:

```java
if (result.length() > 0) {
    result.append(' ');
}
```

nên:

- không leading space;
- không trailing space;
- giữa hai words luôn đúng một space.

---

## 4. Dry run

```text
s = "  hello   world  "
```

- skip spaces cuối;
- lấy `world` → result `world`;
- skip ba spaces;
- lấy `hello` → result `world hello`;
- skip spaces đầu → dừng.

---

## 5. Alternative approaches / Các hướng khác

### `trim().split("\\s+")`

Rất ngắn nhưng tạo regex-related allocations, array words và thường nhiều intermediate objects.

### Mutable character array in-place

Nếu input là mutable array:

1. Normalize spaces.
2. Reverse toàn bộ array.
3. Reverse từng word.

Có thể đạt `O(1)` extra working space ngoài buffer mutable. Đây là ý tưởng follow-up.

### Reverse scan + builder

Phù hợp Java `String`, đơn giản và chỉ tạo output cần thiết.

---

## 6. Correctness / Vì sao đúng

Reverse scan gặp các word theo thứ tự từ cuối input về đầu input, chính là thứ tự output yêu cầu. Mỗi word được append nguyên vẹn nên internal character order không đổi. Vì mọi input spaces bị skip và chỉ một separator được thêm giữa hai output words, spacing cũng đúng. Do đó result chứa đúng toàn bộ words theo thứ tự đảo và định dạng yêu cầu.

---

## 7. Complexity

Mỗi character được pointer đi qua tối đa một lần; append tổng cộng `O(n)` character:

```text
Time: O(n)
Space: O(n) for output
```

Ngoài output, working state là `O(1)`.

---

## 8. Common mistakes

1. Reverse toàn bộ string và làm mỗi word cũng bị reverse characters.
2. Giữ lại multiple spaces của input.
3. Append space sau mọi word rồi phải sửa trailing space.
4. Dùng regex mà không nhận ra allocation overhead.

---

## 9. Pattern recognition

Nếu output cần tokens theo thứ tự ngược và separator output được normalize, scan input từ cuối thường đơn giản hơn tokenize toàn bộ rồi reverse collection.
