# 68. Text Justification — Solution

## 1. Core idea / Ý tưởng cốt lõi

Bài này dễ hơn khi tách thành **packing** và **formatting**.

### Packing

Greedy lấy nhiều words nhất có thể cho current line, tính cả một space tối thiểu giữa các words.

### Formatting

- Last line hoặc single-word line → left justify.
- Normal line → chia toàn bộ spaces vào các gaps càng đều càng tốt; remainder được phát từ trái sang phải.

---

## 2. Greedy line packing

Giả sử đã chọn từ `i` tới `j-1`, tổng độ dài words là `wordLength`.

Nếu thêm `words[j]`, số gap tối thiểu trở thành `j-i`, nên điều kiện fit là:

```text
wordLength + (j - i) + words[j].length() <= maxWidth
```

Ta tiếp tục tới word đầu tiên không fit. Vì yêu cầu đề bắt buộc pack nhiều words nhất, greedy boundary này là duy nhất.

---

## 3. Full justification math

Normal line có:

```text
wordsCount = j - i
gaps       = wordsCount - 1
totalSpaces = maxWidth - wordLength
```

Chia Euclidean:

```text
base  = totalSpaces / gaps
extra = totalSpaces % gaps
```

Mỗi gap nhận `base`; `extra` gap đầu nhận thêm `1`.

Ví dụ:

```text
3 gaps, 8 spaces
base = 2
extra = 2
=> 3, 3, 2 spaces
```

đúng quy tắc “left slots get more”.

---

## 4. Last line and one-word line

Nếu last line, đề yêu cầu:

```text
word1 + ' ' + word2 + ... + trailing padding
```

Không distribute extra spaces giữa words.

Nếu line chỉ có một word thì không có gap để chia, nên cũng left-justify và pad ở cuối.

---

## 5. Correctness / Vì sao đúng

Greedy packing chọn maximum prefix words có thể fit trong mỗi line, đúng yêu cầu trực tiếp của đề.

Với normal line, quotient/remainder distribution sử dụng đúng `totalSpaces`, nên line có chính xác `maxWidth` characters; mọi gap chênh nhau nhiều nhất một space và các gap dư nằm bên trái, đúng specification.

Last/single-word line được nối bằng single spaces rồi pad cuối, đúng left-justification rule. Vì mọi word được dùng đúng một lần theo thứ tự ban đầu, toàn bộ output hợp lệ.

---

## 6. Complexity

Mỗi word được pack một lần và mỗi output character được append một lần.

Nếu `C` là tổng số output characters (số line × `maxWidth`):

```text
Time:  O(C)
Working space per line: O(maxWidth)
```

Output list không tính là auxiliary structure tránh được vì chính là kết quả trả về.

---

## 7. Edge cases

- Một word chiếm cả line.
- Single-word line cần trailing padding.
- Last line có nhiều words nhưng chỉ single spaces.
- Spaces chia không hết gaps → remainder về trái.
- Word dài đúng `maxWidth`.

---

## 8. Common mistakes

1. Quên tính minimum spaces khi packing.
2. Full-justify last line.
3. Chia `totalSpaces` cho số words thay vì số gaps.
4. Phát remainder về bên phải thay vì bên trái.
5. Chia cho zero khi line chỉ có một word.

---

## 9. Pattern recognition

Nhiều bài formatting Hard trở nên rõ hơn nếu tách **selection boundary** khỏi **rendering policy**. Ở đây greedy quyết định line membership; arithmetic quyết định exact spacing.
