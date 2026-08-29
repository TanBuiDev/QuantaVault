# 290. Word Pattern — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Pattern 'abba' và câu 'dog cat cat dog' khớp vì a luôn ứng với dog, b luôn ứng với cat và không word nào dùng chung cho hai pattern chars khác nhau.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Chỉ map char->word bỏ sót injectivity, giống Isomorphic Strings. Quan sát cần bijection giữa pattern symbols và words; dùng hai maps hoặc map plus used-word set.

**State / invariant / data structure cần hiểu trước code.** Mapping phải one-to-one trên prefix token đã xử lý. Trước hết số words phải bằng pattern length; mỗi vị trí hoặc xác nhận mapping cũ hoặc tạo mapping mới mà target word chưa thuộc symbol khác.

**Dry run mental theo implementation.** Dry run abba / dog cat cat dog: a->dog,b->cat, hai vị trí sau match reverse. Với abba / dog cat cat fish, a ở cuối đòi dog nhưng gặp fish nên false.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là quên check token count hoặc uniqueness phía word. Khi nào dùng: pattern matching theo rename cần bijection, không chỉ frequency hay one-way mapping.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Bài toán yêu cầu bijection giữa hai tập khác kiểu dữ liệu:

```text
pattern character <-> word
```

Vì vậy cần kiểm tra consistency theo **hai chiều**.

---

## 2. Optimal Java solution

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ");
        if (words.length != pattern.length()) {
            return false;
        }

        Map<Character, String> charToWord = new HashMap<>();
        Map<String, Character> wordToChar = new HashMap<>();

        for (int i = 0; i < words.length; i++) {
            char c = pattern.charAt(i);
            String word = words[i];

            // Forward map bảo đảm một pattern char không đổi target word.
            if (charToWord.containsKey(c) && !charToWord.get(c).equals(word)) {
                return false;
            }

            // Reverse map là phần bắt buộc để bảo đảm one-to-one: hai char khác nhau
            // không được cùng map vào một word dù forward map riêng lẻ vẫn nhất quán.
            if (wordToChar.containsKey(word) && wordToChar.get(word) != c) {
                return false;
            }

            charToWord.put(c, word);
            wordToChar.put(word, c);
        }

        return true;
    }
}
```

---

## 3. Why two maps are necessary

Ví dụ `pattern = "ab"`, `s = "dog dog"`. Nếu chỉ lưu `char -> word`, cả `a -> dog` và `b -> dog` đều có vẻ nhất quán riêng lẻ, nhưng mapping không one-to-one. Reverse map phát hiện `dog` đã thuộc `a` khi xử lý `b`.

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

---

## 6. Common mistakes

- Không kiểm tra số word bằng pattern length.
- Chỉ dùng một map.
- Dùng `==` để so sánh Java `String` thay vì `.equals()`.
- Nhầm bijection với chỉ “mỗi char có một word”.
