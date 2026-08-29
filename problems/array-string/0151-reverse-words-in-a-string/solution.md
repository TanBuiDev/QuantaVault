# 151. Reverse Words in a String — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Input có leading/trailing/multiple spaces nhưng output cần word theo thứ tự đảo ngược, cách nhau đúng một space; ví dụ '  hello world  ' thành 'world hello'.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Split bằng regex rất ngắn nhưng tạo nhiều object và che mất kỹ thuật scan. Quan sát ta có thể đi từ phải sang trái, skip spaces, xác định [start,end] của từng word rồi append trực tiếp.

**State / invariant / data structure cần hiểu trước code.** Index i di chuyển từ cuối; mỗi vòng có phase bỏ spaces và phase tìm đầu word. StringBuilder output giữ các word đã lấy theo thứ tự đảo; chỉ thêm một space khi output đã có word trước.

**Dry run mental theo implementation.** Dry run 'the sky is blue': từ cuối lấy blue, rồi is, sky, the; giữa mỗi lần chỉ append một space, nên output tự loại mọi khoảng trắng thừa.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là để space đầu/cuối output hoặc tạo empty word từ nhiều spaces. Khi nào dùng: tokenization đơn giản với delimiter lặp có thể scan boundary trực tiếp thay vì split.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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

## 4. Optimal Java solution

```java
class Solution {
    public String reverseWords(String s) {
        StringBuilder result = new StringBuilder();
        int i = s.length() - 1;

        while (i >= 0) {
            // Scan từ phải giúp gặp các word đúng theo thứ tự output cần có;
            // spaces của input chỉ là delimiter nên được bỏ thay vì copy sang kết quả.
            while (i >= 0 && s.charAt(i) == ' ') {
                i--;
            }

            if (i < 0) {
                break;
            }

            int end = i;
            while (i >= 0 && s.charAt(i) != ' ') {
                i--;
            }

            // Tự tạo separator thay vì giữ spaces gốc để đồng thời loại leading,
            // trailing và multiple spaces mà không cần trim/split.
            if (result.length() > 0) {
                result.append(' ');
            }
            result.append(s, i + 1, end + 1);
        }

        return result.toString();
    }
}
```

---

## 5. Dry run

```text
s = "  hello   world  "
```

- skip spaces cuối;
- lấy `world` → result `world`;
- skip ba spaces;
- lấy `hello` → result `world hello`;
- skip spaces đầu → dừng.

---

## 6. Alternative approaches / Các hướng khác

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

## 7. Correctness / Vì sao đúng

Reverse scan gặp các word theo thứ tự từ cuối input về đầu input, chính là thứ tự output yêu cầu. Mỗi word được append nguyên vẹn nên internal character order không đổi. Vì mọi input spaces bị skip và chỉ một separator được thêm giữa hai output words, spacing cũng đúng. Do đó result chứa đúng toàn bộ words theo thứ tự đảo và định dạng yêu cầu.

---

## 8. Complexity

Mỗi character được pointer đi qua tối đa một lần; append tổng cộng `O(n)` character:

```text
Time: O(n)
Space: O(n) for output
```

Ngoài output, working state là `O(1)`.

---

## 9. Common mistakes

1. Reverse toàn bộ string và làm mỗi word cũng bị reverse characters.
2. Giữ lại multiple spaces của input.
3. Append space sau mọi word rồi phải sửa trailing space.
4. Dùng regex mà không nhận ra allocation overhead.

---

## 10. Pattern recognition

Nếu output cần tokens theo thứ tự ngược và separator output được normalize, scan input từ cuối thường đơn giản hơn tokenize toàn bộ rồi reverse collection.
