# 30. Substring with Concatenation of All Words — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Mọi word có cùng length L, nên một concatenation hợp lệ chỉ bắt đầu ở một trong L offset classes. Trong mỗi class, ta đọc chuỗi theo block word thay vì từng ký tự.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Thử mọi start rồi copy/count toàn substring tốn nhiều công lặp. Quan sát block alignment cố định cho phép sliding window theo word; khi một word xuất hiện quá nhiều, shrink từng block từ trái.

**State / invariant / data structure cần hiểu trước code.** need[word] là frequency cần; seen[word] là frequency trong window; left/right chạy theo bước L và count là số word hiện có. Window hợp lệ khi không seen nào vượt need và count đúng số words.

**Dry run mental theo implementation.** Dry run s='barfoofoobar', words=['foo','bar'], L=3: offset0 đọc bar,foo -> đủ hai word nên record 0; đọc foo làm foo dư, shrink bar rồi foo cũ cho tới frequency hợp lệ.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là chỉ scan offset0, shrink theo ký tự hoặc quên duplicate words. Khi nào dùng: fixed-length tokens tạo natural block-aligned sliding windows thay vì character windows.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Ta không trượt theo từng character bên trong một alignment; ta trượt theo **token** có kích thước cố định `wordLength`.

Vì valid concatenation có thể bắt đầu ở bất kỳ index nào, ta chia search thành `wordLength` alignment:

```text
offset = 0 .. wordLength-1
```

Trong mỗi alignment, mọi bước của `right` và `left` đều nhảy đúng `wordLength`.

---

## 2. Frequency model

Tạo map:

```text
need[word] = số lần word phải xuất hiện
```

Current window duy trì:

```text
seen[word] = số lần word đang xuất hiện
count = tổng số token trong window
```

Ba trường hợp cho token mới:

1. Không thuộc `need` → reset toàn bộ window.
2. Thuộc `need` nhưng vượt quota → shrink từ trái tới khi quota hợp lệ.
3. Window có đúng `words.length` token → current `left` là answer.

---

## 3. Optimal Java solution

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<Integer> findSubstring(String s, String[] words) {
        List<Integer> answer = new ArrayList<>();
        int wordLength = words[0].length();
        int wordCount = words.length;
        int totalLength = wordLength * wordCount;

        if (totalLength > s.length()) {
            return answer;
        }

        Map<String, Integer> need = new HashMap<>();
        for (String word : words) {
            need.put(word, need.getOrDefault(word, 0) + 1);
        }

        // Candidate starts có wordLength residue classes khác nhau. Quét từng offset
        // riêng giúp left/right luôn đứng đúng token boundary thay vì thử từng character.
        for (int offset = 0; offset < wordLength; offset++) {
            int left = offset;
            int count = 0;
            Map<String, Integer> seen = new HashMap<>();

            for (int right = offset; right + wordLength <= s.length(); right += wordLength) {
                String word = s.substring(right, right + wordLength);

                // Token ngoài dictionary không thể thuộc bất kỳ valid window nào bắc qua nó,
                // nên toàn bộ state trước token này có thể bỏ và restart ngay sau nó.
                if (!need.containsKey(word)) {
                    seen.clear();
                    count = 0;
                    left = right + wordLength;
                    continue;
                }

                seen.put(word, seen.getOrDefault(word, 0) + 1);
                count++;

                // Chỉ current word vừa có thể vượt quota. Shrink tới khi bỏ được một
                // occurrence thừa, giữ suffix dài nhất còn thỏa mọi frequency bound.
                while (seen.get(word) > need.get(word)) {
                    String leftWord = s.substring(left, left + wordLength);
                    seen.put(leftWord, seen.get(leftWord) - 1);
                    left += wordLength;
                    count--;
                }

                if (count == wordCount) {
                    // Mọi token đều thuộc need và không quota nào bị vượt; khi tổng token
                    // bằng tổng quota, toàn bộ frequency bắt buộc khớp chính xác.
                    answer.add(left);

                    // Bỏ một token để tiếp tục tìm các match overlapping trong cùng alignment.
                    String leftWord = s.substring(left, left + wordLength);
                    seen.put(leftWord, seen.get(leftWord) - 1);
                    left += wordLength;
                    count--;
                }
            }
        }

        return answer;
    }
}
```

---

## 4. Why offsets are necessary

Nếu `wordLength = 3`, token boundaries của một candidate start tại index `1` là:

```text
1,4,7,10,...
```

Window bắt đầu ở offset `0` chỉ thấy boundaries:

```text
0,3,6,9,...
```

Nên cần chạy tất cả offsets `0..wordLength-1` để phủ mọi possible start index.

---

## 5. Why shrinking on excess is correct

Giả sử token `foo` vừa làm:

```text
seen[foo] > need[foo]
```

Bất kỳ valid window kết thúc tại current `right` phải loại ít nhất một occurrence `foo` cũ. Shrink từ trái từng token cho tới khi occurrence thừa bị loại sẽ tạo left nhỏ nhất còn hợp lệ cho suffix hiện tại.

---

## 6. Dry run

```text
s = "barfoothefoobarman"
words = ["foo","bar"]
wordLength = 3
```

Offset `0` đọc token:

```text
bar -> foo
```

`count=2`, frequencies khớp → add `0`.

Sau khi advance một token, gặp `the` → reset.

Tiếp theo:

```text
foo -> bar
```

window bắt đầu tại `9` → add `9`.

---

## 7. Correctness / Vì sao đúng

Mỗi valid concatenation có một start index với một offset duy nhất modulo `wordLength`, nên nó được xét trong đúng một alignment. Trong alignment đó, window boundaries luôn nằm trên token boundaries.

`seen` luôn được shrink để không word nào vượt `need`. Khi `count == words.length`, window chứa đúng số token cần thiết; vì mọi token đều thuộc `need` và không frequency nào vượt quota, tổng số token bằng tổng quota nên mọi frequency phải khớp chính xác. Do đó `left` là valid answer.

Ngược lại, mọi valid answer sẽ đạt trạng thái frequency khớp khi `right` đi tới token cuối của nó, nên không bị bỏ sót.

---

## 8. Complexity

Theo số token operations, mỗi alignment là tuyến tính theo số token của alignment. Trong Java, `substring` tạo/copy chuỗi dài `wordLength`, nên một bound thực tế rõ ràng là:

```text
Time: O(n * wordLength)
Space: O(number of distinct words)
```

Với `wordLength <= 30`, đây là cách chuẩn và đủ nhanh.

---

## 9. Common mistakes

1. Chỉ chạy offset `0` và bỏ sót start không chia hết cho word length.
2. So sánh set thay vì frequency, sai khi `words` có duplicate.
3. Khi gặp invalid token không reset `left`/`seen`/`count` đồng bộ.
4. Sau match không advance một token, dễ báo lại cùng window hoặc làm count vượt kích thước.
