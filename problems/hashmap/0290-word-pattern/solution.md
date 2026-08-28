# 290. Word Pattern — Solution

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
