# 68. Text Justification — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Text justification có hai quyết định tách biệt: chọn bao nhiêu word vừa một line, rồi phân phối số space còn thiếu giữa các gap; last line lại dùng luật left-justified riêng.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Nối word rồi thêm space tùy hứng dễ sai vì bottleneck nằm ở việc chia đều và phần dư. Quan sát sau khi chốt một line, total letters và gap count xác định duy nhất base spaces và extra spaces.

**State / invariant / data structure cần hiểu trước code.** State của outer scan là range words cho line hiện tại. Khi format line thường, spaces = width-letters, gaps = count-1, mỗi gap nhận spaces/gaps và các gap trái đầu tiên nhận phần dư.

**Dry run mental theo implementation.** Dry run width=16 với 'This is an': letters=8, gaps=2, cần 8 spaces nên mỗi gap 4. Nếu cần 9 spaces, gap trái nhận 5 và gap phải 4.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chia space cho số word thay vì số gap, xử lý last line như line thường, hoặc quên line một word. Khi nào dùng: formatting có quota cố định thường nên tách selection phase và distribution phase.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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

## Optimal Java solution

```java
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> fullJustify(String[] words, int maxWidth) {
        List<String> result = new ArrayList<>();
        int i = 0;

        while (i < words.length) {
            int j = i + 1;
            int wordLength = words[i].length();

            // (j - i) là số space tối thiểu nếu thêm words[j].
            // Vì đề yêu cầu pack tối đa số từ, dừng đúng tại word đầu tiên không còn fit.
            while (j < words.length
                    && wordLength + (j - i) + words[j].length() <= maxWidth) {
                wordLength += words[j].length();
                j++;
            }

            int gaps = j - i - 1;
            boolean lastLine = j == words.length;
            StringBuilder line = new StringBuilder(maxWidth);

            // Last line bắt buộc left-justify; single-word line không có gap để chia,
            // nên hai trường hợp dùng cùng policy: một space giữa từ rồi pad phần còn lại ở cuối.
            if (lastLine || gaps == 0) {
                for (int k = i; k < j; k++) {
                    if (k > i) {
                        line.append(' ');
                    }
                    line.append(words[k]);
                }
                appendSpaces(line, maxWidth - line.length());
            } else {
                int totalSpaces = maxWidth - wordLength;
                // Chia quotient/remainder bảo đảm mọi gap chênh nhau nhiều nhất 1 space;
                // remainder phải được phát cho các gap bên trái theo yêu cầu đề.
                int baseSpaces = totalSpaces / gaps;
                int extraSpaces = totalSpaces % gaps;

                for (int k = i; k < j; k++) {
                    line.append(words[k]);
                    if (k < j - 1) {
                        int gapIndex = k - i;
                        int spaces = baseSpaces + (gapIndex < extraSpaces ? 1 : 0);
                        appendSpaces(line, spaces);
                    }
                }
            }

            result.add(line.toString());
            // j là word đầu tiên chưa được dùng, nên trở thành start của line kế tiếp.
            i = j;
        }

        return result;
    }

    private void appendSpaces(StringBuilder builder, int count) {
        for (int i = 0; i < count; i++) {
            builder.append(' ');
        }
    }
}
```

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
